// Day 10 — Asynchronous JavaScript
// Run with Node.js: node examples/day-10/async-javascript.js
"use strict";

// 1. Synchronous code, task, microtasks
console.log("start");
setTimeout(() => console.log("timer task"), 0);
queueMicrotask(() => console.log("queueMicrotask"));
Promise.resolve().then(() => console.log("promise reaction"));
console.log("end");
// Expected: start, end, queueMicrotask, promise reaction, timer task

// 2. Promise executor is synchronous; reactions run later
const saved = new Promise(resolve => {
  console.log("executor runs now");
  resolve("saved");
});
saved.then(value => console.log(value));

// 3. Chaining and error propagation
Promise.resolve(2)
  .then(value => value * 3)
  .then(value => {
    if (value !== 6) throw new Error("Unexpected value");
    return value + 1;
  })
  .then(console.log) // 7
  .catch(error => console.error("Chain failed:", error.message))
  .finally(() => console.log("chain settled"));

// 4. Async/await and error handling
async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Example: uncomment to try against an API endpoint.
// getJson("https://jsonplaceholder.typicode.com/users/1")
//   .then(console.log)
//   .catch(console.error);

// 5. Sequential vs parallel
async function sequentialExample() {
  const user = await Promise.resolve({ id: 7 });
  const orders = await Promise.resolve([{ userId: user.id, total: 250 }]);
  return { user, orders };
}

async function parallelExample() {
  const [users, products] = await Promise.all([
    Promise.resolve(["Asha", "Ravi"]),
    Promise.resolve(["Keyboard", "Mouse"])
  ]);
  return { users, products };
}

sequentialExample().then(console.log);
parallelExample().then(console.log);

// 6. Promise combinators
Promise.allSettled([
  Promise.resolve("profile loaded"),
  Promise.reject(new Error("notifications unavailable"))
]).then(console.log);

Promise.any([
  Promise.reject(new Error("replica A failed")),
  Promise.resolve("replica B responded")
]).then(console.log);

// 7. AbortController (browser or modern Node.js)
async function fetchWithAbort(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// Example: uncomment to try.
// fetchWithAbort("https://jsonplaceholder.typicode.com/todos/1")
//   .then(console.log)
//   .catch(error => {
//     if (error.name === "AbortError") console.log("Timed out/cancelled");
//     else console.error(error);
//   });

// 8. Abort previous search when a new one starts
let activeController;
async function searchUsers(query) {
  activeController?.abort();
  activeController = new AbortController();

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?username=${encodeURIComponent(query)}`,
      { signal: activeController.signal }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") return null;
    throw error;
  }
}

// Uncomment to try in a browser/Node runtime with fetch.
// searchUsers("Bret").then(console.log).catch(console.error);
