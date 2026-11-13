# Day 6 — `this`, `call()`, `apply()`, and `bind()`

## Learning outcomes
- Predict `this` in ordinary function calls, method calls, strict mode, and callbacks.
- Explain why a detached method loses its receiver.
- Use `call`, `apply`, and `bind` correctly.
- Understand lexical `this` in arrow functions.

## 1. What is `this`?
`this` is a special value available inside many functions. For ordinary functions, it is chiefly determined by **how the function is called** (the call-site), not simply where it was written. Arrow functions capture `this` lexically from their surrounding scope.

## 2. Method call
```js
const user = {
  name: "Saurabh",
  showName() { console.log(this.name); }
};
user.showName(); // Saurabh
```
In `user.showName()`, `user` is the receiver, so it becomes `this` for this call.

## 3. Same function, different call
```js
function show() { console.log(this); }
const user = { name: "Saurabh", show };
user.show(); // user
show();      // undefined in strict mode / ES modules
```
In a non-strict classic script, a plain call substitutes `globalThis`; avoid relying on that behavior. ES modules are strict.

## 4. Detached method
```js
const user = { name: "Saurabh", show() { console.log(this.name); } };
const fn = user.show;
fn(); // undefined in strict mode: receiver was lost
```
Assigning a method to a variable does not preserve its original object receiver.

## 5. call, apply, bind
`call` invokes immediately with positional arguments:
```js
function introduce(city, role) {
  return `${this.name} | ${city} | ${role}`;
}
const person = { name: "Saurabh" };
introduce.call(person, "Mumbai", "Developer");
```

`apply` invokes immediately with an array/array-like argument list:
```js
introduce.apply(person, ["Mumbai", "Developer"]);
```

`bind` returns a new function; it does not invoke the original immediately:
```js
const bound = introduce.bind(person, "Mumbai");
bound("Developer");
```

**Memory aid:** call = invoke + comma-separated arguments; apply = invoke + array; bind = function for later.

## 6. Partial application
```js
function add(a, b, c) { return a + b + c; }
const add10 = add.bind(null, 10);
add10(20, 30); // 60
```
Leading arguments can be preset. Here `this` is unused, so `null` is a placeholder.

## 7. Arrow functions: lexical this
```js
const team = {
  name: "Frontend",
  regular() { return this.name; },
  arrow: () => this.name
};
team.regular(); // "Frontend"
team.arrow();   // not "Frontend": arrow captured outer this
```
Arrow functions have no own `this`, `arguments`, `super`, or `new.target` binding; they cannot be constructors. Do not use an arrow as an object method when you need the object as `this`.

## 8. Frontend callback example
```js
const user = {
  name: "Saurabh",
  show() { console.log(this.name); }
};
setTimeout(user.show, 0);            // receiver lost
setTimeout(user.show.bind(user), 0);  // Saurabh
setTimeout(() => user.show(), 0);     // Saurabh
```
A timer calls its callback as a plain function. Bind it or wrap the method in an arrow.

An instance callback can capture instance `this`:
```js
class Counter {
  count = 0;
  constructor(button) {
    button.addEventListener("click", () => {
      this.count++;
      console.log(this.count);
    });
  }
}
```

## 9. Common mistakes
- Treating `this` as lexical in every function (only arrow functions do that).
- Assuming a detached method remembers its object.
- Thinking `bind` executes immediately (it returns a bound function).
- Thinking `call/apply` return a new bound function (they invoke immediately).
- Trying to rebind arrow `this` using call/apply/bind (it cannot be changed).
- Forgetting strict mode / ES modules make plain-call `this` undefined.
- Confusing `this` with scope-chain variable lookup.

## 10. Interview questions
1. **What determines `this` in a regular function?** The call form/call-site, except constructor and explicit binding cases.
2. **What is `this` in `obj.method()`?** The receiver object before the dot.
3. **Plain call in strict mode?** `undefined`.
4. **call vs apply?** Both invoke now; call takes positional arguments, apply takes array/array-like.
5. **bind vs call?** bind returns a new bound function; call invokes immediately.
6. **Can bind change arrow `this`?** No, arrow `this` is lexical.
7. **Why does a detached method lose `this`?** The later call no longer has the object as receiver.
8. **How fix a callback receiver?** Bind it, use an arrow wrapper, or avoid relying on `this`.
9. **Can an arrow be a constructor?** No; `new` throws TypeError.
10. **Does bind mutate the original function?** No, it returns a new function.

## 11. Practice
1. Predict `this` in `obj.method()` and `const f = obj.method; f()`.
2. Compare plain calls in strict and non-strict contexts.
3. Borrow a function with `call`, then repeat with `apply`.
4. Bind a receiver and one preset argument; invoke later.
5. Pass an object method to setTimeout; fix it with bind and an arrow wrapper.
6. Build `multiplyBy(factor)` using bind or a closure.
7. Explain call/apply/bind in 60 seconds.

## Revision card
```
Regular function this -> call-site
obj.method() -> obj
plain strict/module call -> undefined
call(obj, a, b) -> invoke now, positional args
apply(obj, [a, b]) -> invoke now, array args
bind(obj, a) -> bound function for later
Arrow this -> lexical; cannot be rebound
Detached method -> receiver lost
```

Next: Day 7 — objects, references, copying, destructuring, optional chaining.
