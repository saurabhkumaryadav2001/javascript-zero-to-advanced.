# Day 10 — Asynchronous JavaScript

## Learning goals
- Explain why asynchronous work keeps browser interfaces responsive.
- Trace synchronous code, tasks, microtasks, and the event loop.
- Create and consume Promises; understand chaining and error propagation.
- Use async/await, try/catch, and Promise combinators.
- Fetch HTTP data safely and cancel obsolete requests with AbortController.
- Choose sequential vs parallel execution correctly.

## 1. Why asynchronous JavaScript?
Network requests, timers, and user events can take time. Blocking the JavaScript thread while waiting would make the UI unresponsive. JavaScript runs synchronous code on its current call stack; the browser/host handles external work and schedules callbacks when ready.

```js
console.log("A");
setTimeout(() => console.log("timer"), 0);
console.log("B");
// A, B, timer
```

A 0ms timer is not immediate. Its callback becomes eligible after the delay and runs when scheduling rules allow it.

## 2. Call stack, host APIs, queues, event loop
- **Call stack:** tracks currently executing function calls (LIFO).
- **Host APIs:** browser/Node facilities for timers, networking, events, etc.
- **Task queue:** callbacks such as timer callbacks and many event callbacks.
- **Microtask queue:** Promise reactions and queueMicrotask callbacks.
- **Event loop:** coordinates when queued work can run after the current JavaScript stack is clear.

```js
console.log("start");
setTimeout(() => console.log("timer task"), 0);
Promise.resolve().then(() => console.log("promise reaction"));
console.log("end");
// start
// end
// promise reaction
// timer task
```

This is the standard browser mental model: synchronous code first, then microtasks, then a later task. Rendering opportunities are controlled by the host and are not guaranteed after every individual callback.

## 3. Tasks vs microtasks
Tasks include timer callbacks and many user-event callbacks. Microtasks include Promise `.then()`, `.catch()`, `.finally()` reactions and `queueMicrotask()`.

After the current task's JavaScript finishes, the host drains the microtask queue before moving to another task. Microtasks queued by other microtasks are also drained in that checkpoint.

```js
console.log(1);
setTimeout(() => console.log(2), 0);
queueMicrotask(() => console.log(3));
Promise.resolve().then(() => console.log(4));
console.log(5);
// 1, 5, 3, 4, 2
```

Too many microtasks can delay timers and rendering.

## 4. What is a Promise?
A Promise represents the eventual completion or failure of an asynchronous operation.

States:
1. **pending** — not settled yet
2. **fulfilled** — completed with a value
3. **rejected** — failed with a reason

A Promise settles only once. Fulfilled and rejected are both called settled states.

```js
const savePromise = new Promise((resolve, reject) => {
  // The executor runs synchronously.
  const saved = true;
  if (saved) resolve("Saved successfully");
  else reject(new Error("Save failed"));
});
```

Calling resolve/reject settles the promise; subsequent attempts to settle it do not change its state.

## 5. then(), catch(), finally()
```js
fetch("/api/users")
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(users => console.log(users))
  .catch(error => console.error(error))
  .finally(() => console.log("request finished"));
```

- `then(onFulfilled, onRejected)` registers reactions and returns a **new Promise**.
- `catch(onRejected)` handles a rejection; it is equivalent to `then(undefined, onRejected)`.
- `finally(callback)` runs after settlement, usually for cleanup. It normally preserves the original fulfillment value or rejection reason unless the callback throws or returns a rejected Promise.

## 6. Promise chaining — return matters
```js
Promise.resolve(2)
  .then(value => value * 3)
  .then(value => {
    console.log(value); // 6
    return value + 1;
  })
  .then(value => console.log(value)); // 7
```

Each `then` creates a new Promise:
- Return a plain value → next Promise fulfills with it.
- Return a Promise/thenable → chain adopts its eventual state.
- Throw an error → next Promise rejects.

Forgetting `return` often causes the next step to receive `undefined` before the asynchronous work has completed.

## 7. async and await
An `async` function always returns a Promise. Returning a value fulfills that Promise; throwing rejects it. `await` suspends only the current async function until the awaited value settles. It does **not** block the JavaScript thread.

```js
async function loadUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

loadUsers()
  .then(users => console.log(users))
  .catch(error => console.error(error));
```

`await` accepts Promises and ordinary values. Use try/catch for local error handling:

```js
async function loadUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Could not load users:", error);
    throw error; // rethrow when the caller must also know
  }
}
```

Do not silently swallow errors unless returning a deliberate fallback is part of the function's contract.

## 8. Sequential vs parallel work
**Sequential:** use when later work depends on earlier output.

```js
const user = await fetchUser();
const orders = await fetchOrders(user.id);
```

**Parallel:** use when operations are independent.

```js
const [users, products] = await Promise.all([
  fetchUsers(),
  fetchProducts()
]);
```

Parallel execution can reduce total waiting time. `Promise.all` does not automatically cancel the remaining operations if one rejects.

## 9. Promise combinators
| Method | Behavior | Use case |
|---|---|---|
| `Promise.all()` | Fulfilled results in input order when all fulfill; rejects on first rejection | All requests are required |
| `Promise.allSettled()` | Waits for every outcome | Show partial success/failure |
| `Promise.race()` | First settled input wins (fulfillment or rejection) | Race a timeout against work |
| `Promise.any()` | First fulfillment wins; rejects with AggregateError if all reject | Try fallback endpoints |

Empty input details: `all([])` and `allSettled([])` fulfill with empty arrays; `race([])` remains pending; `any([])` rejects with AggregateError.

```js
const outcomes = await Promise.allSettled([
  fetchProfile(),
  fetchNotifications()
]);
// Each item has status and either value or reason.
```

## 10. fetch() and HTTP errors
`fetch()` returns a Promise. Network-level failures (offline, DNS/network error, CORS failure) reject it. HTTP 404/500 responses normally **fulfill** with a Response, so check `response.ok` or `response.status`.

```js
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json(); // also returns a Promise
}
```

A response body is generally consumable once. Do not parse the same body twice without cloning the Response first.

## 11. AbortController — cancel obsolete requests
Useful for search-as-you-type, route changes, and component cleanup.

```js
const controller = new AbortController();

try {
  const response = await fetch("/api/search?q=angular", {
    signal: controller.signal
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const results = await response.json();
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request cancelled");
  } else {
    throw error;
  }
}

// Call when a newer search starts or the component is cleaned up:
controller.abort();
```

Aborting cancels client-side fetch work; it does not guarantee the server has undone work it already received.

## 12. Practical frontend example — abort the previous search
```js
let activeController;

async function searchUsers(query) {
  activeController?.abort();
  activeController = new AbortController();

  try {
    const response = await fetch(
      `/api/users?q=${encodeURIComponent(query)}`,
      { signal: activeController.signal }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") return null;
    throw error;
  }
}
```

In a real component, abort on unmount/route cleanup too. Debouncing is a separate technique: it reduces how often requests start; aborting cancels a request already in progress.

## 13. Common mistakes
- Assuming `setTimeout(fn, 0)` runs before synchronous code.
- Assuming the Promise executor runs asynchronously (it runs immediately).
- Forgetting to return from a `.then()` handler.
- Assuming fetch rejects for HTTP 404/500; check `response.ok`.
- Using `await` inside a non-async function.
- Assuming `forEach(async ...)` waits for its callbacks.
- Expecting Promise.all to cancel other operations after one rejects.
- Running dependent operations in parallel.
- Swallowing an error in catch and accidentally reporting success.
- Not cancelling stale requests when inputs/components change.

## 14. Interview questions and answers
1. **What is asynchronous JavaScript?** Starting work and continuing other code while waiting for network, timers, or host operations.
2. **What is a Promise?** An object representing a future fulfillment value or rejection reason.
3. **Promise states?** Pending, fulfilled, rejected.
4. **Does the Promise executor run synchronously?** Yes.
5. **What does an async function return?** Always a Promise.
6. **Does await block the main thread?** No; it suspends the current async function.
7. **Microtask examples?** Promise reactions and queueMicrotask callbacks.
8. **Task examples?** Timer callbacks and many event callbacks.
9. **Which runs first after synchronous code: microtasks or next task?** Microtasks are drained first.
10. **then vs catch?** then handles fulfillment and optionally rejection; catch handles rejection.
11. **Why return from then?** To pass a value/Promise to the next link.
12. **Promise.all vs allSettled?** all rejects on first rejection; allSettled waits for every outcome.
13. **race vs any?** race returns first settlement; any returns first fulfillment.
14. **Does fetch reject on 404?** Normally no; check response.ok/status.
15. **How cancel fetch?** Pass AbortController.signal and call abort().
16. **How run independent requests concurrently?** Promise.all or allSettled.
17. **How run dependent requests?** Await the first result, then start the next.
18. **What if an async function throws?** Its returned Promise rejects.

## 15. Hands-on coding tasks
### Beginner
- Create a Promise that resolves with "Done" after a timer; consume it with then.
- Create a rejected Promise and handle it with catch.
- Predict output for synchronous logs, setTimeout, Promise.then, and queueMicrotask.

### Intermediate
- Convert a then/catch chain into async/await with try/catch.
- Write fetchJson(url) that checks response.ok and returns parsed JSON.
- Use Promise.all for two independent mocked requests.
- Use allSettled and display success and failure outcomes.
- Write dependent calls: get user, then get that user's orders.

### Advanced
- Implement timeoutWithAbort using AbortController and a timer.
- Implement search that aborts the previous request.
- Explain why forEach(async ...) does not wait; fix it sequentially and in parallel.
- Draw the call stack, microtask queue, and task queue for a mixed snippet.

## 16. Revision sheet
- Synchronous code runs on the current call stack.
- Host APIs manage timers/network/events.
- Promise executor runs synchronously.
- Promise states: pending → fulfilled OR rejected.
- then/catch return new Promises.
- async function always returns a Promise.
- await pauses only its async function, not the main thread.
- Microtasks: Promise reactions, queueMicrotask.
- Tasks: timers and many event callbacks.
- Microtasks drain before the next task.
- fetch rejects on network errors, not ordinary HTTP 404/500.
- Check response.ok; response.json() returns a Promise.
- all = all fulfill; allSettled = every outcome; race = first settlement; any = first fulfillment.
- AbortController + signal cancels client-side fetch work.

**10-minute revision:** Trace a sync/promise/timer snippet; write fetchJson with status checking; explain all four Promise combinators; implement abortable search.

## Next lesson
**Day 11 — Event loop deep dive, browser rendering, requestAnimationFrame, and practical scheduling patterns.**
