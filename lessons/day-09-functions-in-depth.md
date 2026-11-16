# Day 9 — Functions in Depth

## Learning goals
- Understand function declarations, expressions, and arrow functions.
- Distinguish parameters, arguments, return values, and side effects.
- Treat functions as values; use callbacks and higher-order functions.
- Understand pure functions, recursion, composition, and closure-based factories.
- Apply these patterns to frontend work and interviews.

## 1. What is a function?
A function is reusable behavior. Define it once and call it whenever needed.

```js
function calculateTotal(price, quantity) {
  return price * quantity;
}
const total = calculateTotal(250, 3); // 750
```

- **Parameter**: named input in the function definition.
- **Argument**: actual value supplied at a call.
- **Return value**: result sent to the caller.
- **Invocation**: running a function by calling it.

## 2. Declaration vs expression

```js
// Function declaration
function greet(name) {
  return `Hello ${name}`;
}

// Function expression
const sayHi = function (name) {
  return `Hi ${name}`;
};

// Named function expression (local name can help recursion/debugging)
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

Declarations are initialized during scope setup and can generally be called before their textual position. Function expressions are evaluated when execution reaches them; a `const` binding is not usable before initialization (TDZ).

## 3. Functions are first-class values
Functions can be assigned, passed, returned, and stored.

```js
function double(n) { return n * 2; }
const operation = double;
operation(5); // 10

function run(fn, value) {
  return fn(value);
}
run(double, 8); // 16
```

This capability enables callbacks and higher-order functions.

## 4. Parameters, defaults, and rest

```js
function createUser(name, role = "Developer") {
  return { name, role };
}
createUser("Saurabh");       // role = Developer
createUser("Saurabh", null); // null is retained

function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

Defaults apply when an argument is omitted or `undefined`, not `null`. Rest (`...numbers`) collects remaining arguments into an array and must be last. Defaults can refer to earlier parameters.

## 5. Return vs console.log
`console.log` displays a value; `return` gives a value back to the caller and ends the function.

```js
function add(a, b) {
  console.log(a + b);
}
const result = add(2, 3);
console.log(result); // undefined
```

A function reaching its end without a return statement returns `undefined`.

## 6. Arrow functions
```js
const square = n => n * n;
const add = (a, b) => a + b;
const makeUser = name => ({ name }); // parentheses for object literal
const noArgs = () => "hello";
```

Arrow functions capture lexical `this`, `arguments`, `super`, and `new.target`; they do not own these and cannot be constructors. Use regular functions for dynamic-`this` methods or constructors.

## 7. Callback functions
A callback is a function passed to another function so it can invoke it at a chosen time.

```js
const names = ["Asha", "Ravi"];
const upper = names.map(name => name.toUpperCase());

button.addEventListener("click", () => {
  console.log("Clicked!");
});
```

Callbacks may be synchronous (such as `map`) or asynchronous (events/timers). A callback is not automatically asynchronous.

## 8. Higher-order functions
A higher-order function (HOF) accepts a function, returns a function, or both.

```js
function makeMultiplier(factor) {
  return value => value * factor;
}
const triple = makeMultiplier(3);
triple(7); // 21
```

`map`, `filter`, `reduce`, and utilities like debounce are HOFs.

## 9. Pure functions and side effects
```js
const pureAdd = (a, b) => a + b; // same inputs => same output

let total = 0;
function impureAdd(n) {
  total += n; // modifies external state
  return total;
}
```

Pure functions are predictable and easy to test. Side effects include DOM updates, network calls, logging, and shared-state mutation. Applications need effects; keep them deliberate and at clear boundaries.

## 10. Recursion and base cases
```js
function factorial(n) {
  if (n <= 1) return 1; // base case
  return n * factorial(n - 1);
}
factorial(5); // 120
```

Each recursive call adds an active call frame. A missing base case can cause infinite recursion/stack overflow. For large inputs, iteration may be safer.

## 11. Function composition
```js
const trim = s => s.trim();
const upper = s => s.toUpperCase();
const exclaim = s => s + "!";
exclaim(upper(trim(" hello "))); // HELLO!
```

Composition chains small functions. Read inner-to-outer: trim, then upper, then exclaim.

## 12. Closures in function factories
```js
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter = createCounter();
counter(); // 1
counter(); // 2
```

The returned function retains access to `count` after `createCounter` returns. Closures support private state, factories, callbacks, and memoization.

## 13. Common mistakes
- Using `console.log` instead of `return` when the caller needs a result.
- Calling a const function-expression before initialization.
- Confusing parameter (definition) with argument (call).
- Arrow body with braces but no return.
- Returning an object from an arrow without parentheses: `() => ({ key: value })`.
- Expecting defaults to replace `null`.
- Rest parameter not last.
- Assuming every callback is asynchronous.
- Recursion without a base case.
- Using arrow as a constructor or dynamic-`this` method.

## 14. Practical frontend patterns
```js
const toOption = employee => ({
  value: employee.id,
  label: employee.name
});
const options = employees.map(toOption);

const isNonEmpty = value =>
  typeof value === "string" && value.trim().length > 0;

const minLength = min => value => value.length >= min;
const validatePassword = minLength(8);
```

Use these for API response transformations, reusable form validation, and configured callbacks in Angular/React.

## 15. Interview Q&A
1. **Declaration vs expression?** Declaration is initialized during scope setup; expression is created when evaluated.
2. **First-class function?** A function treated as a value—assigned, passed, or returned.
3. **Callback?** Function supplied to another function for it to invoke.
4. **HOF?** Accepts or returns a function.
5. **Default return?** `undefined` if execution reaches the end.
6. **Parameter vs argument?** Definition placeholder vs value passed at call.
7. **Rest parameter?** `...args` gathers remaining arguments into an array; must be last.
8. **Default with null?** Null is preserved; defaults apply to undefined/omitted.
9. **Arrow vs regular?** Arrow has lexical `this` and no own `arguments`; regular `this` is call-dependent.
10. **Can arrow be constructor?** No, it is not constructible.
11. **Pure function?** Same inputs yield same output without observable side effects.
12. **Recursion?** Function calling itself; needs a base case.
13. **Stack overflow?** Too many active nested calls, often unbounded recursion.
14. **Are map callbacks async?** No; map invokes callbacks synchronously.
15. **Closure?** Function retains access to lexical environment.
16. **Composition?** Output of one function becomes input of another.
17. **What does return do?** Ends function and supplies a value to caller.
18. **Partial application?** Preset some arguments to create a function for remaining inputs.

## 16. Revision sheet
- Function = reusable behavior.
- Parameter = definition input; argument = call input.
- `return` = value to caller; `console.log` = display.
- Declaration = initialized during scope setup; expression = evaluated at runtime.
- Functions are first-class values.
- Callback = passed function; HOF = accepts/returns function.
- Arrow = lexical `this`; no own `arguments`; not constructible.
- Default applies to undefined/omitted; rest collects remaining args.
- Pure = deterministic/no side effects.
- Recursion = self-call + base case.
- Closure = function retains lexical environment access.
- Composition = chain small functions.

## 17. Coding drill
1. Write add/subtract and return results (don't print inside).
2. Convert a declaration to expression and arrow.
3. Test `greet(name = "Guest")` with omitted, undefined, and null.
4. Write `sum(...numbers)` using reduce; support zero args.
5. Implement `applyOperation(a,b,callback)` with multiply/divide.
6. Implement `makePower(exponent)` returning a power function.
7. Normalize a name using a pure function.
8. Factorial recursively and iteratively; compare.
9. Implement `compose(f,g)(x) = f(g(x))`.
10. Implement `once(fn)`: execute once and cache first result.
11. Implement `memoize(fn)` for primitive arguments; explain limitations.
12. Implement `debounce(fn, delay)`, clear the previous timer, explain behavior.
13. Explain callback, HOF, closure, pure function, and recursion aloud in 90 seconds.

**Next:** Day 10 — Promises, async/await, event loop, microtasks, and asynchronous JavaScript.
