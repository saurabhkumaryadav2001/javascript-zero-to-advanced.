// Day 5 — Scope, Hoisting and Closures
"use strict";

// 1) Scope and lexical lookup
const globalLabel = "outer";
function scopeDemo() {
  const localLabel = "middle";
  function nested() {
    const innerLabel = "inner";
    console.log(innerLabel, localLabel, globalLabel);
  }
  nested();
}
scopeDemo();

// 2) var hoisting
console.log("var before assignment:", hoistedVar); // undefined
var hoistedVar = 42;

// 3) TDZ demonstration (uncomment to see ReferenceError)
// console.log(tdzValue);
// let tdzValue = "initialized";

// 4) Function declaration hoisting
declarationCanRunEarly();
function declarationCanRunEarly() {
  console.log("Function declaration is available");
}

// 5) Closure counter
function makeCounter(start = 0) {
  let count = start;
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    value() { return count; }
  };
}
const firstCounter = makeCounter();
const secondCounter = makeCounter(10);
console.log(firstCounter.increment()); // 1
console.log(firstCounter.increment()); // 2
console.log(secondCounter.value());    // 10
console.log(firstCounter.value());    // 2

// 6) Function factory
function multiplyBy(factor) {
  return number => number * factor;
}
console.log(multiplyBy(3)(7)); // 21

// 7) var/let closure trap (uncomment to observe timers)
// for (var i = 0; i < 3; i++) setTimeout(() => console.log("var", i), 0);
// for (let j = 0; j < 3; j++) setTimeout(() => console.log("let", j), 0);
