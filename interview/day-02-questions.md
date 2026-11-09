# Day 2 — Interview Questions

## Conceptual
1. **Truthy/falsy?** Conditions apply Boolean conversion. Falsy: false, 0/-0, 0n, "", null, undefined, NaN. [] and {} are truthy.
2. **|| vs ??** || falls back for all falsy values; ?? only null/undefined.
3. **&& return value?** First falsy operand, otherwise last operand; it short-circuits.
4. **Short-circuit?** Stop evaluating once the result is known.
5. **if/else vs ternary?** Statement/block vs expression returning a value.
6. **Why ===?** Avoid implicit coercion.
7. **switch without break?** Fall-through.
8. **Objects in switch?** Compared by reference, not contents.
9. **Guard clause?** Early exit to reduce nesting.
10. **NaN equality?** NaN !== NaN; use Number.isNaN.

## Output-based
\`\`\`js
console.log(Boolean([]));          // true
console.log(Boolean({}));         // true
console.log(Boolean("0"));        // true
console.log(0 || 5);              // 5
console.log(0 ?? 5);               // 0
console.log(true && "OK");         // "OK"
console.log(false || "fallback");  // "fallback"
console.log(NaN === NaN);          // false
console.log("admin" === new String("admin")); // false
\`\`\`

## Coding prompts
- Implement age categorization with boundary values.
- Implement role permissions using switch.
- Build a form submit function with guard clauses.
- Implement loading/error/empty/success UI state selection.
- Refactor deeply nested if/else to early returns.

**Interview tip:** State the rule, show a small example, then mention a real frontend use case.