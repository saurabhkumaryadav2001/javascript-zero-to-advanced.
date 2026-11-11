// Day 4 — Functions examples
// Run: node examples/day-04/functions.js

// 1. Declaration and return
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
console.log(greet("Saurabh"));
console.log(greet());

// 2. Return vs log
function add(a, b) {
  return a + b;
}
function addAndLog(a, b) {
  console.log(a + b);
}
const total = add(2, 3);
const loggedResult = addAndLog(2, 3);
console.log({ total, loggedResult }); // 5, undefined

// 3. Function expression
const subtract = function (a, b) {
  return a - b;
};
console.log(subtract(9, 4));

// 4. Arrow functions
const double = n => n * 2;
const sum2 = (a, b) => a + b;
const makeUser = id => ({ id, active: true });
const squareWithBlock = n => {
  const result = n * n;
  return result;
};
console.log(double(4), sum2(2, 3), makeUser(7), squareWithBlock(5));

// 5. Default values: undefined triggers default; null does not
function welcome(name = "Guest") {
  return `Welcome, ${name}`;
}
console.log(welcome(), welcome(undefined), welcome(null), welcome(""));

// 6. Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
function average(...numbers) {
  if (numbers.length === 0) return 0; // explicit empty-input policy
  return sum(...numbers) / numbers.length;
}
console.log(sum(1, 2, 3, 4), average(2, 4, 6));

// 7. Pure calculation
function cartSubtotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
const cart = [{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }];
console.log(cartSubtotal(cart), cart); // input unchanged

// 8. Callback
function transform(value, callback) {
  return callback(value);
}
console.log(transform(" saurabh ", text => text.trim().toUpperCase()));
console.log(transform(5, n => n * 2));

// 9. Function method vs arrow this (run in script; top-level this differs by mode)
const profile = {
  name: "Saurabh",
  getName() { return this.name; },
  // Avoid arrow for a method that needs this to refer to profile.
};
console.log(profile.getName());

// 10. Guard clauses
function divide(a, b) {
  if (b === 0) return "Cannot divide by zero";
  return a / b;
}
console.log(divide(10, 2), divide(10, 0));
