# Day 5 Practice — Scope, Hoisting & Closures

Attempt without notes, then explain each answer.

1. **Scope map:** Declare a global variable, function-local variable and block-local let/const. Mark where each can be read. Predict each ReferenceError.
2. **Hoisting outputs:** Predict (a) reading var before assignment, (b) calling a function declaration before its line, (c) calling a const function expression before initialization.
3. **TDZ:** Write a block that reads let before declaration. Explain why this throws instead of returning undefined.
4. **Counter closure:** Implement makeCounter with increment, decrement and getValue. Keep count private.
5. **Independent counters:** Make two counters. Prove changing one does not change the other.
6. **Multiplier factory:** multiplyBy(factor) returns a function that multiplies any supplied number.
7. **Loop closure trap:** Reproduce var callbacks printing 3,3,3. Fix with let and explain per-iteration bindings.
8. **Call stack:** Trace global → alpha → beta → gamma; draw the stack immediately before gamma returns and after it returns.
9. **Greeting closure:** createRememberedName(name) returns a function that says “Hello, name”.
10. **Explain aloud:** Describe closure without saying “it copies the variable”; describe binding/environment access.
11. **Challenge:** Implement once(fn) so fn runs only on the first call and subsequent calls return the first result. (Hint: closure state.)
12. **Challenge:** Implement createIdGenerator(prefix) that returns IDs like user-1, user-2, user-3.

## Self-check
- Can I distinguish scope chain from call stack?
- Can I explain var initialization vs let/const TDZ?
- Can I explain why two calls to makeCounter create separate state?
- Can I explain closure in 60 seconds?
