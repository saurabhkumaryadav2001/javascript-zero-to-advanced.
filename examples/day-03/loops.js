// Day 3 — Loops & Iteration
"use strict";

console.log("1) classic for");
for (let i = 0; i < 5; i++) console.log(i);

console.log("\n2) while");
let attempts = 0;
while (attempts < 3) {
  console.log("Attempt", attempts + 1);
  attempts++;
}

console.log("\n3) do...while (always at least once)");
let count = 0;
do {
  console.log("Runs:", ++count);
} while (count < 1);

console.log("\n4) break");
for (let i = 0; i < 6; i++) {
  if (i === 3) break;
  console.log(i);
}

console.log("\n5) continue");
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);
}

console.log("\n6) nested loop / coordinates");
for (let row = 1; row <= 2; row++) {
  for (let col = 1; col <= 3; col++) console.log(row, col);
}

console.log("\n7) for...of values");
const fruits = ["apple", "mango", "kiwi"];
for (const fruit of fruits) console.log(fruit);

console.log("\n8) forEach");
fruits.forEach((fruit, index) => console.log(index, fruit));

console.log("\n9) object entries");
const user = { name: "Saurabh", role: "developer" };
for (const [key, value] of Object.entries(user)) console.log(key, value);

console.log("\n10) map/filter/reduce preview");
const prices = [100, 200, 300];
console.log("taxed:", prices.map(p => p * 1.18));
console.log("expensive:", prices.filter(p => p >= 200));
console.log("total:", prices.reduce((sum, p) => sum + p, 0));
