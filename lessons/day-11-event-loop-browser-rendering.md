# Day 11 — Event Loop Deep Dive & Browser Rendering

## Learning goals
- Explain how tasks, microtasks, and rendering opportunities interact.
- Describe the simplified browser rendering pipeline: style, layout, paint, composite.
- Distinguish layout/reflow, repaint, and compositing.
- Use requestAnimationFrame for smooth visual updates.
- Use requestIdleCallback carefully for non-urgent work.
- Identify layout thrashing and long tasks.
- Measure JavaScript work and choose chunking or Web Workers when appropriate.

## 1. JavaScript does not paint pixels
JavaScript runs inside a host environment. In a browser, the host provides APIs such as the DOM, timers, networking, input events, animation frames, and rendering.

JavaScript changes application state, DOM nodes, and CSS. The browser rendering engine calculates how the page should look and turns that result into pixels.

- JavaScript decides what should change.
- The browser rendering engine calculates styles, geometry, drawing, and layers.
- The display shows the composed frame.

Changing a DOM property is not the same thing as immediately seeing pixels change.

## 2. Event loop: tasks, microtasks, and rendering
A task (for example, a script, timer callback, or event callback) runs on the JavaScript thread. When its current JavaScript stack finishes, the host performs a microtask checkpoint and drains microtasks such as Promise reactions and queueMicrotask callbacks.

After that, the browser may update rendering if a rendering opportunity is due. It does not promise to paint after every task. A long task or a chain of microtasks can delay rendering and make the page feel frozen.

    console.log("script");
    setTimeout(() => console.log("timer task"), 0);
    Promise.resolve().then(() => console.log("promise microtask"));
    queueMicrotask(() => console.log("queued microtask"));
    console.log("end");

The synchronous logs run first. Promise and queueMicrotask callbacks run as microtasks after the current stack. The timer runs as a later task. Do not assume a rendering update occurs between every line or every task.

### Task vs microtask

| Task examples | Microtask examples |
|---|---|
| Timer callbacks | Promise.then/catch/finally reactions |
| Many user-event callbacks | queueMicrotask() |
| Message and event tasks | Mutation observer callbacks |

Microtasks are drained before the host proceeds to another task. A microtask that queues another microtask extends that drain. Unbounded microtask work can starve rendering and other tasks.

## 3. Simplified browser rendering pipeline

    JavaScript changes DOM / CSS
              |
              v
    Style calculation — which CSS rules apply?
              |
              v
    Layout (reflow) — where are boxes and how large?
              |
              v
    Paint — draw text, borders, backgrounds, shadows
              |
              v
    Composite — combine layers into the final frame
              |
              v
    Screen

This is a simplified mental model, not a strict list of work required for every change. Modern engines optimize, skip stages when possible, and may perform parts of rendering on different threads.

## 4. Layout/reflow vs repaint vs compositing

### Layout (often called reflow)
Layout calculates geometry: sizes and positions of boxes. Changes to width, height, padding, font-size, or content that changes document flow can require layout. A layout change commonly leads to paint and compositing too.

### Paint
Paint draws visual appearance: text, borders, backgrounds, shadows, and other pixels. A color change often needs paint but may not need layout.

### Composite
Compositing combines layers into the final frame. Some transform and opacity animations can be handled efficiently by the compositor, but this is not guaranteed for every element or effect. Browser heuristics, filters, clipping, layer promotion, and content all matter.

Prefer animating transform and opacity for motion/fades when appropriate. Avoid repeatedly animating layout properties such as top, left, width, and height unless the design requires it. Always measure the actual page.

## 5. Layout thrashing: repeated reads and writes
Some DOM reads need up-to-date layout information. Examples include offsetWidth, offsetHeight, and getBoundingClientRect().

If code changes styles and then immediately reads geometry, the browser may have to synchronously calculate layout. Repeating write → read → write → read can cause layout thrashing.

Avoid:

    items.forEach(item => {
      item.style.width = item.offsetWidth + 10 + "px";
    });

Prefer batching reads, then writes:

    const widths = items.map(item => item.offsetWidth);

    items.forEach((item, index) => {
      item.style.width = widths[index] + 10 + "px";
    });

The principle is not never read layout; it is avoid forcing layout repeatedly by interleaving reads and writes.

## 6. requestAnimationFrame()
requestAnimationFrame(callback) asks the browser to invoke a callback before a future repaint. It is designed for visual updates.

The callback receives a high-resolution timestamp. Use elapsed time rather than assuming the browser always renders at 60 frames per second.

    let startTime;
    let frameId;

    function animate(timestamp) {
      if (startTime === undefined) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const x = Math.min(elapsed * 0.3, 300); // 300px in about 1 second
      box.style.transform = "translateX(" + x + "px)";

      if (x < 300) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);

    // Stop a scheduled frame when no longer needed:
    cancelAnimationFrame(frameId);

### Why use the timestamp?
Displays may refresh at 60Hz, 90Hz, 120Hz, or a variable rate. If you move an element 5px per callback, it moves faster on a high-refresh-rate display. Time-based movement gives a more consistent duration.

### rAF vs setTimeout
- Use rAF for visual work that should align with repaint.
- Use setTimeout for a delay or later task.
- setTimeout(fn, 16) is not a reliable 60fps animation clock. Timers can be delayed, clamped, throttled, and are not synchronized to the display.
- rAF callbacks are commonly paused or throttled in background tabs.

## 7. requestIdleCallback()
requestIdleCallback(callback) asks the browser to run low-priority work when it believes there is idle time.

It is useful for optional work such as preparing non-critical data or processing a background list in small chunks. Browser support varies, so do not make essential work depend on it without a fallback.

    function processInIdle(items) {
      let index = 0;

      function work(deadline) {
        while (
          index < items.length &&
          (deadline.timeRemaining() > 1 || deadline.didTimeout)
        ) {
          processOne(items[index]);
          index++;
        }

        if (index < items.length) {
          requestIdleCallback(work, { timeout: 1000 });
        }
      }

      requestIdleCallback(work, { timeout: 1000 });
    }

Important:
- deadline.timeRemaining() estimates how much idle time remains.
- deadline.didTimeout indicates the timeout caused the callback to run.
- A timeout helps ensure work is not postponed forever.
- Process a small amount at a time; do not run a huge blocking loop in one idle callback.
- A setTimeout fallback is a compatibility fallback, not true idle time.

For CPU-heavy work, consider a Web Worker. A Worker cannot directly manipulate the DOM, but it can perform calculations and send results back.

## 8. Long tasks and frame budgets
A long task is commonly defined as a task occupying the main thread for more than 50ms. It can delay clicks, typing, timers, rendering, and animation.

At 60Hz, one frame interval is about 16.7ms. At 120Hz, it is about 8.3ms. The application has less than the full interval because the browser also needs time for rendering and other work.

Avoid large synchronous loops in UI event handlers. Options:
1. Reduce the amount of work.
2. Split work into small chunks and yield between chunks.
3. Use a Web Worker for suitable CPU-heavy computation.
4. Measure and optimize the actual bottleneck.

## 9. Measuring performance
Use performance.now() for high-resolution timing:

    const started = performance.now();
    doWork();
    console.log("Duration:", performance.now() - started, "ms");

Use console.time() and console.timeEnd() for quick measurements:

    console.time("transform");
    const result = data.map(transformRecord);
    console.timeEnd("transform");

Where supported, PerformanceObserver can observe long tasks:

    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            console.log("Long task:", entry.duration, "ms");
          }
        });

        observer.observe({ type: "longtask", buffered: true });
      } catch {
        console.log("Long-task observation is not supported here.");
      }
    }

Support for performance entry types varies. Measure before optimizing; do not guess.

## 10. Practical frontend patterns

### Coalesce scroll work into one visual update per frame

    let scheduled = false;

    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        updateProgressIndicator(window.scrollY);
      });
    }, { passive: true });

This coalesces multiple scroll events into at most one scheduled visual update per animation frame. The handler still needs to stay lightweight.

### Read first, then write

    const heights = cards.map(card =>
      card.getBoundingClientRect().height
    );

    cards.forEach((card, index) => {
      card.style.setProperty("--measured-height", heights[index] + "px");
    });

### Chunk non-urgent work
Process a limited number of records per chunk, then yield. For very CPU-intensive calculations, a Worker is often better than keeping the main thread busy.

## 11. Common mistakes
1. Assuming rAF always runs at exactly 60fps.
2. Moving a fixed number of pixels per frame instead of using the timestamp.
3. Using setTimeout(16) as a guaranteed animation clock.
4. Doing expensive work on every scroll or resize event.
5. Alternating DOM writes and layout reads.
6. Assuming transform/opacity always guarantee compositor-only rendering.
7. Putting essential work only in requestIdleCallback without a fallback or timeout.
8. Ignoring the idle deadline and doing too much work in one callback.
9. Assuming the browser paints after every task.
10. Optimizing without measuring.

## 12. Interview questions and answers

1. **What is the event loop?**  
   The host scheduling mechanism that coordinates tasks, microtasks, and rendering opportunities.

2. **What is a microtask checkpoint?**  
   A point where the host drains queued microtasks after the current task's JavaScript completes.

3. **Does the browser paint after every task?**  
   No. Rendering happens when the browser determines an update is appropriate.

4. **What is the simplified rendering pipeline?**  
   Style calculation → layout → paint → composite.

5. **What is reflow/layout?**  
   Recalculating element geometry and positions.

6. **What is repaint?**  
   Redrawing visual appearance without necessarily recalculating geometry.

7. **What is compositing?**  
   Combining layers into the final frame.

8. **What does requestAnimationFrame do?**  
   Schedules a callback before a future repaint.

9. **Why use the rAF timestamp?**  
   To make animation duration independent of refresh rate.

10. **rAF vs setTimeout?**  
    rAF aligns visual work with rendering; timers schedule delayed tasks.

11. **What is layout thrashing?**  
    Repeated layout work caused by interleaving geometry reads and DOM writes.

12. **What can force layout?**  
    Reading offsetWidth or getBoundingClientRect after style/DOM writes.

13. **What is requestIdleCallback?**  
    An API for scheduling low-priority work during browser idle periods; support varies.

14. **What is a long task?**  
    A main-thread task commonly exceeding 50ms.

15. **How can scroll performance be improved?**  
    Keep handlers short, coalesce visual work with rAF, and use passive listeners where appropriate.

16. **When should you use a Web Worker?**  
    For CPU-heavy work that can run without direct DOM access.

17. **Does transform always avoid paint?**  
    No. Browser heuristics and effects determine the rendering path.

18. **How do you measure JavaScript duration?**  
    performance.now(), console.time(), and Performance APIs.

## 13. Hands-on coding tasks

### Beginner
1. Log setTimeout, Promise.then, queueMicrotask, and rAF; explain the observed order in your browser.
2. Move a box 200px over one second using an rAF timestamp.
3. Cancel an animation using cancelAnimationFrame.

### Intermediate
4. Compare a timer-based animation with an rAF-based animation.
5. Coalesce scroll updates into one rAF callback.
6. Demonstrate layout thrashing, then refactor into read and write phases.
7. Measure a transformation using performance.now() and console.time().

### Advanced
8. Process 10,000 records in small chunks without freezing the UI.
9. Use requestIdleCallback with a timeout and a setTimeout fallback.
10. Observe long tasks where PerformanceObserver supports them.
11. Move CPU-heavy calculation into a Web Worker and send the result back.
12. Explain the style → layout → paint → composite pipeline aloud.

## 14. Revision sheet
- Event loop coordinates tasks, microtasks, and rendering opportunities.
- Microtasks drain after the current task and before the next task.
- Browser does not paint after every task.
- Simplified pipeline: Style → Layout → Paint → Composite.
- Layout/reflow = geometry; paint = drawing; composite = layers.
- rAF = visual callback before a future repaint.
- Use the rAF timestamp; never assume fixed 60fps.
- cancelAnimationFrame cancels a scheduled frame callback.
- requestIdleCallback = optional low-priority work; support varies.
- Long task commonly means more than 50ms on the main thread.
- Batch layout reads, then writes.
- Measure with performance.now() and Performance APIs.
- Use chunks or Web Workers for expensive CPU work.

**10-minute revision:** Explain the rendering pipeline aloud; implement timestamp-based rAF animation; identify a layout-thrashing pattern; explain idle callback vs Worker.

**Next lesson:** Day 12 — DOM fundamentals, selecting elements, creating/removing nodes, and safe DOM updates.
