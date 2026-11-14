# Day 7 — JavaScript Objects in Depth

## Learning goals
By the end, explain object identity/references, shallow vs deep copies, spread/assign, destructuring, optional chaining/nullish coalescing, and useful Object APIs.

## 1) Objects: a key → value collection
An object stores properties. Property keys are strings or Symbols (numeric keys are converted to strings); values may be any JavaScript value, including functions and other objects.

```js
const employee = {
  name: "Saurabh",
  experience: 2,
  skills: ["Angular", "TypeScript"],
  greet() { return `Hi, I'm ${this.name}`; }
};
employee.name;       // "Saurabh" (dot: known identifier)
employee["name"];    // "Saurabh" (bracket)
employee.greet();    // "Hi, I'm Saurabh"
```

Use bracket notation for dynamic keys:
```js
const key = "experience";
employee[key]; // 2
employee["full name"] = "Saurabh Yadav";
```

## 2) Add, update, delete, test properties
```js
const user = { name: "Asha" };
user.city = "Mumbai";        // add
user.name = "Riya";         // update
delete user.city;            // delete
"name" in user;              // own OR inherited
Object.hasOwn(user, "name"); // own property only
Object.hasOwn(user, "toString"); // false
```
Prefer `Object.hasOwn` for checking direct properties; `in` also checks the prototype chain.

## 3) Primitive values vs object references
Primitive assignment copies the value. Object assignment copies a reference to the same object—not a new object.

```js
let x = 10, y = x;
y = 20;
console.log(x); // 10

const a = { score: 10 };
const b = a; // same object
b.score = 20;
console.log(a.score); // 20
```
Analogy: two labels point to one parcel. Updating the parcel through either label is visible through both.

```js
const first = { name: "A" };
const second = { name: "A" };
first === second; // false: different identities
const third = first;
first === third;  // true: same reference
```
Object `===` compares identity/reference, not matching contents.

## 4) Shallow copy: spread and Object.assign
A shallow copy creates a new outer object; nested objects remain shared.

```js
const original = { name: "Asha", address: { city: "Mumbai" } };
const copy = { ...original };
copy.name = "Riya";
copy.address.city = "Pune";
console.log(original.name);          // "Asha"
console.log(original.address.city); // "Pune" (nested object shared)
original !== copy;                  // true
original.address === copy.address;  // true
```

`Object.assign(target, source...)` copies enumerable own properties into target and **mutates target**:
```js
const merged = Object.assign({}, { a: 1 }, { b: 2 });
const target = { a: 1 };
Object.assign(target, { a: 9, b: 2 }); // target now {a:9,b:2}
```
Spread and Object.assign are both shallow. Spread is usually easier for immutable updates.

## 5) Deep copy and limitations
For supported structured-cloneable data, `structuredClone` is a convenient modern API:
```js
const original = { user: { name: "Asha" }, tags: ["frontend"] };
const deep = structuredClone(original);
deep.user.name = "Riya";
deep.tags.push("JS");
console.log(original.user.name); // "Asha"
console.log(original.tags);      // ["frontend"]
```
It supports many types and cycles, but not functions or DOM nodes; it does not preserve every custom prototype/property descriptor. JSON stringify/parse is not a universal clone: it loses/changes undefined, functions, Symbols, special numeric values and types such as Date; it fails on cycles and BigInt.

## 6) Object spread and merge order
```js
const defaults = { theme: "light", pageSize: 20 };
const settings = { ...defaults, theme: "dark" };
// { theme: "dark", pageSize: 20 }; later values win
const updatedUser = { ...user, city: "Pune" };
```
Spread makes a shallow copy, doesn't mutate the source, and copies enumerable own properties.

## 7) Destructuring
```js
const person = { name: "Asha", age: 25, city: "Mumbai" };
const { name, age } = person;
const { city: location = "Unknown" } = person;
// name="Asha", age=25, location="Mumbai"
```
Rename with `key: localName`. Default values apply only when extracted value is `undefined`, not `null`:
```js
const { role = "Developer" } = {};
const { nick = "Guest" } = { nick: undefined };
const { middle = "N/A" } = { middle: null };
// role Developer; nick Guest; middle null
```
Nested and parameter destructuring:
```js
const response = { data: { items: [1, 2, 3] } };
const { data: { items } } = response;
function showUser({ name, city = "Mumbai" }) { console.log(name, city); }
showUser({ name: "Asha" });
```
Array destructuring is positional:
```js
const [first, second, ...rest] = [10, 20, 30, 40];
// first=10, second=20, rest=[30,40]
```

## 8) Optional chaining and nullish coalescing
```js
const city = user?.address?.city;
const firstItem = response?.data?.items?.[0];
user?.save?.(); // call only if present/non-nullish
const label = user.name ?? "Anonymous";
```
`?.` stops on null/undefined and returns undefined. It doesn't protect undeclared identifiers or every falsy value. It cannot be an assignment target.
```js
0 ?? 10; // 0
0 || 10; // 10
```
Use `??` if 0, false, or "" are valid values; `||` falls back for all falsy values.

## 9) Object APIs
```js
const obj = { a: 1, b: 2 };
Object.keys(obj);    // ["a", "b"]
Object.values(obj);  // [1, 2]
Object.entries(obj); // [["a",1], ["b",2]]
Object.fromEntries([["a",1],["b",2]]); // {a:1,b:2}

Object.freeze(obj); // shallow: prevents top-level changes
Object.seal(obj);  // no add/delete; existing writable values may change
Object.preventExtensions(obj); // no new properties
```
These integrity methods are shallow. In strict mode prohibited changes can throw; otherwise may fail silently.

## 10) Frontend patterns
Immutable nested state update:
```js
const state = { profile: { name: "Asha", city: "Mumbai" }, theme: "light" };
const nextState = {
  ...state,
  profile: { ...state.profile, city: "Pune" }
};
// original unchanged; changed branch copied
```
Safe API read:
```js
const title = apiResponse?.data?.article?.title ?? "Untitled";
```
Object → UI rows:
```js
const filters = { city: "Mumbai", role: "Frontend" };
const rows = Object.entries(filters).map(([key, value]) => ({ key, value }));
```
Destructured function input:
```js
function createProfile({ name, skills = [] }) { return { name, skills }; }
createProfile({ name: "Saurabh" });
```

## 11) Common mistakes
- Assuming const makes nested objects immutable.
- Comparing two object literals with `===` and expecting content equality.
- Thinking spread/Object.assign deep-copies.
- Forgetting Object.assign mutates its target.
- Using `||` when 0/false/"" are valid.
- Expecting destructuring defaults to replace null.
- Assuming Object.freeze recursively freezes.
- Treating optional chaining as validation of required data.

## 12) Interview questions (answers)
1. **What is an object?** Collection of keyed properties; keys are strings/Symbols and values any type.
2. **Primitive vs reference?** Primitive assignment copies a value; object assignment copies a reference.
3. **Why are identical object literals !==?** Different object identities.
4. **Shallow copy?** New outer object; nested references remain shared.
5. **Spread vs Object.assign?** Both shallow; spread creates a new expression object, Object.assign mutates target.
6. **How deep clone?** structuredClone for supported data, with limitations.
7. **Why JSON clone isn't universal?** Loses unsupported values/types and fails on cycles/BigInt.
8. **Destructuring?** Syntax extracting properties/positions into variables.
9. **Default destructuring applies when?** Extracted value is undefined, not null.
10. **Optional chaining?** Safe access/call through nullish intermediate values.
11. **?? vs ||?** ?? only null/undefined; || any falsy value.
12. **Object.keys vs entries?** Keys vs [key,value] pairs.
13. **Is Object.freeze deep?** No.
14. **Immutable nested update?** Copy every changed level and replace that branch.

## 13) Practice tasks
1. Point two variables to one object; mutate through one and observe the other.
2. Compare separately-created objects and explain false.
3. Shallow-copy an object with nested address; mutate nested property.
4. Update profile.city immutably without changing original.
5. Merge defaults/overrides and prove last key wins.
6. Destructure name, rename city to location, default role.
7. Safely read a nested API field with ?. and ??.
8. Convert filters to [{key,value}] with Object.entries.
9. structuredClone nested data and compare mutations.
10. Freeze an outer object and show nested mutation is still possible.

## Revision card
- Object assignment = reference, not clone; === compares identity.
- `{...obj}` shallow; Object.assign mutates target and is shallow.
- structuredClone deep-clones supported structured data.
- `const {key: local = fallback} = obj`
- ?. stops at null/undefined; ?? fallback only null/undefined; || all falsy.
- Object.keys/values/entries/fromEntries.
- freeze/seal/preventExtensions are shallow.
- Nested immutable update = copy each changed level.

**Next:** Day 8 — Arrays in depth: map/filter/reduce, mutation vs non-mutation, sorting, and interview patterns.
