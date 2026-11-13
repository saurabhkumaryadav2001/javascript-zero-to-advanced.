// Day 6 — this, call, apply, bind
"use strict";

// 1) Receiver in a method call
const user = {
  name: "Saurabh",
  showName() { return this.name; }
};
console.log(user.showName()); // Saurabh

// 2) Detached method: this is undefined in strict mode
const detached = user.showName;
// detached(); // TypeError when it tries to read this.name

// 3) call and apply invoke now
function introduce(city, role) {
  return `${this.name} | ${city} | ${role}`;
}
const person = { name: "Saurabh" };
console.log(introduce.call(person, "Mumbai", "Developer"));
console.log(introduce.apply(person, ["Mumbai", "Developer"]));

// 4) bind returns a function for later
const boundIntroduce = introduce.bind(person, "Mumbai");
console.log(boundIntroduce("Developer"));

// 5) Partial application
const add = (a, b, c) => a + b + c;
const add10 = add.bind(null, 10);
console.log(add10(20, 30)); // 60

// 6) Arrow this is lexical (not user)
const team = {
  name: "Frontend",
  regular() { return this.name; },
  arrow: () => this.name
};
console.log(team.regular()); // Frontend
console.log(team.arrow());   // outer this.name (undefined in this module)

// 7) Callback receiver fix
const callbackUser = {
  name: "Saurabh",
  show() { console.log(this.name); }
};
setTimeout(callbackUser.show.bind(callbackUser), 0);
setTimeout(() => callbackUser.show(), 0);
