# Day 14 — Browser Storage, Cookies & Persistence

## Learning goals
- Choose between localStorage, sessionStorage, cookies and IndexedDB.
- Explain origin scope, tab scope, lifetime and synchronous/asynchronous behavior.
- Serialize JSON safely and handle corrupt or unavailable storage.
- Understand cookie attributes and how cookies travel with HTTP requests.
- Explain storage events, XSS and CSRF trade-offs.
- Build a preference/draft demo without storing secrets.

## 1. Why browser storage exists
JavaScript memory disappears when a page is reloaded or closed. Browser storage lets an application retain selected data between page executions.

Typical uses include a theme/language preference, a non-sensitive draft, a temporary multi-step form, a server-managed login session cookie, or larger structured offline data.

Browser storage is not a database of record. The user can clear it, browser policies can restrict it, writes can fail, and client-side values can be modified. The server must validate important data and enforce authorization.

## 2. Same-origin scope
Web Storage is scoped by origin: **scheme + host + port**.
- https://example.com and http://example.com are different origins.
- example.com and app.example.com are different hosts.
- Different ports are different origins.

A page cannot freely read another origin's Web Storage. Privacy settings, sandboxing and third-party context restrictions can also affect availability. Always handle storage errors.

## 3. localStorage
localStorage is an origin-scoped, synchronous string key/value store. Values normally remain across reloads and browser restarts until the user, browser or application removes them.

~~~js
localStorage.setItem("app:theme:v1", "dark");
const theme = localStorage.getItem("app:theme:v1"); // string or null
localStorage.removeItem("app:theme:v1");
console.log(localStorage.length);
console.log(localStorage.key(0));
~~~

Use setItem/getItem/removeItem rather than property syntax. Prefer namespaced keys. Be careful with clear(): it removes every key for the origin, including keys belonging to other parts of the same site.

Because Web Storage is synchronous, large reads and writes can block the main thread. Do not write a huge object on every keystroke.

## 4. sessionStorage
sessionStorage has a similar API, but its lifetime is normally tied to an origin and a top-level browsing context (tab/window session). It survives reloads and same-tab navigation, and is normally cleared when that tab/window session ends.

~~~js
sessionStorage.setItem("checkout:wizard-step", "2");
const step = sessionStorage.getItem("checkout:wizard-step");
sessionStorage.removeItem("checkout:wizard-step");
~~~

A separate tab generally has a separate session store. A tab opened with an opener can initially receive a copy of the opener's sessionStorage; after that, the stores are independent.

Use it for temporary per-tab workflow state, not secrets. JavaScript running on the same origin can read it.

## 5. localStorage vs sessionStorage

| Feature | localStorage | sessionStorage |
|---|---|---|
| Scope | Origin | Origin + top-level browsing context |
| Lifetime | Until cleared | Normally until tab/window session ends |
| Survives reload | Yes | Yes |
| Shared across independent tabs | Same origin store | No |
| API | Synchronous | Synchronous |
| Values | Strings | Strings |

Neither is encrypted secret storage. Both are readable by same-origin JavaScript.

## 6. Web Storage stores strings — JSON serialization
Web Storage does not store JavaScript objects directly. Passing an object to setItem commonly stores its string conversion, not a structured object.

~~~js
const profile = { name: "Asha", department: "IT" };
localStorage.setItem("app:profile:v1", JSON.stringify(profile));

const raw = localStorage.getItem("app:profile:v1");
const saved = raw === null ? null : JSON.parse(raw);
~~~

JSON.stringify serializes JSON-compatible data. JSON.parse can throw if the value is malformed, edited by a user, or left behind by an older application version. JSON does not preserve functions, undefined object properties, Map/Set identity, class instances or circular references. Dates become strings and need explicit revival if a Date object is required.

### Defensive helper

~~~js
function saveJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Could not save", key, error);
    return false;
  }
}

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Invalid or unavailable stored data", key, error);
    return fallback;
  }
}
~~~

In production, validate the parsed object's shape before using it. Handle SecurityError and QuotaExceededError. Storage may be unavailable in restricted contexts.

## 7. Cookies: a different mechanism
Cookies are small name/value pieces of state associated with a host/domain and path, with optional expiration and security attributes. The browser automatically attaches matching cookies to relevant HTTP requests. This is why cookies are commonly used for server-managed sessions.

JavaScript-readable cookie example:

~~~js
document.cookie =
  "demo-theme=dark; Path=/; Max-Age=604800; SameSite=Lax; Secure";
console.log(document.cookie);
~~~

document.cookie is a string-based API, not a normal object. Assigning a cookie adds or updates one cookie; it does not replace every cookie. JavaScript cannot read or set HttpOnly. The server sets HttpOnly using the Set-Cookie response header.

### Important cookie attributes
- **Expires / Max-Age:** expiry time. Max-Age is in seconds and takes precedence if both are supplied.
- **Path:** request paths that receive the cookie. Path=/ is common for an app-wide cookie.
- **Domain:** controls host scope. Omitting Domain creates a host-only cookie; do not broaden scope unnecessarily.
- **Secure:** send only over secure HTTPS connections.
- **HttpOnly:** prevents JavaScript access through document.cookie; set by the server, not client JavaScript.
- **SameSite=Strict:** restricts cross-site sending more strongly.
- **SameSite=Lax:** permits some top-level safe navigations while limiting many cross-site subrequests; often a practical default.
- **SameSite=None:** permits cross-site use, but modern browsers require Secure. Third-party-cookie restrictions may still block it.

Cookie behavior also depends on browser policy. Do not assume third-party cookies will be available.

### Read and delete a JavaScript-readable cookie

~~~js
function setCookie(name, value, maxAgeSeconds) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value) +
    "; Path=/; Max-Age=" + maxAgeSeconds + "; SameSite=Lax" + secure;
}

function getCookie(name) {
  const prefix = encodeURIComponent(name) + "=";
  const item = document.cookie.split("; ")
    .find(part => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : null;
}

function deleteCookie(name) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    encodeURIComponent(name) + "=; Path=/; Max-Age=0; SameSite=Lax" + secure;
}
~~~

To delete a cookie, expire it using the same relevant Path and Domain scope used to create it. JavaScript cannot create an HttpOnly cookie.

## 8. Storage events
The storage event notifies other relevant documents when a storage area changes. It does **not** fire in the same document that made the change.

~~~js
window.addEventListener("storage", event => {
  console.log(event.key);
  console.log(event.oldValue);
  console.log(event.newValue);
  console.log(event.url);
  console.log(event.storageArea);
});
~~~

For localStorage, other same-origin documents (often other tabs) can receive the event. For sessionStorage, events are limited to same-origin documents in the same top-level browsing context, such as same-tab embedded documents; they do not synchronize independent tabs.

The storage event is a notification, not a transaction or real-time database.

## 9. IndexedDB basics
IndexedDB is an asynchronous browser database for larger structured data, indexes and offline scenarios. It stores structured-cloneable values in object stores and uses transactions.

~~~js
const request = indexedDB.open("EmployeeAppDB", 1);

request.onupgradeneeded = () => {
  const db = request.result;
  if (!db.objectStoreNames.contains("employees")) {
    db.createObjectStore("employees", { keyPath: "id" });
  }
};

request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction("employees", "readwrite");
  tx.objectStore("employees").put({ id: 1, name: "Asha" });
  tx.oncomplete = () => db.close();
};

request.onerror = () => console.error(request.error);
~~~

Schema changes belong in onupgradeneeded. Transactions can be readonly or readwrite. Real applications should handle transaction errors/aborts, blocked upgrades, version changes and connection cleanup. Libraries can make the event-based API easier to use.

Use IndexedDB for larger structured offline data, not for one tiny theme preference.

## 10. Security: XSS and CSRF

### Web Storage and XSS
localStorage and sessionStorage are readable by JavaScript on the same origin. If an attacker achieves XSS, injected script can read or alter these values.

Do not store passwords, private keys or high-value long-lived secrets in Web Storage.

### Cookies and CSRF
HttpOnly prevents JavaScript from reading a cookie value, reducing one form of token theft. But cookies are automatically attached to matching requests, so CSRF still matters.

Use HTTPS, Secure, HttpOnly, an appropriate SameSite policy, CSRF tokens or origin checks as appropriate, short lifetimes, server-side authorization and careful session design. No single storage mechanism makes authentication secure by itself.

A server-managed session cookie is common. The best authentication architecture depends on the app, backend, identity provider and threat model.

## 11. Quotas, errors and performance
- Web Storage has browser-dependent, relatively small quotas.
- setItem can throw QuotaExceededError.
- Access can throw SecurityError in restricted contexts.
- IndexedDB also has browser-dependent quota and eviction rules.
- Do not rely on a fixed storage quota.
- Web Storage is synchronous; large JSON operations can block the main thread.
- Debounce persistence when appropriate and use IndexedDB for larger structured data.
- Treat browser storage as best-effort persistence/cache, not the only copy of important user data.

## 12. Practical frontend use cases

### Remember a theme

~~~js
const key = "app:theme:v1";
const saved = localStorage.getItem(key);
document.documentElement.dataset.theme =
  saved === "dark" ? "dark" : "light";

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(key, theme);
  } catch (error) {
    console.warn("Preference could not be saved", error);
  }
}
~~~

### Preserve a per-tab wizard step

~~~js
sessionStorage.setItem("checkout:wizard-step", "payment");
const step = sessionStorage.getItem("checkout:wizard-step");
~~~

### Server session cookie
The server can return a Set-Cookie header configured with Secure, HttpOnly, SameSite and appropriate Path/expiry. Application JavaScript should not need to read the session identifier.

## 13. Common mistakes
1. Assuming Web Storage stores objects; it stores strings.
2. Calling JSON.parse without handling malformed data.
3. Using localStorage.clear() and deleting unrelated keys for the origin.
4. Assuming sessionStorage is shared across all tabs.
5. Assuming storage events fire in the same document that made the change.
6. Assuming storage is always available or writes cannot fail.
7. Storing passwords or long-lived secrets in localStorage/sessionStorage.
8. Assuming HttpOnly can be set from document.cookie.
9. Assuming SameSite=None works without Secure.
10. Deleting a cookie with a different Path/Domain scope.
11. Treating browser storage as authoritative server data.
12. Writing large synchronous JSON values on every keystroke.
13. Assuming browser quota is one fixed number.

## 14. Interview questions and answers

**Q1. What is localStorage?**  
An origin-scoped synchronous string key/value store that persists until cleared.

**Q2. What is sessionStorage?**  
An origin- and top-level browsing-context-scoped string store for a tab/window session.

**Q3. localStorage vs sessionStorage?**  
localStorage persists until cleared; sessionStorage is normally cleared when its tab/window session ends.

**Q4. Does Web Storage store objects directly?**  
No. Use JSON.stringify and JSON.parse for JSON-compatible values.

**Q5. What does getItem return for a missing key?**  
null.

**Q6. What is the same-origin policy?**  
A browser security boundary based on scheme, host and port that restricts access between origins.

**Q7. What are cookies used for?**  
Small state sent automatically with matching HTTP requests, commonly server-managed sessions.

**Q8. document.cookie vs localStorage?**  
Cookies can be attached to requests and have expiry/security attributes; localStorage is client-only and is not automatically sent.

**Q9. What is HttpOnly?**  
A server-set cookie attribute that prevents JavaScript access through document.cookie.

**Q10. What is Secure?**  
The cookie is restricted to secure HTTPS connections.

**Q11. What is SameSite?**  
A cookie attribute controlling sending in cross-site contexts.

**Q12. Why does SameSite=None need Secure?**  
Modern browser cookie rules require it.

**Q13. Can JavaScript set HttpOnly?**  
No. The server must set it in Set-Cookie.

**Q14. What is the storage event?**  
A notification to other relevant documents when a storage area changes; it does not fire in the source document.

**Q15. Does localStorage storage event fire in the same tab?**  
No, not in the document that performed the change.

**Q16. Why use IndexedDB?**  
For asynchronous, larger structured browser data, indexes, transactions and offline scenarios.

**Q17. Why is localStorage risky for authentication tokens?**  
Same-origin JavaScript can read it; XSS can steal or alter the value.

**Q18. Does HttpOnly solve CSRF?**  
No. Cookies are automatically attached to matching requests; CSRF defenses are still needed.

**Q19. What errors can storage operations throw?**  
SecurityError or QuotaExceededError, among others; handle failures.

**Q20. Is Web Storage synchronous?**  
Yes. Large operations can block the main thread.

## 15. Hands-on coding tasks

### Beginner
1. Save a theme in localStorage and restore it after reload.
2. Save a temporary wizard step in sessionStorage.
3. Store an object using JSON.stringify and read it using JSON.parse.
4. Handle a missing key and malformed JSON safely.
5. Compare localStorage across two tabs and observe the storage event.

### Intermediate
6. Build a preference panel with namespaced keys and a reset button that removes only its own keys.
7. Write getJson/setJson helpers with try/catch and fallback values.
8. Create and delete a cookie with Path, Max-Age and SameSite.
9. Explain why document.cookie cannot read an HttpOnly cookie.
10. Use sessionStorage for a multi-step form that survives refresh in the same tab.
11. Open two tabs and synchronize a theme through the storage event.

### Advanced
12. Create an IndexedDB database with an employees object store and add/read records.
13. Handle QuotaExceededError and malformed stored values.
14. Design an authentication persistence strategy and explain XSS/CSRF trade-offs.
15. Debounce saving a non-sensitive draft instead of writing on every keystroke.
16. Explain which data belongs in localStorage, sessionStorage, cookies or IndexedDB.

## 16. Revision sheet

| Concept | Remember |
|---|---|
| localStorage | Origin-scoped, synchronous, persistent string key/value |
| sessionStorage | Origin + tab session, synchronous, string key/value |
| JSON.stringify | Serialize JSON-compatible values |
| JSON.parse | Parse; can throw |
| getItem | Returns null for missing key |
| Cookies | Small state sent with matching HTTP requests |
| Set-Cookie | Server response header |
| HttpOnly | Not readable by JavaScript |
| Secure | HTTPS-only cookie |
| SameSite | Controls cross-site cookie sending |
| storage event | Not fired in source document |
| IndexedDB | Async structured browser database |
| XSS | Can read JS-accessible Web Storage |
| CSRF | Cookies auto-attached; separate defenses needed |

### 10-minute recall
- Explain localStorage vs sessionStorage.
- Serialize and parse an object safely.
- List cookie security attributes.
- Explain why storage events do not fire in the source tab.
- Describe XSS vs CSRF.
- Choose IndexedDB for a larger offline dataset.

## 17. Repository files
- lessons/day-14-browser-storage-cookies.md
- examples/day-14/browser-storage.html
- examples/day-14/browser-storage.js
- practice/day-14/tasks.md
- interview/day-14-questions.md

**Next lesson:** Day 15 — JavaScript Modules: ES modules, import/export, default vs named exports, module scope, dynamic import, circular dependencies and frontend bundling.
