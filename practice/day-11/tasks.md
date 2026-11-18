# Day 11 — Practice Tasks

Try these in a browser before checking the lesson. Use DevTools Console and Performance panel.

## Beginner
1. Log a synchronous message, a setTimeout callback, a Promise.then callback, a queueMicrotask callback, and a requestAnimationFrame callback. Record the order you observe. Explain which parts are guaranteed and which depend on rendering opportunities.
2. Create a box in HTML and animate it 200px over one second using the timestamp passed to requestAnimationFrame.
3. Store the requestAnimationFrame ID and stop the animation with cancelAnimationFrame.
4. Explain why moving 5px per animation callback can make an animation faster on a high-refresh-rate display.

## Intermediate
5. Compare a setTimeout-based animation with requestAnimationFrame. Look for smoothness and timing differences.
6. Write a scroll listener that schedules at most one visual update per animation frame.
7. Demonstrate layout thrashing by alternating style writes and offsetWidth reads. Then refactor to perform all reads first and all writes second.
8. Measure a data transformation using performance.now() and console.time()/console.timeEnd().
9. Use requestIdleCallback with a timeout to process a list in small chunks. Add a setTimeout fallback and explain why it is not true idle scheduling.
10. Use PerformanceObserver to observe long tasks where supported; handle unsupported browsers safely.

## Advanced
11. Process 10,000 records in small chunks and keep the UI responsive. Compare chunking with doing all work in one synchronous loop.
12. Move a CPU-heavy calculation into a Web Worker. Send input to the worker and render the returned result.
13. Explain which rendering stages may be needed after changing width, background-color, transform, and opacity. Avoid claiming that a property always maps to exactly one stage.
14. Use the browser Performance panel to identify a long task and explain its cause.

## Output prediction
Predict the synchronous and queued callback order. Then run it in a browser and explain the observed rendering opportunity:

    console.log("A");
    setTimeout(() => console.log("B"), 0);
    Promise.resolve().then(() => console.log("C"));
    queueMicrotask(() => console.log("D"));
    requestAnimationFrame(() => console.log("E"));
    console.log("F");

Do not assume every browser or tab state will show an identical relationship between rAF and timer callbacks.

## Self-review checklist
- [ ] I can explain task vs microtask.
- [ ] I know the browser does not paint after every task.
- [ ] I can describe style, layout, paint, and composite.
- [ ] I can explain layout thrashing and batch reads/writes.
- [ ] I can animate using the rAF timestamp.
- [ ] I can cancel a scheduled animation frame.
- [ ] I know requestIdleCallback support varies.
- [ ] I can explain long tasks and frame budgets.
- [ ] I can measure before optimizing.
