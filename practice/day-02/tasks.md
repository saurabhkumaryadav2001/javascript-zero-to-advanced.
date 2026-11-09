# Day 2 Practice — Conditions & Control Flow

Write solutions in separate functions. Do not look at the interview answers until you attempt them.

1. **Age category:** implement \`getAgeCategory(age)\` for Child (<13), Teen (13–17), Adult (18–59), Senior (60+). Reject negative, non-number, and NaN.
2. **Login message:** \`getLoginMessage(isLoggedIn, userName)\` should return "Please log in" or "Welcome NAME". A blank/missing name should be "Guest".
3. **Price fallback:** given \`discountPrice\` and \`price\`, choose discountPrice unless it is null/undefined. A zero discount must remain zero.
4. **Role permissions:** switch role to permissions for admin/editor/viewer; unknown role gets [].
5. **Form guards:** reject missing form, invalid form, and already-submitting; only then call a fake sendRequest.
6. **Output prediction:** predict before running:
   - Boolean([])
   - Boolean({})
   - Boolean("0")
   - "0" || 9
   - 0 ?? 9
   - true && "OK"
   - false || "fallback"
   - NaN === NaN
7. **Refactor:** rewrite nested if/else validation with guard clauses.
8. **UI state:** implement \`getViewState({loading,error,items})\` returning loading/error/empty/success. Explain which state has priority if flags conflict.

## Self-check
- Can I list all falsy values?
- Can I explain why [] is truthy?
- Can I demonstrate the difference between || and ???
- Can I explain switch fall-through?
- Can I make a nested function flatter using guards?
