# Day 8 — Array Interview Questions & Answers

1. **map vs forEach?** map returns transformed array; forEach returns undefined and is for side effects.
2. **filter vs find?** filter returns all matches; find returns first match or undefined.
3. **some vs every?** some checks at least one; every checks all.
4. **reduce?** Accumulates elements into one value or structure.
5. **Why [10,2,1].sort() surprises?** Default string comparison; use (a,b)=>a-b.
6. **slice vs splice?** slice copies range; splice edits original.
7. **Does spread deep-copy?** No, shallow only.
8. **Remove duplicates?** [...new Set(array)] for primitive values; object uniqueness is by reference.
9. **Find max?** Math.max(...nums) for reasonable sizes; loop/reduce for huge arrays.
10. **Group records?** reduce into object/Map keyed by category.
11. **map callback arguments?** Element, index, source array.
12. **Why map(parseInt) fails?** map passes index as parseInt radix; use x=>parseInt(x,10).
13. **Stable sort?** Equal comparator results retain relative order; modern sort is stable.
14. **When prefer loop to reduce?** Complex flow or when loop is clearer.
15. **Complexity?** map/filter/find/reduce typically O(n); sorting typically O(n log n).
16. **Pagination?** items.slice((page-1)*pageSize,page*pageSize).
17. **Sparse array?** Array with holes; many callbacks skip holes.
18. **Does sort mutate?** Yes; use toSorted or copy first.
