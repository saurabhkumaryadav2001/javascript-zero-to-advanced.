# Day 1 — JavaScript Fundamentals

> Goal: understand what JavaScript is, where it runs, how JavaScript statements execute, and how to declare and inspect values safely.

## 1. What is JavaScript?

JavaScript (JS) is a programming language used to give instructions to a computer. On the web, HTML describes structure, CSS describes appearance, and JavaScript adds behaviour.

For example, HTML can create a button. JavaScript can respond when a person clicks that button, validate a form, call an API, update the page, or manage application state.

JavaScript is also used outside browsers. Node.js provides a runtime that lets JavaScript run on servers, command-line tools, scripts, and developer tooling.

### Is JavaScript the same as Java?

No. They are different languages with different designs and ecosystems. Similar names do not mean one is a version of the other.

### How does JavaScript run?

A JavaScript engine parses and executes JavaScript. Browsers include engines; Node.js embeds the V8 engine. A runtime also provides useful host capabilities such as timers, networking, files, and browser APIs.

Mental model:

1. You write source code.
2. The engine parses it and prepares it for execution.
3. The engine executes the program.
4. The host runtime provides environment features such as `console`, timers, or the DOM.

Do not confuse the language with its runtime. The DOM is a browser API, not part of the core JavaScript language.

## 2. Your first program

Create `examples/day-01/01-hello-javascript.js`:

```js
console.log("Hello, JavaScript!");
console.log("I am learning step by step.");
```

Run it with:

```bash
node examples/day-01/01-hello-javascript.js
```

`console.log()` prints information to the console. It is a debugging and learning tool; it does not return the printed text as the result of the program.

## 3. Statements, expressions, and comments

A **statement** is an instruction that performs an action.

```js
const score = 95;
console.log(score);
```

An **expression** produces a value.

```js
10 + 20          // 30
"Hello" + " JS"  // "Hello JS"
score >= 50      // true
```

Comments are notes for people reading the code. The engine ignores them.

```js
// This is a single-line comment.

/*
  This is a
  multi-line comment.
*/
```

## 4. Variables: let, const, and var

A variable is a named binding that lets a program refer to a value.

Imagine a labelled container: the label is the variable name, and the value is what the name currently refers to. This is a useful beginner model; objects have additional reference semantics that we will study later.

### const

Use `const` when you do not plan to assign a different value to the binding.

```js
const firstName = "Saurabh";
const birthYear = 2001;

console.log(firstName);
console.log(birthYear);
```

This is not allowed:

```js
const age = 26;
age = 27; // TypeError: assignment to constant variable
```

Important: `const` prevents reassignment of the binding. It does **not** make an object or array immutable.

```js
const skills = ["JavaScript", "Angular"];
skills.push("React"); // Allowed: the array itself is modified.
console.log(skills);
```

### let

Use `let` when the binding needs to be reassigned.

```js
let currentScore = 10;
currentScore = 15;
currentScore = currentScore + 5;

console.log(currentScore); // 20
```

### var

`var` is the older variable declaration form. It is function-scoped rather than block-scoped and has hoisting behaviour that can surprise developers.

```js
if (true) {
  var oldStyle = "I can be read outside this block";
  let modernStyle = "I stay inside this block";
}

console.log(oldStyle); // Works
// console.log(modernStyle); // ReferenceError
```

For modern JavaScript, prefer `const` by default and use `let` when reassignment is required. Avoid introducing `var` in new code unless you are deliberately working with legacy code.

### Naming rules and conventions

- Names can contain letters, digits, underscores, and dollar signs.
- A name cannot begin with a digit.
- Names are case-sensitive: `userName` and `username` differ.
- Use descriptive names and usually camelCase for variables.

```js
const employeeName = "Asha";
let retryCount = 0;

// Invalid examples:
// const 2users = 2;
// const user-name = "Asha";
```

## 5. Data types

A data type describes the kind of value a program is working with.

JavaScript has primitive types and objects.

### Primitive types

| Type | Example | Meaning |
|---|---|---|
| string | `"hello"` | Text |
| number | `42`, `3.14` | Numeric values (including integers and decimals) |
| bigint | `123n` | Large integers |
| boolean | `true` | Logical true/false |
| undefined | `undefined` | A value has not been assigned |
| null | `null` | Intentional absence of an object-like value |
| symbol | `Symbol("id")` | Unique identifier value |

Objects include ordinary objects, arrays, and functions.

```js
const productName = "Keyboard";       // string
const price = 1499;                   // number
const isAvailable = true;             // boolean
let selectedProduct;                  // undefined
const emptyValue = null;              // null
const largeNumber = 123456789012345n;  // bigint
const uniqueId = Symbol("id");        // symbol
const product = { name: "Mouse" };    // object
const colors = ["red", "blue"];       // array (object)
function greet() {}                   // function (callable object)
```

Use `typeof` to inspect many values:

```js
console.log(typeof "hello");  // "string"
console.log(typeof 42);       // "number"
console.log(typeof true);     // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof 123n);     // "bigint"
console.log(typeof Symbol()); // "symbol"
console.log(typeof {});       // "object"
console.log(typeof []);       // "object"
console.log(typeof function () {}); // "function"
```

A famous historical JavaScript quirk:

```js
console.log(typeof null); // "object"
```

This is a long-standing language behaviour. To check for null, use:

```js
const value = null;
console.log(value === null); // true
```

To check for an array, use `Array.isArray(value)`, not `typeof`.

```js
console.log(Array.isArray([1, 2])); // true
console.log(Array.isArray({ length: 2 })); // false
```

## 6. Dynamic typing

JavaScript variables are not permanently locked to one type. A binding can be assigned values of different types.

```js
let value = 100;
console.log(typeof value); // "number"

value = "one hundred";
console.log(typeof value); // "string"
```

This flexibility is useful, but it means developers should validate data at boundaries, especially values received from APIs, forms, or users.

## 7. Type conversion and coercion

**Type conversion** means changing a value from one type to another.

Explicit conversion is visible in the code:

```js
const inputAge = "26";
const age = Number(inputAge);

console.log(age);        // 26
console.log(typeof age); // "number"
```

Useful conversions:

```js
console.log(String(100));     // "100"
console.log(Number("42"));    // 42
console.log(Number("hello")); // NaN
console.log(Boolean(1));      // true
console.log(Boolean(0));      // false
```

**Coercion** happens when JavaScript automatically converts a value during an operation.

```js
console.log("5" + 2); // "52": + performs string concatenation here
console.log("5" - 2); // 3: subtraction converts "5" to a number
```

Do not rely on surprising coercion in business logic. Convert inputs deliberately and validate the result.

```js
const rawQuantity = "12";
const quantity = Number(rawQuantity);

if (Number.isNaN(quantity)) {
  console.log("Please enter a valid quantity");
} else {
  console.log(quantity * 2);
}
```

## 8. Operators

Operators let us calculate, compare, assign, and combine values.

### Arithmetic

```js
console.log(10 + 3); // 13
console.log(10 - 3); // 7
console.log(10 * 3); // 30
console.log(10 / 3); // 3.333...
console.log(10 % 3); // 1 (remainder)
console.log(2 ** 3); // 8 (exponentiation)
```

### Assignment

```js
let total = 10;
total += 5; // total = total + 5
total -= 2;
total *= 2;
console.log(total); // 26
```

### Comparison

```js
console.log(5 > 3);       // true
console.log(5 < 3);       // false
console.log(5 >= 5);      // true
console.log(5 === 5);     // true
console.log(5 !== 4);     // true
console.log(5 == "5");    // true (coercive equality)
console.log(5 === "5");   // false (strict equality)
```

Prefer `===` and `!==` because they do not perform the implicit type conversion used by `==` and `!=`.

### Logical operators

```js
const hasAccount = true;
const emailVerified = false;

console.log(hasAccount && emailVerified); // false
console.log(hasAccount || emailVerified); // true
console.log(!hasAccount);                 // false
```

- `&&` (AND) succeeds when both sides are truthy.
- `||` (OR) succeeds when at least one side is truthy.
- `!` (NOT) reverses truthiness.

We will study truthy/falsy values and short-circuit evaluation in depth in a later lesson.

## 9. Strings and template literals

Strings represent text. Use single quotes, double quotes, or backticks.

```js
const first = "Saurabh";
const last = 'Yadav';
const fullName = `${first} ${last}`;

console.log(fullName);
```

Backticks create template literals. They allow interpolation with `${...}` and multi-line strings.

```js
const item = "Laptop";
const itemPrice = 55000;
console.log(`The ${item} costs ₹${itemPrice}.`);
```

## 10. A small practical program

Create `examples/day-01/02-employee-summary.js`:

```js
const employeeName = "Saurabh";
const experienceYears = 2;
const primarySkill = "JavaScript";
let completedTasks = 4;

completedTasks += 1;

const summary = `${employeeName} has ${experienceYears} years of experience.
Primary skill: ${primarySkill}.
Completed tasks today: ${completedTasks}.`;

console.log(summary);
```

Notice the choices:
- `const` is used for values whose bindings are not reassigned.
- `let` is used for the changing task count.
- A template literal makes the output readable.

## 11. Browser example: connect JavaScript to a button

Create `examples/day-01/03-browser-demo.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day 1 JavaScript</title>
</head>
<body>
  <h1 id="heading">JavaScript is ready</h1>
  <button id="changeButton">Click me</button>

  <script>
    const heading = document.querySelector("#heading");
    const button = document.querySelector("#changeButton");

    button.addEventListener("click", function () {
      heading.textContent = "You just ran JavaScript!";
    });
  </script>
</body>
</html>
```

Open this file in a browser and click the button. This introduces the DOM and events; they will be studied properly later. Node.js does not provide `document` by default because the DOM belongs to browsers.

## 12. Common beginner mistakes

1. Using `const` and then trying to reassign it.
2. Declaring everything with `var` instead of understanding `let` and `const`.
3. Assuming `typeof null` returns `"null"`.
4. Assuming `typeof []` returns `"array"`.
5. Comparing values with `==` when strict comparison is intended.
6. Treating `"100"` as a number without converting it.
7. Forgetting that `const` objects can still be mutated.
8. Trying to use browser-only APIs such as `document` inside plain Node.js code.

## 13. Interview questions

Try answering aloud before reading the hints.

1. What is JavaScript, and where can it run?
   - Explain the difference between a language, an engine, and a runtime.

2. What is the difference between `let`, `const`, and `var`?
   - Cover reassignment, scope, and hoisting at a high level.

3. Does `const` make an object immutable?
   - No. It prevents reassignment of the binding, not mutation of the referenced object.

4. What are JavaScript primitive types?
   - Name all seven and give examples.

5. What is the output of `typeof null` and why?
   - It is `"object"`, a historical language quirk.

6. What is the difference between `==` and `===`?
   - Loose equality may coerce types; strict equality does not.

7. What is the output of `"5" + 2` and `"5" - 2`?
   - `"52"` and `3`.

8. What is `NaN`? How can you test for it reliably?
   - Use `Number.isNaN(value)`.

9. What is a template literal?
   - A backtick-delimited string supporting interpolation and multi-line text.

10. Is an array a primitive value?
    - No. Arrays are objects.

## 14. Practice tasks

Do these without copying the examples.

### Task 1 — Personal introduction
Declare constants for your name, city, and primary programming language. Print one sentence using a template literal.

### Task 2 — Simple calculator
Create two number variables and print their sum, difference, product, quotient, and remainder.

### Task 3 — Type inspector
Create one example of each primitive type. Print its value and `typeof` result. For null, also compare it using `=== null`.

### Task 4 — Convert form-like input
Start with `const rawPrice = "250"`. Convert it to a number and calculate 18% tax. Print the final amount.

### Task 5 — Reassignment experiment
Create one `const` object and one `let` variable. Try changing an object property and reassigning each binding. Predict the result before running the code.

### Task 6 — Browser interaction
Build a button that changes a heading and displays a click count.

## 15. Day 1 completion checklist

- [ ] I can explain JavaScript vs the JavaScript runtime.
- [ ] I can run a JavaScript file with Node.js.
- [ ] I know when to use `const` and `let`.
- [ ] I can name JavaScript primitive types.
- [ ] I understand `typeof`, including the null and array quirks.
- [ ] I can convert strings to numbers and validate the result.
- [ ] I understand basic arithmetic, assignment, comparison, and logical operators.
- [ ] I completed at least four practice tasks.
- [ ] I can answer the interview questions without reading the hints.

**Next lesson:** Conditions and control flow — `if`, `else`, `else if`, `switch`, ternary operator, truthy/falsy values, and short-circuit evaluation.
