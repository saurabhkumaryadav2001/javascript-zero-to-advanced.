// Day 13 — DOM Events & Event Delegation
// Open event-delegation.html in a browser.

"use strict";

const form = document.querySelector("#employeeForm");
const nameInput = document.querySelector("#employeeName");
const formStatus = document.querySelector("#formStatus");
const list = document.querySelector("#employeeList");
const filterInput = document.querySelector("#filterInput");
const emptyState = document.querySelector("#emptyState");
const count = document.querySelector("#count");
const eventLog = document.querySelector("#eventLog");

let nextId = 4;

function log(message) {
  eventLog.textContent += message + "\n";
}

function updateDirectoryView() {
  const query = filterInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const row of list.querySelectorAll("li[data-id]")) {
    const name = row.querySelector(".employee-name")?.textContent ?? "";
    const matches = name.toLocaleLowerCase().includes(query);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  emptyState.hidden = visibleCount !== 0;
  count.textContent = visibleCount + " visible / " + list.children.length + " total";
}

function createEmployeeRow(id, name) {
  const row = document.createElement("li");
  row.dataset.id = String(id);

  const nameSpan = document.createElement("span");
  nameSpan.className = "employee-name";
  // Use textContent: employee names are data, not HTML markup.
  nameSpan.textContent = name;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.dataset.action = "remove";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", "Remove " + name);

  row.append(nameSpan, removeButton);
  return row;
}

// Form submit covers button activation and keyboard submission.
form.addEventListener("submit", event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (!name) {
    formStatus.textContent = "Please enter an employee name.";
    nameInput.focus();
    return;
  }

  const row = createEmployeeRow(nextId++, name);
  list.append(row);
  form.reset();
  formStatus.textContent = name + " added.";
  nameInput.focus();
  updateDirectoryView();
});

// One listener handles all current and future remove buttons.
list.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest('button[data-action="remove"]');
  if (!button || !list.contains(button)) return;

  const row = button.closest("li[data-id]");
  if (!row) return;

  const employeeName = row.querySelector(".employee-name")?.textContent ?? "Employee";
  row.remove();
  formStatus.textContent = employeeName + " removed.";
  updateDirectoryView();
});

// Filter as the user types.
filterInput.addEventListener("input", updateDirectoryView);

// Escape clears the filter.
filterInput.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    filterInput.value = "";
    updateDirectoryView();
  }
});

// Propagation demo: capture from outside inward, target, then bubble outward.
const outer = document.querySelector("#outer");
const middle = document.querySelector("#middle");
const inner = document.querySelector("#inner");

outer.addEventListener("click", event => {
  log("CAPTURE outer | target=" + (event.target.id || event.target.nodeName) +
      " | currentTarget=" + event.currentTarget.id);
}, { capture: true });

middle.addEventListener("click", event => {
  log("CAPTURE middle | target=" + (event.target.id || event.target.nodeName) +
      " | currentTarget=" + event.currentTarget.id);
}, { capture: true });

inner.addEventListener("click", event => {
  log("TARGET inner | target=" + (event.target.id || event.target.nodeName) +
      " | currentTarget=" + event.currentTarget.id);
});

middle.addEventListener("click", event => {
  log("BUBBLE middle | target=" + (event.target.id || event.target.nodeName) +
      " | currentTarget=" + event.currentTarget.id);
});

outer.addEventListener("click", event => {
  log("BUBBLE outer | target=" + (event.target.id || event.target.nodeName) +
      " | currentTarget=" + event.currentTarget.id);
});

document.querySelector("#clearLog").addEventListener("click", () => {
  eventLog.textContent = "";
});

updateDirectoryView();
