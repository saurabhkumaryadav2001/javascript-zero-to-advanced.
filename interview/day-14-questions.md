# Day 14 — Browser Storage & Cookies Interview Q&A

## Fundamentals
1. **What is localStorage?** An origin-scoped synchronous string key/value store that persists until cleared.
2. **What is sessionStorage?** An origin- and top-level browsing-context-scoped string store for a tab/window session.
3. **localStorage vs sessionStorage?** localStorage persists until cleared; sessionStorage normally ends with its tab/window session.
4. **Does Web Storage store objects?** No. Use JSON.stringify and JSON.parse for JSON-compatible data.
5. **What does getItem return for a missing key?** null.
6. **What is the same-origin policy?** A browser security boundary based on scheme, host and port.
7. **Is Web Storage synchronous?** Yes. Large operations can block the main thread.

## Cookies
8. **What are cookies used for?** Small state automatically sent with matching HTTP requests, often server-managed sessions.
9. **document.cookie vs localStorage?** Cookies can be attached to requests and have expiry/security attributes; localStorage is client-only and is not automatically sent.
10. **What is HttpOnly?** A server-set cookie attribute that prevents JavaScript access through document.cookie.
11. **What is Secure?** Restricts cookie sending to secure HTTPS connections.
12. **What is SameSite?** Controls whether a cookie is sent in cross-site contexts.
13. **Why does SameSite=None need Secure?** Modern browser cookie rules require it.
14. **Can JavaScript set HttpOnly?** No. The server sets it through Set-Cookie.
15. **How do you delete a cookie?** Expire it with Max-Age=0 or a past Expires, matching its relevant Path and Domain scope.

## Events and IndexedDB
16. **What is the storage event?** A notification to other relevant documents when a storage area changes; it does not fire in the source document.
17. **Does localStorage storage event fire in the same tab?** Not in the document that made the change.
18. **Why use IndexedDB?** For asynchronous, larger structured data, indexes, transactions and offline scenarios.
19. **What is an object store?** An IndexedDB container for records, commonly keyed by a keyPath or explicit key.
20. **What is an IndexedDB transaction?** A scoped unit of database work, with readonly or readwrite mode.

## Security and production
21. **Why is localStorage risky for auth tokens?** Same-origin JavaScript can read it; XSS can steal or alter the value.
22. **Does HttpOnly solve CSRF?** No. Cookies are automatically attached to matching requests; CSRF defenses are still needed.
23. **What errors can Web Storage throw?** SecurityError or QuotaExceededError among others; handle failures.
24. **Why avoid localStorage for large data?** It is synchronous, string-only and relatively limited.
25. **When should you use IndexedDB instead?** For larger structured/offline data and asynchronous transactional operations.

## Product-company style follow-ups
- Design a persistence strategy for a large offline-first application.
- Explain how to synchronize a theme preference across tabs.
- Explain XSS and CSRF risks in cookie vs Web Storage authentication designs.
- How would you version and migrate a stored JSON object?
- How would you handle quota errors and corrupt data?
- Why should an application avoid calling localStorage.clear()?

## Service-company style fundamentals
- Define localStorage, sessionStorage and cookies.
- Compare their lifetime and storage behavior.
- Explain JSON.stringify and JSON.parse.
- Explain HttpOnly, Secure and SameSite.
- What is IndexedDB and when would you use it?
