# Day 5 — Scope, Hoisting, Execution Context & Closures

## Learning outcomes
- Explain scope, lexical scope and the scope chain.
- Predict var/let/const and function-declaration hoisting.
- Understand the Temporal Dead Zone (TDZ).
- Trace the call stack and function execution contexts.
- Build closures for private state and function factories.

## 1. How JavaScript executes
A helpful simplified model is: **establish bindings for a scope → execute statements in order**. The ECMAScript specification uses Environment Records and execution contexts; it does not literally move source lines to the top. This model is useful for predicting behavior.

A function call creates a function execution context. Synchronous calls are tracked by a LIFO call stack. Browser APIs/event-loop scheduling will be covered separately.

## 2. Scope
Scope is where a name can be accessed.

~~~js
const appName = "SkyJob"; // outer/global or module scope
function show() {
  const message = "Hello";
  console.log(appName, message); // both accessible
}
show();
// message is not accessible here
~~~

- **Global scope:** top-level bindings (classic scripts and modules have differences).
- **Function scope:** local bindings are accessible inside their function.
- **Block scope:** let/const respect blocks; var does not.
- **Lexical scope:** a nested function can access bindings in the scopes where it was written.

~~~js
const outer = "outer";
function first() {
  const middle = "middle";
  function second() {
    const inner = "inner";
    console.log(inner, middle, outer);
  }
  second();
}
first();
~~~

Identifier lookup starts in the current lexical environment and walks outward through the scope chain. Lexical scope depends on source nesting—not the place where a function is called.

## 3. var, let and const
~~~js
var old = 1;       // function-scoped; can redeclare
let count = 2;     // block-scoped; can reassign
const limit = 3;   // block-scoped; binding cannot be reassigned
~~~

**const does not deeply freeze an object:**
~~~js
const user = { name: "Asha" };
user.name = "Ravi"; // allowed
// user = {};       // TypeError
~~~

## 4. Hoisting and TDZ
Hoisting is shorthand for binding setup before statement execution.

**var** is initialized to undefined:
~~~js
console.log(score); // undefined
var score = 10;
~~~
The assignment to 10 still happens at its original statement.

**Function declarations** are generally available before their textual definition:
~~~js
sayHi();
function sayHi() { console.log("Hi"); }
~~~

**let/const** bindings are created when the scope is entered but remain uninitialized until their declaration executes. Access during that interval throws ReferenceError: the **Temporal Dead Zone (TDZ)**.
~~~js
// console.log(price); // ReferenceError
let price = 100;
~~~

A function expression is created when the expression is evaluated:
~~~js
// run(); // ReferenceError
const run = function () { console.log("run"); };
run();
~~~

## 5. Execution context and call stack
An execution context is runtime state for executing code (environment/bindings and execution progress). Function calls create contexts.

~~~js
function one() {
  console.log("one start");
  two();
  console.log("one end");
}
function two() { console.log("two"); }
one();
~~~

While two runs, the stack is conceptually **global → one → two** (two is the top). When two returns, one resumes. Stack is **LIFO: last in, first out**. Runaway recursion can cause a stack overflow. The call stack tracks active calls; it is different from the heap, where objects are allocated.

## 6. Closures
A **closure** is a function together with retained access to its lexical environment. An inner function can access outer bindings even after the outer function returns.

~~~js
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
~~~

Step-by-step:
1. makeCounter creates count = 0.
2. It returns the inner function.
3. The outer call finishes.
4. counter still has access to count.
5. Each invocation updates the same retained binding.

A closure retains **access to a binding**, not a frozen copy of its value.

Separate calls create separate environments:
~~~js
const a = makeCounter();
const b = makeCounter();
a(); // 1
a(); // 2
b(); // 1 — independent count
~~~

### Private state pattern
~~~js
function createWallet(initial = 0) {
  let balance = initial;
  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}
const wallet = createWallet(100);
wallet.deposit(50); // 150
wallet.getBalance(); // 150
// wallet.balance is not exposed
~~~
This hides state from ordinary direct access; it is a design pattern, not a complete security boundary.

## 7. Frontend use cases
~~~js
// Event-handler factory
function makeHandler(message) {
  return () => console.log(message);
}
const handler = makeHandler("Clicked");
// button.addEventListener("click", handler);

// Function factory
function multiplyBy(factor) {
  return number => number * factor;
}
const double = multiplyBy(2);
double(5); // 10
~~~
Closures are used for callbacks, event handlers, function factories, configuration and memoization. UI frameworks can have stale-closure bugs when callbacks capture older render values; framework-specific patterns address those.

## 8. The var loop closure trap
~~~js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// commonly prints 3, 3, 3
~~~
All callbacks reference the same function-scoped var binding; the loop finishes with i = 3 before callbacks run.

~~~js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// prints 0, 1, 2
~~~
let in a for loop creates a per-iteration binding. Each callback closes over its own i. An IIFE capture was a traditional alternative.

## 9. Common mistakes
- Thinking hoisting literally moves source text.
- Accessing let/const before initialization (TDZ).
- Assuming const freezes object contents.
- Calling a const function expression before initialization.
- Thinking closure copies a value rather than retaining binding access.
- Using var in delayed loop callbacks and seeing the final index repeatedly.
- Confusing call stack (active calls) with scope chain (identifier lookup).
- Accidentally sharing mutable state between closures.

## 10. Interview Q&A
1. **What is scope?** Region where a binding is accessible; global, function and block scope.
2. **Lexical scope?** Outer access is determined by where code is written, not where a function is called.
3. **Hoisting?** Bindings are established before statements execute: var is initialized undefined; function declarations are initialized; let/const remain uninitialized until declaration.
4. **TDZ?** Interval after let/const binding creation but before initialization; access throws ReferenceError.
5. **var vs let?** var is function-scoped/redeclarable; let is block-scoped and cannot be redeclared in the same scope.
6. **Does const make objects immutable?** No; only binding reassignment is prevented.
7. **Execution context?** Runtime state/environment used to execute code; function calls create contexts.
8. **Call stack?** LIFO structure of active synchronous calls.
9. **Closure?** Function retaining access to its lexical environment after the outer function returns.
10. **Why var timer prints 3,3,3?** All callbacks share one var binding; it is 3 when callbacks execute.
11. **Why let prints 0,1,2?** Per-iteration bindings are captured independently.
12. **Closure use cases?** Private state, counters, factories, callbacks, memoization and configuration.

## 11. Practice tasks
1. Create global/function/block variables; predict accessible names and errors.
2. Predict var read-before-assignment, declaration called early, and const-expression called early.
3. Access let before declaration; explain the TDZ.
4. Implement a counter closure with increment/decrement/getValue and private state.
5. Create two counters and prove their state is independent.
6. Implement multiplyBy(factor) returning a multiplier function.
7. Reproduce var timer output 3,3,3; fix with let and explain.
8. Trace global → alpha → beta → gamma and draw the call stack.
9. Create a closure that remembers a name and returns a greeting function.
10. Explain closure in simple words without saying it copies variables.

## Revision card
- Scope = where a name is accessible.
- Lexical scope = lookup follows source nesting.
- var = function scope; initialized undefined.
- let/const = block scope; TDZ until initialized.
- Function declaration = callable before textual definition.
- Function expression = created when expression evaluates.
- Execution context = runtime state for executing code.
- Call stack = active calls, LIFO.
- Closure = function retains access to lexical environment.
- Closure retains binding access, not a frozen value.
- var loop callbacks share binding; let has per-iteration binding.

**Next:** Day 6 — this keyword, call/apply/bind, and method invocation rules.
