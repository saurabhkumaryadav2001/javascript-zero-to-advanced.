# Day 10 — Practice Tasks

Try these before reading solutions. Run examples with Node.js or in browser DevTools.

## Beginner
1. Create a Promise that resolves with "Done" after 500ms; consume it with then().
2. Create a rejected Promise and handle it with catch().
3. Predict the output order:
   ```js
   console.log("A");
   setTimeout(() => console.log("B"), 0);
   Promise.resolve().then(() => console.log("C"));
   queueMicrotask(() => console.log("D"));
   console.log("E");
   ```
4. Explain why the Promise executor runs synchronously but its .then callback runs later.

## Intermediate
5. Convert a .then().catch() chain into async/await with try/catch.
6. Implement fetchJson(url): fetch, check response.ok, parse JSON, propagate errors.
7. Use Promise.all for two independent mocked API calls.
8. Use Promise.allSettled to show which of three calls succeeded or failed.
9. Write dependent calls: fetch a user, then fetch that user's orders.
10. Explain why this does not wait:
    ```js
    items.forEach(async item => await save(item));
    ```
    Fix it sequentially with for...of and concurrently with Promise.all(items.map(...)).

## Advanced
11. Implement a timeout wrapper using AbortController and clear its timer in finally.
12. Implement searchUsers(query) that aborts the previous fetch when a new query starts.
13. Design error handling that distinguishes AbortError, HTTP errors, and network errors.
14. Draw the call stack, microtask queue, and task queue for a snippet containing sync logs, Promise.then, queueMicrotask, and setTimeout.
15. Explain why Promise.all rejection does not cancel the remaining operations.

## Self-review checklist
- [ ] I can explain Promise states.
- [ ] I know the executor runs synchronously.
- [ ] I can trace microtask vs task order.
- [ ] I can return values correctly in Promise chains.
- [ ] I can write async/await with try/catch.
- [ ] I check response.ok after fetch.
- [ ] I can choose all, allSettled, race, or any.
- [ ] I can distinguish sequential from parallel work.
- [ ] I can cancel an obsolete fetch with AbortController.
