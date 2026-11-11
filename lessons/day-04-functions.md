# Day 4 — Functions: From Basics to Advanced

## Learning goals
- Explain why functions exist and how calls execute.
- Use declarations, expressions, and arrow functions.
- Distinguish parameters from arguments and logging from returning.
- Apply default/rest parameters, scope, callbacks, and pure functions.
- Choose the right function form in frontend code and interviews.

## 1. Why functions?
A function is a reusable unit of behavior. It gives code a name, avoids duplication, separates responsibilities, and makes logic easier to test. Think of it as a machine: inputs (arguments) enter, the body performs work, and an optional output (return value) comes back. Functions may also cause side effects such as logging, DOM updates, or network calls.

```js
function addTax(price, rate) {
  return price + price * rate;
}
addTax(100, 0.18); // 118
addTax(250, 0.18); // 295
```

## 2. Function declaration
```js
function greet(name) {
  return `Hello, ${name}!`;
}
greet("Saurabh"); // "Hello, Saurabh!"
```
A declaration creates a named function binding. Function declarations are initialized during declaration instantiation, so they can generally be called before their textual definition (details depend on scope/module context).

## 3. What happens during a function call?
Conceptually JavaScript creates a new execution context with local bindings and execution state, binds parameters to argument values, executes the body, then completes at return or the end. Each call has its own local variables.
```js
function multiply(a, b) {
  const result = a * b; // local to this call
  return result;
}
multiply(3, 4); // 12
```

## 4. Parameters vs arguments
- **Parameters**: names in the definition.
- **Arguments**: actual values passed at invocation.
```js
function introduce(name, city) { // parameters
  return `${name} lives in ${city}`;
}
introduce("Saurabh", "Mumbai"); // arguments
```
Missing arguments become `undefined`; extra arguments are accepted but don't fill named parameters.
```js
function show(a, b) { console.log(a, b); }
show(10);       // 10 undefined
show(10, 20, 30); // 10 20; extra 30 ignored by named params
```

## 5. return vs console.log
`return` ends the current function and optionally sends a value to its caller. Code after return in that function is not run. If the function reaches its end without return, the result is `undefined`.
```js
function square(n) { return n * n; }
const result = square(5); // 25

function addAndLog(a, b) { console.log(a + b); }
const x = addAndLog(2, 3); // logs 5; x is undefined
```
Logging displays; returning communicates a result to other code.

## 6. Function expression
```js
const subtract = function (a, b) {
  return a - b;
};
subtract(9, 4); // 5
```
A function expression is created as part of an expression and commonly assigned to a variable. A const/let binding is not initialized until its declaration executes; calling it before that causes a ReferenceError (temporal dead zone).

## 7. Arrow functions
```js
const double = n => n * 2;
const add = (a, b) => a + b;
const greet = () => "Hello";
const makeUser = id => ({ id, active: true }); // parentheses return object
```
- Expression body: implicit return.
- Block body: explicit `return` required.
```js
const square = n => n * n;
const square2 = n => {
  const result = n * n;
  return result;
};
```
Arrows have **lexical this** (captured from surrounding scope), no own `arguments`, and cannot be constructors (`new arrow()` throws). Regular functions have dynamic `this` determined by how they are called. Do not turn every method into an arrow.
```js
const obj = {
  value: 10,
  regular() { return this.value; },
  arrow: () => this.value // this is not obj; it is captured outside
};
obj.regular(); // 10
```

## 8. Default parameters
A default is used when the argument is omitted or is `undefined`, not for null, 0, false, or empty string.
```js
function greet(name = "Guest") { return `Hello ${name}`; }
greet();          // Hello Guest
greet(undefined); // Hello Guest
greet(null);      // Hello null
greet("");        // Hello
```

## 9. Rest parameters
Rest collects remaining arguments into a real array and must be last.
```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10
```
Rest in a function definition collects; spread at a call site expands:
```js
function joinWords(separator, ...words) { return words.join(separator); }
joinWords("-", "learn", "JS", "daily"); // learn-JS-daily
```

## 10. Scope and lexical lookup
Scope is where a binding is accessible. Function-local variables normally cannot be read outside their function. A function can access bindings from its outer lexical environment; lookup follows where code is written, not where the function is called.
```js
const appName = "SkyJob";
function show() {
  const message = "Hello";
  return appName + " " + message;
}
show(); // SkyJob Hello
// message is not accessible here
```

## 11. Callback preview
A callback is a function passed as a value for another function to invoke.
```js
function processUser(name, callback) {
  return callback(name.trim());
}
processUser(" Saurabh ", value => value.toUpperCase()); // SAURABH
```
Callbacks can be synchronous or asynchronous. We will study promises and async/await later.

## 12. Pure functions and side effects
A pure function returns the same output for the same inputs and does not change external state. It is easy to test.
```js
function calculateTotal(price, quantity) { return price * quantity; } // pure
let cartTotal = 0;
function addToCart(price) { cartTotal += price; } // side effect
```
Prefer pure calculations where practical; isolate side effects (DOM, network, state changes) at boundaries.

## 13. Frontend patterns
```js
function isRequired(value) { return value.trim().length > 0; }
function handleSubmit(event) {
  event.preventDefault();
  // validate and send request
}
form.addEventListener("submit", handleSubmit);

const displayNames = users.map(user => formatName(user));
function formatName(user) {
  return `${user.firstName} ${user.lastName}`;
}
```
A simple email regex is only a demo; production validation may need more complete rules.

## 14. Common mistakes
- Using console.log when caller needs a value (use return).
- Calling const/let function expression before initialization.
- Arrow expression body vs block body: `{}` requires explicit return.
- Returning object from arrow: `() => ({x: 1})`, not `() => {x: 1}`.
- Assuming missing parameter is null; it is undefined.
- Default applies to undefined, not null/0/false/empty string.
- Arrow object method when method's own this is required.
- Rest parameter must be last; don't confuse rest with spread.
- Mutating external state inside a calculation makes testing harder.

## 15. Interview questions (answers)
1. **Declaration vs expression?** Declaration is initialized during declaration instantiation and can generally be called before its textual definition. Expression is created when its expression executes; const/let binding is unavailable before initialization.
2. **What is hoisting?** Bindings are established before statements execute. Function declarations are initialized; var is initialized to undefined; let/const are in a temporal dead zone until initialization.
3. **Parameters vs arguments?** Parameters are definition names; arguments are values passed at call time.
4. **Default return?** undefined if no explicit return is reached.
5. **console.log vs return?** Log displays; return supplies a value to caller and ends function.
6. **Arrow vs regular?** Arrow captures lexical this, has no own arguments/prototype, and cannot be constructed. Regular function has call-site this and can be a constructor.
7. **Lexical this?** Arrow uses this from surrounding scope instead of receiving it from call-site.
8. **Can arrow be constructor?** No; new with arrow throws TypeError.
9. **Default parameter?** Applies when omitted or undefined, not null/false/0/empty string.
10. **Rest parameter?** `...args` collects remaining arguments into array; must be last.
11. **Callback?** Function passed to another function for it to invoke during/later work.
12. **Pure function?** Same input gives same output and no observable side effects.
13. **Scope?** Region where binding can be accessed; lexical scope follows code nesting.
14. **Why functions?** Reuse, abstraction, separation, testing, naming behavior, less duplication.
15. **After return?** Current function ends immediately; later statements in that function don't execute.

## 16. Practice tasks
1. Write greet(name) returning a greeting; default missing name to Guest.
2. Implement add, subtract, multiply, divide; handle divide-by-zero intentionally.
3. Demonstrate the difference between a function that logs and one that returns.
4. Convert three declarations to arrows; identify which should remain regular and why.
5. Build createUser(name="Guest", role="viewer"); test omitted, undefined, null, empty string.
6. Write average(...numbers); handle no arguments without NaN.
7. Calculate cart subtotal from [{price, quantity}] without mutating input.
8. Write transform(value, callback); call with uppercase, number doubling, and trim callbacks.
9. Predict which variables are accessible across nested blocks/functions; explain lexical scope.
10. Explain declaration vs expression, arrow this, return, rest, and pure function aloud.

## 17. Revision card
- Declaration: `function name(params) { return value; }`
- Expression: `const fn = function(params) { return value; }`
- Arrow: `const fn = (params) => expression;`
- Block arrow body needs explicit return.
- Parameters = names; arguments = values.
- return ends function and sends value; no return → undefined.
- Default applies to omitted/undefined.
- Rest `(...args)` collects into array.
- Scope defines where bindings are accessible.
- Callback = function passed to another function.
- Pure function = same input → same output, no side effects.
- Regular this = call-site; arrow this = lexical capture.

## Next
Day 5: Scope, Hoisting, Execution Context & Closures (deeper mental model).
