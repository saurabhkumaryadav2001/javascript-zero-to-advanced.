// Day 12 — DOM Fundamentals
// Open dom-fundamentals.html in a browser to run this example.

const form = document.querySelector('#employee-form');
const nameInput = document.querySelector('#employee-name');
const filterInput = document.querySelector('#employee-filter');
const list = document.querySelector('#employee-list');
const status = document.querySelector('#status');
const count = document.querySelector('#count');
const showCountButton = document.querySelector('#show-count');

if (!form || !nameInput || !filterInput || !list || !status || !count || !showCountButton) {
  throw new Error('The example HTML is missing a required element.');
}

let nextId = 4;
let employees = [
  { id: 1, name: 'Asha' },
  { id: 2, name: 'Ravi' },
  { id: 3, name: 'Meera' }
];

function setStatus(message, kind) {
  status.textContent = message;
  status.className = 'status ' + (kind || '');
}

function renderEmployees() {
  const query = filterInput.value.trim().toLowerCase();
  const visibleEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(query)
  );

  const fragment = document.createDocumentFragment();

  for (const employee of visibleEmployees) {
    const row = document.createElement('li');
    row.dataset.employeeId = String(employee.id);

    const name = document.createElement('span');
    name.textContent = employee.name;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.dataset.action = 'remove';
    removeButton.dataset.employeeId = String(employee.id);
    removeButton.setAttribute('aria-label', 'Remove ' + employee.name);

    row.append(name, removeButton);
    fragment.append(row);
  }

  // Replace the current child list in one clear operation.
  list.replaceChildren(fragment);
  count.textContent = visibleEmployees.length + ' of ' + employees.length + ' employees shown';

  if (visibleEmployees.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No matching employees';
    empty.classList.add('muted');
    list.append(empty);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value.trim();

  if (!name) {
    setStatus('Please enter an employee name.', 'error');
    nameInput.focus();
    return;
  }

  employees.push({ id: nextId++, name });
  nameInput.value = '';
  renderEmployees();
  setStatus('Employee added.', 'success');
  nameInput.focus();
});

// One stable parent listener handles all current and future remove buttons.
list.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest('button[data-action="remove"]');
  if (!button || !list.contains(button)) return;

  const id = Number(button.dataset.employeeId);
  employees = employees.filter(employee => employee.id !== id);
  renderEmployees();
  setStatus('Employee removed.', 'success');
});

filterInput.addEventListener('input', renderEmployees);

showCountButton.addEventListener('click', () => {
  setStatus('Total employees: ' + employees.length, 'success');
});

renderEmployees();

// Small DOM inspection exercises (uncomment to experiment):
// console.log(document.nodeType); // 9: DOCUMENT_NODE
// console.log(list.nodeType); // 1: ELEMENT_NODE
// console.log(list.children); // element children only
// console.log(list.childNodes); // includes text nodes created by whitespace
// console.log(document.querySelectorAll('li')); // static NodeList
// console.log(document.getElementsByTagName('li')); // live HTMLCollection
