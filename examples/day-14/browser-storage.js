"use strict";

// Day 14 Browser Storage Lab.
// All keys are namespaced. This demo stores no passwords or authentication secrets.

const KEYS = {
  theme: "day14-demo:theme:v1",
  profile: "day14-demo:profile:v1",
  draft: "day14-demo:draft:v1",
  shared: "day14-demo:shared:v1",
  sessionCount: "day14-demo:session-count:v1"
};

const byId = id => document.getElementById(id);
const status = byId("status");

function report(message) {
  status.textContent = message;
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Storage write failed:", error);
    report("Could not save data: " + error.name);
    return false;
  }
}

function safeGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch (error) {
    console.error("Storage read failed:", error);
    report("Could not read data: " + error.name);
    return null;
  }
}

function saveJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("JSON/storage write failed:", error);
    report("Could not save JSON: " + error.name);
    return false;
  }
}

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Stored JSON is invalid or unavailable:", error);
    report("Stored data could not be read; using a safe fallback.");
    return fallback;
  }
}

function applyTheme(theme) {
  const validTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = validTheme;
  byId("theme").value = validTheme;
}

function loadTheme() {
  applyTheme(safeGet(localStorage, KEYS.theme));
}

byId("theme").addEventListener("change", event => {
  const theme = event.currentTarget.value;
  applyTheme(theme);
  if (safeSet(localStorage, KEYS.theme, theme)) {
    report("Theme preference saved.");
  }
});

// Profile: store a small, non-sensitive JSON object.
function renderProfile() {
  const profile = readJson(localStorage, KEYS.profile, null);
  byId("profile-output").textContent = profile
    ? JSON.stringify(profile, null, 2)
    : "No saved profile.";

  if (profile && typeof profile.name === "string") {
    byId("profile-name").value = profile.name;
  }
  if (profile && typeof profile.department === "string") {
    byId("profile-department").value = profile.department;
  }
}

byId("profile-form").addEventListener("submit", event => {
  event.preventDefault();

  const profile = {
    name: byId("profile-name").value.trim(),
    department: byId("profile-department").value
  };

  if (!profile.name) {
    report("Please enter a display name.");
    return;
  }

  if (saveJson(localStorage, KEYS.profile, profile)) {
    renderProfile();
    report("Profile saved as JSON.");
  }
});

byId("clear-profile").addEventListener("click", () => {
  try {
    localStorage.removeItem(KEYS.profile);
    byId("profile-name").value = "";
    renderProfile();
    report("Profile removed.");
  } catch (error) {
    report("Could not remove profile: " + error.name);
  }
});

// Draft persistence is delayed slightly so we do not write on every keystroke.
let draftTimer;
const draftInput = byId("draft");
const draftStatus = byId("draft-status");

draftInput.value = safeGet(localStorage, KEYS.draft) || "";

draftInput.addEventListener("input", event => {
  const value = event.currentTarget.value;
  draftStatus.textContent = "Saving shortly...";
  clearTimeout(draftTimer);

  draftTimer = setTimeout(() => {
    if (safeSet(localStorage, KEYS.draft, value)) {
      draftStatus.textContent = "Draft saved.";
    } else {
      draftStatus.textContent = "Draft could not be saved.";
    }
  }, 350);
});

byId("clear-draft").addEventListener("click", () => {
  clearTimeout(draftTimer);
  try {
    localStorage.removeItem(KEYS.draft);
    draftInput.value = "";
    draftStatus.textContent = "Draft removed.";
  } catch (error) {
    draftStatus.textContent = "Could not remove draft: " + error.name;
  }
});

// Per-tab sessionStorage example.
function renderSessionCount() {
  const count = Number(safeGet(sessionStorage, KEYS.sessionCount) || "0");
  byId("session-count").textContent = "This tab's count: " + count;
}

byId("increment-session").addEventListener("click", () => {
  const current = Number(safeGet(sessionStorage, KEYS.sessionCount) || "0");
  if (safeSet(sessionStorage, KEYS.sessionCount, String(current + 1))) {
    renderSessionCount();
    report("This tab's session count incremented.");
  }
});

// Cookie helpers: a demo preference only. The server must set HttpOnly cookies.
function secureAttribute() {
  return location.protocol === "https:" ? "; Secure" : "";
}

function setCookie(name, value, maxAgeSeconds) {
  document.cookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value) +
    "; Path=/; Max-Age=" + maxAgeSeconds + "; SameSite=Lax" +
    secureAttribute();
}

function getCookie(name) {
  const prefix = encodeURIComponent(name) + "=";
  const item = document.cookie.split("; ")
    .find(part => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : null;
}

function deleteCookie(name) {
  document.cookie =
    encodeURIComponent(name) + "=; Path=/; Max-Age=0; SameSite=Lax" +
    secureAttribute();
}

byId("set-cookie").addEventListener("click", () => {
  setCookie("day14-demo-preference", "hello", 3600);
  byId("cookie-output").textContent = "Demo cookie set (if cookies are enabled).";
});

byId("read-cookie").addEventListener("click", () => {
  byId("cookie-output").textContent =
    "Cookie value: " + String(getCookie("day14-demo-preference"));
});

byId("delete-cookie").addEventListener("click", () => {
  deleteCookie("day14-demo-preference");
  byId("cookie-output").textContent =
    "Deletion requested for the matching Path=/ cookie.";
});

// The storage event is delivered to other relevant documents, not this source document.
window.addEventListener("storage", event => {
  if (event.storageArea === localStorage) {
    const detail = "Key: " + String(event.key) +
      " | old: " + String(event.oldValue) +
      " | new: " + String(event.newValue);

    byId("storage-status").textContent =
      "Change from another document — " + detail;

    if (event.key === KEYS.theme) applyTheme(event.newValue);
    if (event.key === KEYS.profile) renderProfile();
  }
});

byId("change-shared-value").addEventListener("click", () => {
  const value = "Updated at " + new Date().toLocaleTimeString();
  if (safeSet(localStorage, KEYS.shared, value)) {
    report("Shared value changed. Another same-origin tab can receive a storage event.");
  }
});

// Remove only this demo's namespaced keys; do not clear all origin storage.
byId("reset-demo").addEventListener("click", () => {
  try {
    for (const key of Object.values(KEYS)) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
    deleteCookie("day14-demo-preference");
    draftInput.value = "";
    draftStatus.textContent = "";
    byId("profile-name").value = "";
    applyTheme("light");
    renderProfile();
    renderSessionCount();
    report("Only this demo's namespaced keys were removed.");
  } catch (error) {
    report("Reset was incomplete: " + error.name);
  }
});

// Initial render.
loadTheme();
renderProfile();
renderSessionCount();
