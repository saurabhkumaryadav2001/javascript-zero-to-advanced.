# Day 14 — Practice Tasks

Serve the examples/day-14 folder over localhost. For example, run python -m http.server 8000 from that folder and open http://localhost:8000/browser-storage.html. A local HTTP origin is recommended because storage behavior for file:// URLs is not standardized.

## Beginner
- [ ] Save a theme in localStorage and restore it after reload.
- [ ] Save a temporary wizard step in sessionStorage.
- [ ] Store an object with JSON.stringify and read it with JSON.parse.
- [ ] Handle a missing key and malformed JSON safely.
- [ ] Compare localStorage in two tabs and observe the storage event.

## Intermediate
- [ ] Build a preference panel with namespaced keys and a reset button that removes only its own keys.
- [ ] Write getJson/setJson helpers with try/catch and fallback values.
- [ ] Create and delete a cookie with Path, Max-Age and SameSite.
- [ ] Explain why document.cookie cannot read an HttpOnly cookie.
- [ ] Use sessionStorage for a multi-step form that survives refresh in the same tab.
- [ ] Synchronize a theme between two tabs using the storage event.

## Advanced
- [ ] Create an IndexedDB database with an employees object store and add/read records.
- [ ] Handle QuotaExceededError and malformed stored values.
- [ ] Design an authentication persistence strategy and explain XSS/CSRF trade-offs.
- [ ] Debounce saving a non-sensitive draft instead of writing on every keystroke.
- [ ] Explain which data belongs in localStorage, sessionStorage, cookies or IndexedDB.

## Completion checklist
- [ ] I can explain origin scope and tab scope.
- [ ] I can explain why Web Storage is synchronous and string-only.
- [ ] I can explain Secure, HttpOnly, SameSite, Path and Max-Age.
- [ ] I know that storage events do not fire in the source document.
- [ ] I can explain why localStorage is not a safe place for secrets.
- [ ] I can describe when IndexedDB is appropriate.
