// Day 9 — Functions in Depth (run: node examples/day-09/functions-in-depth.js)
"use strict";

// 1. Declaration, expression, arrow
function add(a, b) { return a + b; }
const subtract = function (a, b) { return a - b; };
const multiply = (a, b) => a * b;
console.log(add(4, 5), subtract(9, 3), multiply(2, 6));

// 2. Parameters/defaults/rest
function greet(name = "Guest") { return `Hello, ${name}`; }
function sum(...values) { return values.reduce((total, n) => total + n, 0); }
console.log(greet(), greet(undefined), greet(null), sum(1, 2, 3, 4));

// 3. Return vs log
function onlyLogs(a, b) { console.log("inside:", a + b); }
console.log("returned:", onlyLogs(2, 3)); // undefined

// 4. Callback and higher-order function
function applyOperation(a, b, operation) { return operation(a, b); }
console.log(applyOperation(10, 2, (x, y) => x / y));

// 5. Closure factory
function makeMultiplier(factor) { return value => value * factor; }
const triple = makeMultiplier(3);
console.log(triple(7));

// 6. Pure function vs side effect
const normalizeName = name => name.trim().replace(/\s+/g, " ");
console.log(normalizeName("  Saurabh   Kumar "));

// 7. Recursion
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(5));

// 8. Composition
const trim = s => s.trim();
const upper = s => s.toUpperCase();
const exclaim = s => s + "!";
console.log(exclaim(upper(trim(" hello "))));

// 9. once(fn)
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      result = fn.apply(this, args);
      called = true;
    }
    return result;
  };
}
const initialize = once(() => { console.log("initialized"); return 42; });
console.log(initialize(), initialize()); // initialized once, 42 42

// 10. Debounce (browser/Node timer)
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
const search = debounce(value => console.log("search:", value), 250);
search("ang"); search("angular"); // only latest after quiet period
