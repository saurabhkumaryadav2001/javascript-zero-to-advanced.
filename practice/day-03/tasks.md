# Day 3 — Hands-on Tasks (Loops & Iteration)

Try these before looking up solutions. Run in Node.js/browser console. Keep your answers in this folder.

1. **Countdown:** print n down to 1, then "Go!" using for.
2. **Sum:** calculate array sum with classic for and for...of; compare clarity.
3. **Find:** implement `findFirstEven(numbers)` returning the first even or undefined; use break.
4. **Skip:** print 1..20 but skip multiples of 3 using continue.
5. **Frequency:** count each character in a string using an object or Map.
6. **Nested grid:** print 4×4 coordinates (row, col); count inner iterations.
7. **Safe removal:** remove negatives without skipping; explain why forward splice can be risky.
8. **Async:** fetch URLs sequentially with for...of + await; describe how Promise.all could parallelize.
9. **Output prediction:** predict output of:
   - an empty classic for loop
   - `while (false) { console.log("x"); }`
   - `do { console.log("x"); } while (false);`
   - a loop with continue at i === 2
10. **Object keys:** print key/value pairs with Object.entries.
11. **Bonus—retry:** retry a simulated request up to 3 times and stop early on success.
12. **Bonus—performance:** explain why two nested loops over 10,000 elements each are potentially costly (O(n²)).

## Self-check
- Can I trace init → condition → body → update?
- Can I explain why do...while runs at least once?
- Do I know when to choose for, for...of, forEach, and for...in?
- Can I explain why async forEach does not wait?
