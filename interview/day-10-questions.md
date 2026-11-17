# Day 10 — Interview Questions & Answers

## Core concepts
1. **What is asynchronous JavaScript?**  
   It allows the program to start work such as network requests or timers and continue running other code while waiting.

2. **What is a Promise?**  
   An object representing the eventual fulfillment value or rejection reason of an asynchronous operation.

3. **What are the Promise states?**  
   Pending, fulfilled, and rejected. Fulfilled and rejected are settled states.

4. **Does the Promise executor run asynchronously?**  
   No. The executor passed to new Promise runs immediately. Reactions registered with then/catch run asynchronously as microtasks.

5. **What does an async function return?**  
   Always a Promise. A returned value fulfills it; a thrown error rejects it.

6. **Does await block the main thread?**  
   No. It suspends the current async function and schedules its continuation when the awaited value settles.

## Event loop and queues
7. **What is the call stack?**  
   A LIFO structure tracking currently executing JavaScript calls.

8. **What is a microtask? Give examples.**  
   A high-priority queued callback processed at a microtask checkpoint; Promise reactions and queueMicrotask are examples.

9. **What is a task?**  
   A unit of event-loop work such as a timer callback or many user-event callbacks.

10. **What runs first after synchronous code: a Promise reaction or a timer?**  
    In the usual browser example, Promise reactions (microtasks) run before the next timer task.

11. **Why is setTimeout(fn, 0) not immediate?**  
    It schedules a timer task; it cannot interrupt the current stack and is subject to event-loop scheduling.

## Promise APIs
12. **What does then return?**  
    A new Promise that adopts the handler's returned value/Promise or becomes rejected if the handler throws.

13. **Why must we return inside then?**  
    So the next link waits for and receives that value or Promise.

14. **then vs catch?**  
    then can handle fulfillment and optionally rejection; catch handles rejection.

15. **What does finally do?**  
    Runs after fulfillment or rejection, usually for cleanup, while preserving the original outcome unless finally itself fails.

16. **Promise.all vs Promise.allSettled?**  
    all fulfills only if all inputs fulfill and rejects on the first rejection. allSettled waits for every outcome and reports each status.

17. **Promise.race vs Promise.any?**  
    race settles with the first settled input. any fulfills with the first fulfilled input and rejects with AggregateError if all reject.

18. **Does Promise.all cancel other requests after one rejects?**  
    No. It rejects its own combined Promise; cancellation requires a separate mechanism such as AbortController.

## Fetch and frontend practice
19. **Does fetch reject on HTTP 404 or 500?**  
    Normally no. It fulfills with a Response; check response.ok/status and throw when the status is unacceptable.

20. **What does response.json() return?**  
    A Promise that resolves to the parsed body.

21. **How do you cancel fetch?**  
    Create an AbortController, pass controller.signal to fetch, then call controller.abort().

22. **Sequential vs parallel requests?**  
    Sequential awaits one before starting the next, useful for dependencies. Parallel starts independent operations together, often using Promise.all.

23. **Why is forEach(async ...) a problem?**  
    forEach does not collect or await callback Promises. Use for...of for sequential work or Promise.all(array.map(...)) for parallel work.

24. **What happens when an async function throws?**  
    Its returned Promise rejects with that error.

## Output question
Predict:
```js
console.log("one");
setTimeout(() => console.log("two"), 0);
Promise.resolve().then(() => console.log("three"));
queueMicrotask(() => console.log("four"));
console.log("five");
```
**Answer:** one, five, three, four, two. The Promise reaction and queueMicrotask callback are microtasks, queued in that order; the timer callback is a later task.
