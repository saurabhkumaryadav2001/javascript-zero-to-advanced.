# Day 7 — Object Interview Questions & Answers

## Fundamentals
**1. What is an object in JavaScript?**  
A collection of properties. Keys are strings or Symbols; values may be any JavaScript value.

**2. How do you access a property?**  
Dot notation for a known identifier (`obj.name`); bracket notation for dynamic or unusual keys (`obj[key]`).

**3. What is the difference between `in` and `Object.hasOwn`?**  
`in` checks own and inherited properties; Object.hasOwn checks only the object's own property.

## References and copying
**4. What happens when you assign an object to another variable?**  
The reference is copied; both variables point to the same object.

**5. Why does `({a:1} === {a:1})` return false?**  
Each literal creates a distinct object identity; === compares references, not structure.

**6. What is a shallow copy?**  
A new outer object whose nested object/array values remain shared references.

**7. Spread vs Object.assign?**  
Both are shallow. Spread creates a new object expression; Object.assign copies into and mutates its target.

**8. How do you deep clone?**  
Use structuredClone for supported structured-cloneable values. Check limitations for functions, DOM nodes, prototypes and special application objects.

**9. Why isn't JSON stringify/parse a universal deep clone?**  
It drops/changes values such as undefined, functions, Symbols, NaN/Infinity and Date behavior; it fails on circular references and BigInt.

**10. Is Object.freeze deep?**  
No. It freezes the outer object's own properties; nested objects can still mutate unless separately frozen.

## Syntax
**11. What is destructuring?**  
Syntax to extract object properties or array positions into variables.

**12. How do you rename a destructured property?**  
`const { city: location } = user`; city is the source key and location is the local variable.

**13. When does a destructuring default apply?**  
When the extracted value is undefined, not null.

**14. What is optional chaining?**  
`?.` safely accesses/calls through a nullish value and returns undefined instead of throwing at that point.

**15. Difference between ?? and ||?**  
`??` falls back only for null/undefined. `||` falls back for all falsy values (0, false, "", NaN, null, undefined).

## Frontend/application questions
**16. How do you update nested state immutably?**  
Copy each changed level with spread and replace the changed branch; preserve the old state.

**17. How can you transform an object into UI rows?**  
Use Object.entries and map `([key,value])` to a row object.

**18. What is Object.fromEntries?**  
Builds an object from iterable key/value pairs, often reversing Object.entries transformations.

**19. What does Object.seal do?**  
Prevents adding/removing properties; existing writable properties may still change. It is shallow.

**20. Why use Object.hasOwn instead of obj.hasOwnProperty?**  
It works with null-prototype objects and objects that override the method.

## Output practice
Predict before running:
```js
const original = { nested: { n: 1 } };
const copy = { ...original };
copy.nested.n = 9;
console.log(original.nested.n); // ?
console.log(original === copy); // ?
```
Answers: 9; false.

```js
const { value = 5 } = { value: null };
console.log(value);
console.log(0 ?? 8, 0 || 8);
```
Answers: null; 0 and 8.
