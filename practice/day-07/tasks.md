# Day 7 — Practice: Objects in Depth

Try each task before checking examples. Use Node.js or browser DevTools.

## Warm-up
1. Create an object `book` with title, author, pages and a `summary()` method.
2. Read one property using dot notation and another using bracket notation.
3. Add `publishedYear`, update title, delete pages.
4. Explain the difference between `"title" in book` and `Object.hasOwn(book, "title")`.

## References & copies
5. Make `a` and `b` point to one object. Mutate through b; observe a.
6. Compare two separately-created objects using ===. Explain.
7. Make a shallow copy with spread. Change a top-level field and a nested field. Which changes affect source?
8. Repeat with structuredClone for supported plain data.
9. Show that Object.assign mutates its first argument.
10. Explain why JSON stringify/parse is not a universal deep clone.

## Destructuring
11. Extract name and age from a user.
12. Rename city into location.
13. Add a default role when role is undefined; test null separately.
14. Destructure nested API response data.
15. Write a function accepting `{name, skills=[]}` as one parameter.
16. Destructure an array into first, second and rest.

## Modern syntax / APIs
17. Safely read `response.data.product.price` when any parent might be missing.
18. Use ?? to default a missing title; demonstrate 0 ?? 10 vs 0 || 10.
19. Convert a filters object into an array of key/value rows with Object.entries.
20. Convert entries back into an object using Object.fromEntries.
21. Freeze an object with a nested object; prove freeze is shallow.

## Interview challenge
22. Write an immutable update for `state.user.address.city` that changes city without mutating any existing level.
23. Predict all output in `examples/day-07/objects-in-depth.js` before running it.
24. Explain reference, shallow copy, deep copy and identity in 90 seconds.

## Self-check
- [ ] I can explain object references using an analogy.
- [ ] I can tell shallow copy from deep copy.
- [ ] I know Object.assign mutates its target.
- [ ] I can destructure/rename/default/nest.
- [ ] I understand ?. vs ?? vs ||.
- [ ] I can write an immutable nested update.
