# Day 02 — Conditions & Control Flow

> Beginner-friendly, interview-focused lesson. Run every example in Node.js or the browser console.

## Outcomes
- Understand how JavaScript chooses a path.
- Use \`if / else if / else\`, ternary, and \`switch\`.
- Explain truthy/falsy conversion and short-circuiting.
- Use \`===\`, \`&&\`, \`||\`, \`??\`, and \`!\` safely.
- Write readable guard clauses for frontend logic.

## 1. Control flow

Statements normally run top-to-bottom. Control flow lets a program decide which statements to run. A condition is evaluated first; JavaScript converts its result to Boolean (truthiness), then chooses a branch.

\`\`\`js
const age = 20;
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
\`\`\`

Execution: evaluate \`age >= 18\` → get \`true\` → run the first block → skip else. Only one branch in an if/else chain runs.

## 2. if / else if / else

\`\`\`js
if (condition) {
  // condition is truthy
} else if (anotherCondition) {
  // first condition was falsy; this one is truthy
} else {
  // all earlier conditions were falsy
}
\`\`\`

Conditions are expressions. For example, \`age >= 18\` produces a Boolean. Use braces even for one statement; they make later edits safer.

## 3. Truthy and falsy (ToBoolean)

Falsy values are exactly:
- \`false\`
- \`0\`, \`-0\`, \`0n\`
- \`""\` (empty string)
- \`null\`
- \`undefined\`
- \`NaN\`

Everything else is truthy, including \`"0"\`, \`"false"\`, \`[]\`, \`{}\`, and functions.

\`\`\`js
Boolean("")       // false
Boolean("hello") // true
Boolean("0")     // true
Boolean(0)       // false
Boolean([])      // true
Boolean({})      // true
\`\`\`

**Frontend gotcha:** an empty array is truthy. \`if (items)\` does not mean “items has elements.” Use \`items.length > 0\` or \`items.length === 0\`.

## 4. Comparisons

- \`===\`: strict equality (no type coercion)
- \`!==\`: strict inequality
- \`>\`, \`<\`, \`>=\`, \`<=\`: relational comparisons

\`\`\`js
5 === 5                 // true
5 === "5"               // false
5 == "5"                // true (coercion)
null == undefined       // true
null === undefined      // false
NaN === NaN             // false
Number.isNaN(NaN)       // true
\`\`\`

Prefer \`===\` / \`!==\`. The loose equality operator \`==\` applies conversion rules that can be surprising. Use it only when intentional and documented. Use \`Number.isNaN\` to test NaN.

## 5. Logical operators and short-circuit evaluation

These operators return operands—not necessarily Boolean values.

### AND: \`&&\`
- Evaluate left operand.
- If left is falsy, return it and skip right.
- Otherwise evaluate and return right.

\`\`\`js
const user = { name: "Saurabh" };
user && user.name;       // "Saurabh"
0 && doSomething();      // 0; doSomething is not called
\`\`\`

### OR: \`||\`
- If left is truthy, return it and skip right.
- Otherwise evaluate and return right.

\`\`\`js
const name = inputName || "Guest";
const retryCount = 0 || 3; // 3 — this can be a bug!
\`\`\`

### Nullish coalescing: \`??\`
Use the fallback only if the left side is \`null\` or \`undefined\`. It preserves \`0\`, \`false\`, and \`""\`.

\`\`\`js
0 ?? 3           // 0
"" ?? "Untitled" // ""
null ?? "Guest"  // "Guest"
undefined ?? 5   // 5
\`\`\`

**Rule:** \`||\` = any falsy value triggers fallback; \`??\` = only null/undefined triggers fallback. JavaScript disallows mixing \`??\` with \`&&\` or \`||\` without parentheses.

### NOT: \`!\`
\`\`\`js
!true       // false
!0          // true
!!"hello"   // true (explicit Boolean conversion)
\`\`\`

## 6. Ternary operator

Ternary is an expression for one simple choice:

\`\`\`js
const message = isLoggedIn ? "Welcome" : "Please log in";
// condition ? valueIfTruthy : valueIfFalsy
\`\`\`

Use it when the choice is short. Avoid deeply nested ternaries; use if/else or a named function for complex logic.

## 7. switch

Use switch when matching one value against discrete options. Case matching is strict-equality-like.

\`\`\`js
switch (role) {
  case "admin":
    console.log("Full access");
    break;
  case "editor":
    console.log("Can edit");
    break;
  case "viewer":
    console.log("Read only");
    break;
  default:
    console.log("Unknown role");
}
\`\`\`

**break** exits switch. Without it, execution falls through into later cases. Shared cases can intentionally fall through:

\`\`\`js
switch (day) {
  case "Sat":
  case "Sun":
    console.log("Weekend");
    break;
  default:
    console.log("Weekday");
}
\`\`\`

## 8. Guard clauses / early return

Handle invalid cases first and exit; the normal path stays flat and readable.

\`\`\`js
function submitForm(form) {
  if (!form) return "Missing form";
  if (!form.isValid) return "Fix validation";
  if (form.isSubmitting) return "Already submitting";

  sendRequest(form); // happy path
  return "Submitted";
}
\`\`\`

- \`return\`: exits a function
- \`break\`: exits a loop or switch
- \`continue\`: skips to the next loop iteration

## 9. Frontend examples

### Loading, error, empty, success
\`\`\`js
if (isLoading) {
  renderSpinner();
} else if (error) {
  renderError(error.message);
} else if (users.length === 0) {
  renderEmptyState();
} else {
  renderUsers(users);
}
\`\`\`

### Form validation
\`\`\`js
if (!email.trim()) {
  error = "Email is required";
} else if (!email.includes("@")) {
  error = "Enter a valid email";
} else {
  error = "";
}
\`\`\`
This demonstrates branching, not complete email validation.

### Permission check
\`\`\`js
if (user.role === "admin") {
  showAdminPanel();
} else {
  showRegularPanel();
}
\`\`\`

## 10. Common mistakes
1. \`if (x = 5)\` assigns; use \`===\` for comparison.
2. Empty arrays/objects are truthy; check length for an empty list.
3. \`price || 100\` replaces a valid zero; use \`price ?? 100\` when zero is allowed.
4. Missing \`break\` causes switch fall-through.
5. \`==\` can coerce types unexpectedly.
6. Parenthesize complex logic: \`(isAdmin || isOwner) && isActive\`.
7. Form/input values often arrive as strings; convert and validate intentionally.
8. Reduce nested branches with guard clauses or helper functions.

## 11. Interview Q&A

**Q1. What are truthy/falsy values?**  
Conditions convert values to Boolean. Falsy: false, 0/-0, 0n, empty string, null, undefined, NaN. Most others—including [] and {}—are truthy.

**Q2. Difference between || and ??**  
\`||\` falls back for every falsy value; \`??\` only for null/undefined. Thus \`0 || 10\` is 10, but \`0 ?? 10\` is 0.

**Q3. What does && return?**  
The first falsy operand, or the last operand if all are truthy. It short-circuits.

**Q4. Explain short-circuiting.**  
Evaluation stops when the result is already determined: falsy left skips right for &&; truthy left skips right for ||.

**Q5. if/else vs ternary?**  
if/else is statement-based control flow; ternary is an expression that returns one of two values. Ternary is best for simple choices.

**Q6. Why === over ==?**  
Strict equality avoids implicit coercion and is predictable.

**Q7. What happens without break in switch?**  
Execution falls through into following cases until break, return, throw, or switch end.

**Q8. Can switch compare object contents?**  
No. Objects compare by reference; separate objects with equal fields are not strictly equal.

**Q9. What are guard clauses?**  
Early exits for invalid cases that reduce nesting and clarify the happy path.

**Q10. Predict Boolean([]), Boolean({}), Boolean("0").**  
All true.

**Q11. Predict 0 || 5 and 0 ?? 5.**  
5 and 0.

**Q12. Predict "admin" === new String("admin").**  
False: primitive string and String object are different.

## 12. Practice (attempt before checking)
1. **Age category:** \`getAgeCategory(age)\` returns Child (<13), Teen (13–17), Adult (18–59), Senior (60+). Reject invalid/negative ages.
2. **Login message:** use \`isLoggedIn\` and \`userName\`; missing/null/empty name becomes Guest.
3. **Price fallback:** choose \`discountPrice\` unless null/undefined. Preserve a valid zero.
4. **Role permissions:** switch for admin/editor/viewer; unknown role gets a fallback.
5. **Form guards:** reject missing, invalid, or already-submitting form; only then call fake sendRequest.
6. **Output predictions:** Boolean([]), "0" || 9, 0 ?? 9, true && "OK", false || "fallback", NaN === NaN.
7. **Refactor:** convert nested validation into guard clauses and explain readability.
8. **UI state:** \`getViewState({loading,error,items})\` returns loading/error/empty/success; document priority when flags conflict.

## 13. Revision card
- Falsy: false, 0, -0, 0n, "", null, undefined, NaN
- Truthy: "0", "false", [], {}, functions
- \`===\` strict; prefer \`!==\`
- \`&&\`: first falsy or last operand; short-circuits
- \`||\`: first truthy or last operand; short-circuits
- \`??\`: fallback only for null/undefined
- \`!\`: Boolean conversion then negation; \`!!x\` converts to Boolean
- \`condition ? A : B\`: ternary
- switch needs break unless fall-through is intentional
- return exits function; break exits loop/switch; continue advances loop

**5-minute recall:** explain truthiness without notes; give a case where || is wrong and ?? is right; write shared switch cases; refactor nested validation into guards.

Next lesson: **Day 3 — Loops & Iteration**.
