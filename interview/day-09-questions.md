# Day 9 — Function Interview Questions & Answers

1. **Declaration vs expression?** Declaration is initialized during scope setup; expression is created when evaluated.
2. **First-class function?** A function treated as a value—assigned, passed, or returned.
3. **Callback?** Function supplied to another function for it to invoke.
4. **Higher-order function?** Accepts or returns a function.
5. **Default return?** undefined if execution reaches the end.
6. **Parameter vs argument?** Definition placeholder vs value passed at call.
7. **Rest parameter?** ...args gathers remaining arguments into an array; it must be last.
8. **Default parameter with null?** Null is preserved; defaults apply to undefined/omitted.
9. **Arrow vs regular?** Arrow has lexical this and no own arguments; regular this is call-dependent.
10. **Can arrow be a constructor?** No, arrow is not constructible.
11. **Pure function?** Same inputs yield same output without observable side effects.
12. **Recursion?** Function calling itself; needs a base case.
13. **Stack overflow?** Too many active nested calls, often unbounded recursion.
14. **Are map callbacks async?** No; map invokes callbacks synchronously.
15. **Closure?** Function retains access to its lexical environment.
16. **Composition?** Output of one function becomes input of another.
17. **What does return do?** Ends function and supplies a value to caller.
18. **Partial application?** Preset some arguments to create a function for remaining inputs.

## Output questions
```js
function f() { return; }
console.log(f()); // undefined

const g = (x) => { x * 2 };
console.log(g(4)); // undefined (missing return)

const h = x => ({ value: x });
console.log(h(5)); // { value: 5 }

function outer(x) { return y => x + y; }
console.log(outer(3)(4)); // 7
```

## Coding prompts
- Implement once(fn).
- Implement compose(f,g).
- Implement debounce.
- Write factorial recursively and iteratively.
- Build a function factory for minimum-length validation.
