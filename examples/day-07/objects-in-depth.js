// JavaScript Day 7 — Objects in Depth
"use strict";

// 1. Dot/bracket access and dynamic keys
const employee = { name: "Saurabh", experience: 2, skills: ["Angular", "TypeScript"] };
console.log(employee.name, employee["experience"]);
const key = "name";
console.log(employee[key]);

// 2. Property operations
employee.city = "Mumbai";
employee.name = "Saurabh Yadav";
console.log("city" in employee, Object.hasOwn(employee, "city"));
delete employee.city;

// 3. References and identity
const a = { score: 10 };
const b = a;
b.score = 20;
console.log("shared mutation:", a.score); // 20
console.log({} === {}); // false

// 4. Shallow copy: nested object is shared
const original = { name: "Asha", address: { city: "Mumbai" } };
const shallow = { ...original };
shallow.name = "Riya";
shallow.address.city = "Pune";
console.log(original.name, original.address.city); // Asha Pune

// 5. Object.assign mutates target
const target = { a: 1 };
Object.assign(target, { a: 9, b: 2 });
console.log(target); // {a:9,b:2}

// 6. structuredClone for supported data
const deep = structuredClone(original);
deep.address.city = "Delhi";
console.log(original.address.city, deep.address.city); // Pune Delhi

// 7. Spread: last key wins
const defaults = { theme: "light", pageSize: 20 };
const config = { ...defaults, theme: "dark" };
console.log(config);

// 8. Destructuring, rename and defaults
const person = { name: "Asha", city: "Mumbai" };
const { name, city: location, role = "Developer" } = person;
console.log(name, location, role);

// 9. Nested and parameter destructuring
const api = { data: { items: ["a", "b"] } };
const { data: { items } } = api;
console.log(items);
function createProfile({ username, skills = [] }) {
  return { username, skills };
}
console.log(createProfile({ username: "Saurabh" }));

// 10. Optional chaining + nullish coalescing
const missing = {};
console.log(missing?.profile?.city ?? "Unknown");
console.log(0 ?? 10, 0 || 10); // 0, 10

// 11. Object APIs
const obj = { a: 1, b: 2 };
console.log(Object.keys(obj));
console.log(Object.values(obj));
console.log(Object.entries(obj));
console.log(Object.fromEntries([["x", 10], ["y", 20]]));

// 12. Immutable nested update
const state = { profile: { name: "Asha", city: "Mumbai" }, theme: "light" };
const nextState = { ...state, profile: { ...state.profile, city: "Pune" } };
console.log(state.profile.city, nextState.profile.city); // Mumbai Pune

// 13. Freeze is shallow
const frozen = Object.freeze({ nested: { count: 1 } });
frozen.nested.count = 2; // nested mutation is still possible
console.log(frozen.nested.count); // 2
