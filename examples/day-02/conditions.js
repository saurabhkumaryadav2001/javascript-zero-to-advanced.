// Day 2 — Conditions & Control Flow
// Run: node examples/day-02/conditions.js

console.log("=== Truthiness ===");
console.log(Boolean(""), Boolean("0"), Boolean([]), Boolean({}));

console.log("\n=== || versus ?? ===");
console.log(0 || 10); // 10
console.log(0 ?? 10); // 0
console.log("" || "Guest"); // Guest
console.log("" ?? "Guest"); // ""

function getAgeCategory(age) {
  if (typeof age !== "number" || Number.isNaN(age) || age < 0) {
    return "Invalid age";
  }
  if (age < 13) return "Child";
  if (age <= 17) return "Teen";
  if (age <= 59) return "Adult";
  return "Senior";
}
console.log([8, 15, 26, 65, -1].map(getAgeCategory));

function getLoginMessage(isLoggedIn, userName) {
  if (!isLoggedIn) return "Please log in";
  const safeName = userName?.trim() || "Guest";
  return "Welcome " + safeName;
}
console.log(getLoginMessage(true, " Saurabh "));
console.log(getLoginMessage(true, ""));

function permissionsFor(role) {
  switch (role) {
    case "admin": return ["read", "write", "delete"];
    case "editor": return ["read", "write"];
    case "viewer": return ["read"];
    default: return [];
  }
}
console.log(permissionsFor("editor"));

function submitForm(form) {
  if (!form) return "Missing form";
  if (!form.isValid) return "Fix validation";
  if (form.isSubmitting) return "Already submitting";
  // fake request:
  return "Submitted";
}
console.log(submitForm({ isValid: true, isSubmitting: false }));
