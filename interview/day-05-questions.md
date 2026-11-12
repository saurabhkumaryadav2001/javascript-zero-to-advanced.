# Day 5 Interview Questions — Scope, Hoisting & Closures

## Fundamentals
1. **What is scope?** The region in which a binding can be accessed.
2. **What is lexical scope?** Scope/outer lookup is determined by source-code nesting, not the caller location.
3. **What is a scope chain?** Identifier lookup begins in the current lexical environment and walks outward.
4. **What is hoisting?** A shorthand for binding setup/initialization semantics before statement execution; it is not literal source-code movement.
5. **What is the TDZ?** The interval between entering a scope and initializing a let/const binding; access throws ReferenceError.
6. **var vs let vs const?** var is function-scoped and initialized undefined; let/const are block-scoped and have TDZ; const prevents binding reassignment.
7. **Does const freeze objects?** No. Object properties can mutate; the binding cannot be reassigned.

## Runtime
8. **What is an execution context?** Runtime state/environment used to execute code; function calls create contexts.
9. **What is the call stack?** LIFO structure of active synchronous function calls.
10. **Call stack vs scope chain?** Stack tracks which calls are active; scope chain resolves variable names through lexical environments.
11. **What causes stack overflow?** Excessive/unbounded call nesting, often runaway recursion.

## Closures
12. **Define closure.** A function retains access to bindings in its lexical environment even after the outer function returns.
13. **Does closure copy variables?** No; it retains access to the binding/environment. Values can change.
14. **Use cases?** Private state, counters, factories, callbacks, memoization, configuration.
15. **Why are two makeCounter calls independent?** Each invocation creates a separate lexical environment and count binding.
16. **Why var timer loop often prints 3 three times?** Callbacks share one var binding; the loop completes before callbacks execute.
17. **Why let timer loop prints 0,1,2?** The for-loop creates per-iteration bindings captured separately.
18. **How can closures cause stale UI values?** A callback can retain values from an earlier render/scope; framework-specific state/update patterns are needed.

## Output prediction
~~~js
console.log(x);
var x = 7;
// undefined
~~~

~~~js
callMe();
function callMe() { console.log("works"); }
// works
~~~

~~~js
// callMe(); // ReferenceError
const callMe = () => console.log("works");
~~~

~~~js
function outer() {
  let n = 0;
  return () => ++n;
}
const f = outer();
console.log(f(), f(), f()); // 1 2 3
~~~

Remember: exact behavior can depend on script/module and block context; explain the relevant assumptions in interviews.
