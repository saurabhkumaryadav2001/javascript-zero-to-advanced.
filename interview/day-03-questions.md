# Day 3 — Interview Questions: Loops & Iteration

## Conceptual questions

**1. for vs while?**  
A for loop is convenient when initialization, condition, and update belong together. while is convenient when state controls an unknown number of repetitions. Both can express the same logic.

**2. while vs do...while?**  
while checks before the body and can run zero times. do...while checks after and runs at least once.

**3. break vs continue?**  
break exits the nearest loop; continue skips the remainder of the current iteration and advances to the next.

**4. for...of vs for...in?**  
for...of consumes an iterable and yields values. for...in enumerates enumerable string keys, including inherited keys. Prefer for...of for arrays.

**5. forEach vs map?**  
forEach is generally for side effects and returns undefined. map transforms each element and returns a new array.

**6. Can you break out of forEach?**  
Not with break. return exits only the current callback. Use classic for or for...of for early exit.

**7. Why is async forEach a trap?**  
forEach doesn't await or aggregate callback promises. Use sequential for...of + await, or parallel Promise.all(array.map(async ...)).

**8. What is an off-by-one error?**  
A boundary mistake, e.g. i <= array.length. Array indexes are 0 through length - 1.

**9. Complexity of nested n × n loops?**  
Approximately O(n²) if each body operation is constant-time.

**10. How do you iterate object properties safely?**  
Object.keys/values/entries for own enumerable properties. for...in also sees inherited enumerable properties.

**11. What does for...of use internally?**  
The iterable protocol: it obtains Symbol.iterator, calls iterator.next(), and reads {value, done}; done=true ends iteration.

## Output questions

Predict before running:

```js
for (let i = 0; i < 3; i++) console.log(i);
// 0, 1, 2

for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);
}
// 0, 1, 3, 4

let x = 0;
do { console.log("run"); } while (x > 0);
// run (one time)
```

## Coding prompts
- Sum an array without reduce.
- Find first matching item and stop early.
- Remove duplicates using Set (loop-based version first).
- Count character frequencies.
- Print a multiplication table using nested loops.
- Process API records sequentially with await; then parallelize safely.
