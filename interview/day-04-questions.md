# Day 4 — Function Interview Q&A

## Fundamentals
**Q1. Why do we use functions?**  
A: Reuse, abstraction, separation of responsibilities, readable naming, testing, and reducing duplication.

**Q2. Parameters vs arguments?**  
A: Parameters are identifiers in the function definition; arguments are actual values passed during a call.

**Q3. What does a function return by default?**  
A: `undefined` if it reaches the end without explicit return.

**Q4. console.log vs return?**  
A: Logging displays a value; return supplies a value to the caller and immediately ends the function.

## Function forms
**Q5. Function declaration vs function expression?**  
A: Declarations are initialized during declaration instantiation and can generally be called before their textual definition. Expressions are created when evaluated; const/let bindings are unavailable before initialization.

**Q6. What is hoisting?**  
A: JavaScript establishes bindings before executing statements. Function declarations are initialized; var is initialized to undefined; let/const remain in the temporal dead zone until initialization.

**Q7. Arrow vs regular function?**  
A: Arrow captures lexical this, has no own arguments/prototype, and cannot be constructed. Regular functions have call-site/dynamic this and can be constructors.

**Q8. Can an arrow function be used with new?**  
A: No; it throws TypeError because arrows are not constructible.

**Q9. Why does this arrow not refer to the object?**
```js
const obj = { value: 1, get: () => this.value };
```
A: Arrow captures this from the surrounding lexical scope. It doesn't receive this from `obj.get()`. Use a concise method or regular function when method this is needed.

## Parameters and callbacks
**Q10. How do default parameters work?**  
A: Defaults apply when omitted or undefined—not null, false, 0, or empty string.

**Q11. What is a rest parameter?**  
A: `...args` collects remaining arguments into a real array; it must be last.

**Q12. Rest vs spread?**  
A: Rest collects in a parameter definition; spread expands an iterable/object at a call or literal site.

**Q13. What is a callback?**  
A: A function passed as a value to another function for it to invoke during or later in its work.

## Design and reasoning
**Q14. What is lexical scope?**  
A: Variable lookup follows the nesting where code is written; functions can access outer lexical bindings.

**Q15. What is a pure function?**  
A: Same input produces same output and it has no observable side effects.

**Q16. Why are pure functions easier to test?**  
A: Their output depends only on input, so tests don't need to arrange or inspect external state.

**Q17. What happens after return?**  
A: The current function ends immediately; following statements in that function are not executed.

**Q18. What is a higher-order function?**  
A: A function that takes another function as an argument, returns a function, or both. Array methods such as map/filter are examples.

## Output questions
```js
function f() { console.log("Hi"); }
const result = f();
console.log(result);
```
Answer: logs Hi, then undefined.

```js
const fn = (x) => { x * 2 };
console.log(fn(4));
```
Answer: undefined; braces create a block body and no return is written.

```js
const fn = x => ({ value: x });
console.log(fn(4));
```
Answer: { value: 4 }; parentheses make the object an expression returned by arrow.

```js
function greet(name = "Guest") { return name; }
console.log(greet(undefined), greet(null));
```
Answer: Guest, null.

## Strong interview habit
State the rule, walk through execution, mention an edge case, and then show a concise example. Avoid memorized one-line answers.
