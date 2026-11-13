# Day 6 Interview Q&A — this / call / apply / bind

1. **What determines this in an ordinary function?** Its call form/call-site, except constructor and explicit-binding cases.
2. **What is this in obj.method()?** The receiver object before the dot.
3. **Plain call in strict mode?** undefined.
4. **call vs apply?** Both invoke immediately; call takes positional arguments, apply takes an array/array-like.
5. **bind vs call?** bind returns a bound function; call invokes immediately.
6. **Can bind change arrow this?** No; arrow this is lexical.
7. **Why does a detached method lose this?** It is later called without its original receiver.
8. **How can you fix a callback receiver?** bind the method, wrap it with an arrow, or avoid this.
9. **Can arrow functions be constructors?** No, they are not constructible; new throws TypeError.
10. **Does bind mutate the original function?** No, it returns a new function.
11. **What is partial application?** Presetting some arguments so a returned function accepts the rest.
12. **Why is an arrow useful in class callbacks?** It lexically captures the instance's this.
