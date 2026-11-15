# JavaScript Day 8 — Arrays in Depth

> Beginner-to-advanced • Frontend applications • Interview preparation

## Outcomes
Understand array indexing and length; mutation vs immutable operations; map/filter/reduce; find/some/every; slice/splice; numeric/object sorting; API-to-UI transformations; sparse arrays and callback pitfalls.

## 1. Arrays are ordered collections
An array is an object designed for ordered values. Indexes begin at 0.

\`\`\`js
const skills = ["JavaScript", "TypeScript", "Angular"];
skills[0]; // "JavaScript"
skills.length; // 3
\`\`\`

First index = 0; second = 1; last = length - 1. Arrays can contain mixed values, although consistent element shapes are easier to maintain.

\`\`\`js
const mixed = [10, "hello", true, { id: 1 }, [2, 3]];
typeof []; // "object"
Array.isArray([]); // true
\`\`\`
Use Array.isArray; typeof cannot distinguish arrays from ordinary objects.

## 2. Indexing and length
Out-of-range reads generally return undefined, not an error. In ordinary indexed use, length is one greater than the highest array index. Reducing length truncates indexed elements; increasing it creates holes (empty slots), not actual undefined elements.

\`\`\`js
const values = [10, 20, 30, 40];
values.length = 2;
console.log(values); // [10, 20]
\`\`\`

## 3. Mutating add/remove
\`\`\`js
const items = ["a", "b"];
items.push("c");    // end; returns new length
items.pop();        // removes end; returns removed item
items.unshift("z"); // beginning; returns new length
items.shift();      // removes beginning; returns removed item
\`\`\`
push/pop are useful for stack operations. shift/unshift move indexes and can be costly for large arrays.

## 4. Mutation vs non-mutation
Mutating: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin.
Non-mutating: map, filter, reduce, slice, concat, flat, flatMap; modern toSorted/toReversed/toSpliced return copies.
\`\`\`js
const source = [1, 2, 3];
const doubled = source.map(n => n * 2);
console.log(source);  // [1,2,3]
console.log(doubled); // [2,4,6]
\`\`\`
Use non-mutating operations when preserving state matters (e.g. React/state stores); in Angular too, immutable updates can make change tracking and reasoning easier.

## 5. map — transform each element
Use map when one output is wanted per visited input.
\`\`\`js
const squares = [1,2,3].map(n => n * n); // [1,4,9]
\`\`\`
Mental model: visit element → callback → put returned result at corresponding output position.
API-to-dropdown:
\`\`\`js
const employees = [{id:7,name:"Asha"},{id:8,name:"Ravi"}];
const options = employees.map(e => ({value:e.id,label:e.name}));
\`\`\`
Pitfall: \`nums.map(n => { n * 2 })\` returns undefined entries. With braces, explicitly return; concise arrow expressions return automatically.

## 6. filter — keep matching elements
Returns a new array for which callback is truthy:
\`\`\`js
const even = [1,2,3,4,5].filter(n => n % 2 === 0); // [2,4]
const visible = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
\`\`\`
Source is not changed; no matches means [].

## 7. reduce — accumulate
\`\`\`js
const total = [2,3,4].reduce((sum,n) => sum+n, 0); // 9
\`\`\`
Trace: initial 0 → add 2 gives 2 → add 3 gives 5 → add 4 gives 9. Always understand the initial accumulator. Without one, first item becomes accumulator and iteration begins at second; empty array without initial value throws.
Count statuses:
\`\`\`js
const statuses = ["Open","Closed","Open","Open"];
const counts = statuses.reduce((acc,status) => {
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {}); // {Open:3, Closed:1}
\`\`\`
A loop is often clearer for complex logic; reduce is not automatically better.

## 8. find / findIndex / some / every
\`\`\`js
const users = [{id:1},{id:2},{id:3}];
users.find(u => u.id === 2);       // object or undefined
users.findIndex(u => u.id === 2);  // 1 or -1
users.some(u => u.id > 2);         // true if at least one
users.every(u => u.id > 0);        // true if all
\`\`\`
find = first item; findIndex = first index; some = any?; every = all? Empty array: some is false; every is true.

## 9. includes, indexOf, slice, splice
\`\`\`js
const a = ["x","y","z"];
a.includes("y"); // true
a.indexOf("z");  // 2; missing -> -1
a.slice(1,3);    // ["y","z"]; end excluded, does not mutate
a.splice(1,1,"new"); // edits original; returns removed items
\`\`\`
slice(start,end) copies a range; splice(start,deleteCount,...items) edits source.

## 10. Sort correctly
Default sort converts elements to strings:
\`\`\`js
[1,20,3].sort(); // [1,20,3] — string order, not numeric
[1,20,3].toSorted((a,b) => a-b); // [1,3,20]
[1,20,3].toSorted((a,b) => b-a); // [20,3,1]
\`\`\`
Comparator negative → a before b; positive → b before a; zero → equal. Sort objects:
\`\`\`js
const people = [{name:"Ravi",age:30},{name:"Asha",age:22}];
const byAge = people.toSorted((a,b) => a.age-b.age);
\`\`\`
sort mutates; toSorted returns copy. Modern sort is stable.

## 11. Spread, concat, destructuring
\`\`\`js
const a = [1,2];
const b = [...a,3,4]; // [1,2,3,4]
const joined = a.concat([3,4]);
const [first,second,...rest] = [10,20,30,40];
// first=10, second=20, rest=[30,40]
\`\`\`
Spread is shallow; nested object references remain shared.

## 12. flat and flatMap
\`\`\`js
[1,[2,[3]]].flat();   // [1,2,[3]]
[1,[2,[3]]].flat(2);  // [1,2,3]
["a b","c"].flatMap(s => s.split(" ")); // ["a","b","c"]
\`\`\`
flatMap maps then flattens one level.

## 13. Sparse arrays and callback pitfalls
\`\`\`js
const sparse = [];
sparse[2] = "x";
sparse.length; // 3; indexes 0 and 1 are holes
\`\`\`
Many array callbacks skip holes; for...of reads holes as undefined. Prefer dense arrays.
Callback receives value, index, array. Classic trap:
\`\`\`js
["1","2","3"].map(parseInt); // [1, NaN, NaN]
["1","2","3"].map(x => parseInt(x,10)); // [1,2,3]
\`\`\`
map passes index as second argument; parseInt interprets it as radix.

## 14. Frontend pipeline: API → UI model
\`\`\`js
const tickets = [
 {id:101,title:"Login bug",status:"Open",priority:2},
 {id:102,title:"UI spacing",status:"Closed",priority:1},
 {id:103,title:"API timeout",status:"Open",priority:3}
];
const openOptions = tickets
 .filter(t => t.status === "Open")
 .toSorted((a,b) => b.priority-a.priority)
 .map(t => ({id:t.id,label:t.title}));
// [{id:103,label:"API timeout"},{id:101,label:"Login bug"}]
\`\`\`
This pipeline filters, sorts a copy, then maps to a UI-friendly model.

## 15. Common mistakes
- typeof array === "array" (wrong); use Array.isArray.
- Assuming sort is numeric by default.
- Forgetting return in block-bodied map.
- Reduce without an initial accumulator when empty input is possible.
- Confusing slice (copy) with splice (mutation).
- Expecting map/filter/reduce to mutate source.
- Assuming spread deep-copies nested objects.
- Passing parseInt directly to map.
- Treating sparse-array length as populated count.
- Ignoring callback's index and array arguments.

## 16. Interview Q&A
1. **map vs forEach?** map returns transformed array; forEach returns undefined and is for side effects.
2. **filter vs find?** filter returns all matches; find first match or undefined.
3. **some vs every?** some at least one; every all.
4. **reduce?** Accumulates items into one value/structure.
5. **Why [10,2,1].sort() surprises?** Default string comparison; use (a,b)=>a-b.
6. **slice vs splice?** slice copies; splice edits source.
7. **Does spread deep-copy?** No, shallow only.
8. **Remove duplicates?** [...new Set(values)] for primitives; objects compare by reference.
9. **Maximum?** Math.max(...nums) for reasonable arrays; loop for huge data.
10. **Group records?** reduce into object/Map keyed by category.
11. **map callback args?** value, index, array.
12. **Why map(parseInt) fails?** index becomes radix; use x=>parseInt(x,10).
13. **Stable sort?** Equal comparator results retain relative order; modern sort is stable.
14. **When prefer loop over reduce?** Complex control flow/readability.
15. **Complexity?** map/filter/find/reduce typically O(n); sort typically O(n log n).
16. **Pagination?** items.slice((page-1)*pageSize,page*pageSize).
17. **Sparse array?** Array with holes; callbacks often skip them.
18. **Does sort mutate?** Yes; use toSorted or copy first.

## 17. Practice
### Beginner
1. Square [2,3,4,5] with map.
2. Filter ages >= 18.
3. Find employee by ID and handle undefined.
4. Check any ticket Open and all IDs positive.
5. Copy array without last element, preserving source.
### Intermediate
6. Sum prices with reduce.
7. Count word frequencies.
8. Sort salaries ascending/descending numerically.
9. Sort employees by age.
10. Convert records to {value,label} options.
11. Remove duplicate primitives.
12. Flatten arrays two levels.
### Advanced
13. Group tickets by status into {Open:[],Closed:[]}.
14. Pipeline: filter active → sort score → map display model.
15. Implement pagination using slice.
16. Implement myMap with loop/callback; bonus sparse-array behavior.
17. Explain complexity of map/filter/find/reduce and sort.

## 18. Revision card
- Arrays are objects; indexes start at 0.
- length is highest index + 1 in ordinary indexed use.
- map=transform; filter=keep; reduce=accumulate.
- find=first item; findIndex=index; some=any; every=all.
- slice=non-mutating range copy; splice=mutation.
- sort mutates; toSorted copies; default sort is string-based.
- Spread copies shallowly; Array.isArray checks arrays.
- Prefer readable loops if reduce becomes confusing.

**Next:** Day 9 — Functions in Depth: declarations/expressions, parameters, rest/defaults, pure functions, recursion, higher-order functions, composition.
