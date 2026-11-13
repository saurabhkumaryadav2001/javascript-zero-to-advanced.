# Day 6 Practice — this, call, apply, bind

## Predict first (do not run)
1. What does `obj.method()` bind as this?
2. What happens after `const fn = obj.method; fn()` in strict mode?
3. What is the difference between `fn.call(obj, 1, 2)` and `fn.apply(obj, [1, 2])`?
4. Does `fn.bind(obj)` execute fn?
5. Can call/apply/bind change arrow-function this?
6. Why can `setTimeout(obj.method, 0)` lose its receiver?

## Build
- [ ] A `describe(city, job)` function; invoke using call and apply.
- [ ] A bound function that preset city to Mumbai.
- [ ] `multiplyBy(factor)` using bind or closure.
- [ ] A callback-safe object method using bind.
- [ ] An arrow-vs-regular method example and explain it.
- [ ] A 60-second verbal explanation of call/apply/bind.

## Self-check
- [ ] I identify call-site for ordinary function this.
- [ ] I know plain-call this in strict mode is undefined.
- [ ] I know bind returns a function; call/apply invoke.
- [ ] I know arrow this is lexical.
