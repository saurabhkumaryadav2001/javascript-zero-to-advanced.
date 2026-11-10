# Day 3 — Loops & Iteration

## Learning outcomes
By the end, you can repeat work safely, choose a loop, trace execution, process arrays and objects, understand async iteration pitfalls, and explain loop behavior in interviews.

## 1. Why loops?
A loop repeats a block. Instead of writing the same operation 100 times for 100 products, describe it once. Every loop has repeated work (body), a condition/source, and a way to finish.

```js
for (let i = 0; i < 3; i++) console.log(i); // 0, 1, 2
```

## 2. Classic `for`
Syntax: `for (initialization; condition; update) { body }`

Execution order:
1. Initialization runs once.
2. Condition is evaluated.
3. If truthy, body runs; otherwise the loop ends.
4. Update runs.
5. Return to step 2.

```js
for (let i = 0; i < 5; i++) console.log(i); // 0..4
```
The condition `i < 5` gives five runs when i starts at zero. A common off-by-one bug is `i <= array.length`; valid array indexes are 0 through length - 1.

### let vs var
`let` is block-scoped and creates per-iteration bindings; `var` is function-scoped. Prefer let/const.

## 3. while
Use when repetitions depend on state and the count is unknown. It checks before the body, so it can run zero times.

```js
let attempts = 0;
while (attempts < 3) {
  console.log("Attempt", attempts + 1);
  attempts++; // progress toward stopping
}
```
If the condition never becomes false, it is an infinite loop. Inspect condition and update together.

## 4. do...while
Condition is checked after the body; it always runs at least once. The trailing semicolon is conventional/required by grammar.

```js
let answer;
do {
  answer = prompt("Type yes");
} while (answer !== "yes");
```
Use when the action must happen before the first check.

## 5. break and continue
- `break`: exits the nearest loop.
- `continue`: skips the rest of the current iteration and proceeds to the next.
In nested loops, they affect the nearest loop.

```js
for (let i = 0; i < 10; i++) {
  if (i === 4) break;
  console.log(i); // 0,1,2,3
}
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i); // 0,1,3,4
}
```

## 6. Nested loops and complexity
For each outer iteration, the inner loop completes. Two loops each running n times perform about n² body executions: O(n²), assuming constant-time body work. Use for grids, row/cell processing, and pair comparisons; large nested loops may be expensive.

## 7. Array iteration choices

### Classic for — index and control
```js
const fruits = ["apple", "mango", "kiwi"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}
```
Choose when you need an index, reverse traversal, break, or continue.

### for...of — iterable values
```js
for (const fruit of fruits) console.log(fruit);
```
Internally it uses the iterable protocol: obtains `Symbol.iterator`, calls iterator `next()`, and stops when the result's `done` is true. It yields values, not indexes. Arrays, strings, Maps, and Sets are iterable.

### forEach — callback per array element
```js
fruits.forEach((fruit, index) => console.log(index, fruit));
```
It invokes a callback for each present element and returns `undefined`. There is no normal break/continue; return exits only that callback invocation.

**Async trap:** forEach does not await async callbacks.
```js
// Does NOT wait for all saves:
items.forEach(async item => { await save(item); });

// Sequential:
for (const item of items) await save(item);

// Parallel:
await Promise.all(items.map(item => save(item)));
```
Sequential awaits one at a time; Promise.all starts work together and rejects if one promise rejects (unless using an all-settled strategy).

## 8. for...in and objects
`for...in` enumerates enumerable string keys, including inherited enumerable keys. It is mainly for objects—not arrays (arrays can have custom properties; keys aren't necessarily intended indexes).

```js
const user = { name: "Saurabh", role: "developer" };
for (const key in user) console.log(key, user[key]);

// Own enumerable properties:
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```
Use Object.keys/values/entries when you want own enumerable properties.

## 9. map/filter/reduce preview
These methods iterate internally and are declarative data transformations:
```js
const prices = [100, 200, 300];
const taxed = prices.map(p => p * 1.18);          // transform → new array
const expensive = prices.filter(p => p >= 200);  // select → new array
const total = prices.reduce((sum, p) => sum + p, 0); // accumulate → one value
```
We will cover them deeply in a dedicated lesson. Prefer them for transformations; use loops when control flow/side effects are clearer.

## 10. Common pitfalls
- **Off-by-one:** `i <= arr.length` often accesses one beyond the last index.
- **Infinite loop:** condition never becomes false; check update.
- **Mutation while iterating:** splice shifts indexes and may skip items. Prefer filter or carefully iterate backwards.
- **Wrong collection loop:** for...in on arrays is usually a mistake.
- **Async forEach:** callbacks are not awaited.
- **Empty collection:** loop runs zero times; verify data and bounds.
- **Performance:** avoid expensive repeated calculations inside a loop when they can be safely moved out.

## 11. Frontend examples
Find the first active user:
```js
let found;
for (const user of users) {
  if (user.isActive) {
    found = user;
    break;
  }
}
```
Retry counter:
```js
let retry = 0;
while (retry < 3) {
  retry++;
  // attempt request; break if successful
}
```
Other uses: build DOM lists, render grids, validate fields, transform API data, calculate totals.

## 12. Interview questions (answers)
1. **for vs while?** for groups counter setup/condition/update; while suits state-driven unknown repetitions. Both can express same logic.
2. **while vs do...while?** while checks before body (0+ runs); do...while checks after (1+ runs).
3. **break vs continue?** break exits nearest loop; continue skips current iteration.
4. **for...of vs for...in?** for...of yields iterable values; for...in enumerable string keys, including inherited. Use of for arrays.
5. **forEach vs map?** forEach is side-effect-oriented and returns undefined; map transforms and returns a new array.
6. **Can break from forEach?** No normal break. return exits callback only. Use for/of or classic for.
7. **Why async forEach problematic?** It doesn't await/aggregate promises. Use sequential for...of + await or Promise.all(map(...)).
8. **Off-by-one?** Boundary error such as i <= length; indexes are 0..length-1.
9. **Nested n×n complexity?** Approximately O(n²) if body operations are constant-time.
10. **Iterate object safely?** Object.keys/values/entries for own enumerable keys; for...in only if inherited enumerable keys are wanted.
11. **What does for...of use internally?** Iterable protocol: Symbol.iterator, iterator.next(), result {value, done}; stop when done is true.

## 13. Practice
See [Day 3 tasks](../../practice/day-03/tasks.md). Run the example with:
```bash
node examples/day-03/loops.js
```

## Revision
- for: init once → condition → body → update → condition.
- while: check first, zero or more runs.
- do...while: check last, at least one run.
- break exits; continue skips current iteration.
- for...of values; for...in keys.
- forEach callback/no break; map transforms; filter selects; reduce accumulates.

**Next:** Day 4 — Functions (declarations, expressions, arrow functions, parameters, return, function design).
