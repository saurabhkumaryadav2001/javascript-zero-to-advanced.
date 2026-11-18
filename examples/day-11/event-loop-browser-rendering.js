// Day 11 — Event Loop Deep Dive & Browser Rendering
// Run in a browser console or load from an HTML page.
// Some sections require DOM elements and browser APIs.
"use strict";

// 1. Observe synchronous code, microtasks, timers, and rAF.
// Do not treat rAF-vs-timer ordering as a universal guarantee.
console.log("sync start");
setTimeout(() => console.log("timer task"), 0);
Promise.resolve().then(() => console.log("promise microtask"));
queueMicrotask(() => console.log("queueMicrotask"));
if (typeof requestAnimationFrame === "function") {
  requestAnimationFrame(() => console.log("animation-frame callback"));
}
console.log("sync end");

// 2. Animate an element for about one second using elapsed time.
// Browser usage:
// const stop = animateForOneSecond(document.querySelector(".box"));
function animateForOneSecond(element) {
  if (!element || typeof requestAnimationFrame !== "function") {
    throw new Error("Pass a DOM element in a browser with requestAnimationFrame.");
  }

  let startTime;
  let frameId;
  let cancelled = false;

  function frame(timestamp) {
    if (cancelled) return;
    if (startTime === undefined) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / 1000, 1);
    const x = 200 * progress;

    element.style.transform = "translateX(" + x + "px)";

    if (progress < 1) {
      frameId = requestAnimationFrame(frame);
    }
  }

  frameId = requestAnimationFrame(frame);

  return function stop() {
    cancelled = true;
    cancelAnimationFrame(frameId);
  };
}

// 3. Coalesce visual work triggered by frequent scroll events.
function installScrollProgressUpdater(updateProgress) {
  let scheduled = false;

  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      updateProgress(window.scrollY);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// 4. Read layout first, then write styles.
function copyMeasuredHeights(cards) {
  const heights = cards.map(card => card.getBoundingClientRect().height);

  cards.forEach((card, index) => {
    card.style.setProperty("--measured-height", heights[index] + "px");
  });
}

// 5. Process a large list in small timer-yielding chunks.
// setTimeout is a fallback scheduling technique, not true idle time.
function processInChunks(items, processOne, chunkSize = 100) {
  let index = 0;

  function runChunk() {
    const end = Math.min(index + chunkSize, items.length);

    while (index < end) {
      processOne(items[index]);
      index++;
    }

    if (index < items.length) setTimeout(runChunk, 0);
  }

  runChunk();
}

// 6. Optional idle processing. Use only for non-critical work.
function processWhenIdle(items, processOne) {
  let index = 0;

  function run(deadline) {
    while (
      index < items.length &&
      (deadline.timeRemaining() > 1 || deadline.didTimeout)
    ) {
      processOne(items[index]);
      index++;
    }

    if (index < items.length) schedule(run);
  }

  function schedule(callback) {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(callback, { timeout: 1000 });
    } else {
      // Compatibility fallback; this is not genuine idle scheduling.
      setTimeout(() => callback({
        timeRemaining: () => 0,
        didTimeout: true
      }), 0);
    }
  }

  schedule(run);
}

// 7. Measure synchronous work.
function measureWork(label, work) {
  const start = performance.now();
  const result = work();
  const duration = performance.now() - start;
  console.log(label + ": " + duration.toFixed(2) + "ms");
  return result;
}

// 8. Observe long tasks where supported by the browser.
function observeLongTasks() {
  if (typeof PerformanceObserver === "undefined") {
    console.warn("PerformanceObserver is not available.");
    return null;
  }

  try {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        console.warn("Long task observed:", entry.duration.toFixed(1), "ms");
      }
    });

    observer.observe({ type: "longtask", buffered: true });
    return observer;
  } catch (error) {
    console.warn("Long-task observation is unsupported:", error.message);
    return null;
  }
}

// Uncomment in a browser to observe long tasks:
// const longTaskObserver = observeLongTasks();
// Later: longTaskObserver?.disconnect();
