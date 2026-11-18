# Day 11 — Interview Questions & Answers

## Event loop and scheduling

1. **What is the event loop?**  
   The host scheduling mechanism that coordinates JavaScript tasks, microtasks, and rendering opportunities.

2. **What is a task?**  
   A unit of scheduled work such as a script, timer callback, or many event callbacks.

3. **What is a microtask?**  
   Queued work such as Promise reactions and queueMicrotask callbacks, drained at a microtask checkpoint.

4. **What is a microtask checkpoint?**  
   A point where the host drains queued microtasks after the current task's JavaScript completes.

5. **Does the browser paint after every task?**  
   No. Rendering happens when the browser determines an update is appropriate.

6. **Can microtasks delay rendering?**  
   Yes. A long or continually replenished microtask queue can delay rendering or another task.

## Rendering pipeline

7. **What is the simplified browser rendering pipeline?**  
   Style calculation → layout → paint → composite. Engines optimize and may skip stages.

8. **What is layout/reflow?**  
   Recalculating the geometry and positions of elements.

9. **What is repaint?**  
   Redrawing visual appearance such as colors, backgrounds, borders, and shadows without necessarily recalculating geometry.

10. **What is compositing?**  
    Combining layers into the final frame shown on screen.

11. **Does every CSS property map to exactly one rendering stage?**  
    No. The rendering path depends on the property, element, browser optimizations, effects, and layer decisions.

12. **Why are transform and opacity often recommended for animation?**  
    They can often be handled efficiently by the compositor and avoid repeated layout, though this is not guaranteed in every case.

13. **What is layout thrashing?**  
    Repeated layout work caused by alternating DOM/style writes with geometry reads.

14. **Which reads can force layout?**  
    Values such as offsetWidth, offsetHeight, and getBoundingClientRect may require current layout, especially after writes.

15. **How do you reduce layout thrashing?**  
    Batch geometry reads together, then batch DOM/style writes.

## Animation and scheduling APIs

16. **What does requestAnimationFrame do?**  
    It asks the browser to call a function before a future repaint.

17. **Why should animation use the rAF timestamp?**  
    It makes movement depend on elapsed time rather than callback count, so speed is less dependent on display refresh rate.

18. **Does rAF always run at 60fps?**  
    No. Refresh rates vary, and callbacks can be throttled or paused in background tabs.

19. **How do you cancel rAF?**  
    Pass the returned ID to cancelAnimationFrame.

20. **requestAnimationFrame vs setTimeout?**  
    rAF is aligned with visual rendering opportunities; setTimeout schedules a delayed task and is not a reliable animation clock.

21. **What is requestIdleCallback?**  
    It schedules low-priority work during browser idle periods. Support varies, so provide a fallback and use a timeout when appropriate.

22. **What is deadline.timeRemaining()?**  
    An estimate of the idle time remaining in the current requestIdleCallback opportunity.

23. **What is deadline.didTimeout?**  
    It indicates the idle callback ran because its timeout expired.

## Performance

24. **What is a long task?**  
    A main-thread task commonly defined as taking more than 50ms.

25. **Why are long tasks harmful?**  
    They delay input handling, timers, rendering, and animations.

26. **What is the frame interval at 60Hz?**  
    About 16.7ms. At 120Hz it is about 8.3ms; the application has less than the full interval because browser work also takes time.

27. **How do you improve scroll performance?**  
    Keep handlers short, coalesce visual updates with rAF, and use passive listeners where appropriate.

28. **When should you use a Web Worker?**  
    For CPU-heavy work that can run without direct DOM access.

29. **How do you measure JavaScript execution time?**  
    Use performance.now(), console.time(), and Performance APIs.

30. **Should you optimize based only on assumptions?**  
    No. Measure first, identify the bottleneck, change one thing, and measure again.

## Output-based question

What is the guaranteed synchronous and microtask order here?

    console.log("A");
    setTimeout(() => console.log("B"), 0);
    Promise.resolve().then(() => console.log("C"));
    queueMicrotask(() => console.log("D"));
    console.log("E");

**Answer:** A and E run synchronously first. C and D run as microtasks in the order they were queued. B runs as a later task. A rendering callback, if added, participates in a browser rendering opportunity; do not infer that every task is followed by a paint.
