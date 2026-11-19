# Day 12 — DOM Fundamentals & Safe DOM Manipulation

## Learning goals

By the end of this lesson, you should be able to:

- Explain how HTML becomes a DOM tree.
- Distinguish Document, Node, Element, and Text nodes.
- Select elements safely and understand live vs static collections.
- Traverse the DOM.
- Create, insert, replace, clone, and remove nodes.
- Choose between textContent, innerText, and innerHTML.
- Work with classes, attributes, properties, data attributes, and inline styles.
- Build a small dynamic employee list without unsafe HTML injection.
- Explain common DOM and XSS interview questions.

---

## 1. What is the DOM, and why does it exist?

DOM means **Document Object Model**. It is a programming interface that represents an HTML or XML document as objects arranged in a tree.

The browser parses HTML and creates an in-memory document structure. JavaScript can then read and change that structure. The DOM is not the original HTML source text; it is the browser's object representation of the parsed document.

Why do we need it?

- HTML describes the initial document.
- CSS describes presentation.
- JavaScript needs an API to inspect and update the document after it loads.
- The DOM provides standard objects, properties, methods, and events for that interaction.

Example HTML:

    <!doctype html>
    <html>
      <body>
        <main>
          <h1>Hello</h1>
          <p>Welcome</p>
        </main>
      </body>
    </html>

Simplified tree:

    Document
      └── html
          ├── head
          └── body
              └── main
                  ├── h1
                  │   └── Text: "Hello"
                  └── p
                      └── Text: "Welcome"

Whitespace and comments can also create nodes. The actual tree may contain more nodes than this simplified drawing.

## 2. Document, Node, Element, and Text

These words are related but not interchangeable.

- **Document**: the entry point representing the loaded document. In browser code, use document.
- **Node**: the general base concept for items in the tree. Documents, elements, text, and comments are node types.
- **Element**: an HTML element such as div, button, or input.
- **Text node**: text inside an element.
- **Comment node**: an HTML comment.

Useful properties:

    const heading = document.querySelector('h1');

    console.log(document.nodeType);       // 9: DOCUMENT_NODE
    console.log(heading.nodeType);        // 1: ELEMENT_NODE
    console.log(heading.firstChild.nodeType); // usually 3: TEXT_NODE

Important relationships:

- parentNode can return a Node.
- parentElement returns the parent only when it is an Element.
- children contains child Elements only.
- childNodes contains all child Nodes, including whitespace text and comments.
- firstElementChild ignores text and comment nodes.
- firstChild does not.

Do not assume childNodes[0] is always the first element. Formatting whitespace may be a text node.

## 3. Selecting elements

### getElementById

    const title = document.getElementById('page-title');

Returns the matching element or null. IDs should be unique within a document.

### querySelector

    const firstCard = document.querySelector('.card');
    const saveButton = document.querySelector('#save-button');
    const field = document.querySelector('form input[name="email"]');

Returns the first element matching a CSS selector, or null.

### querySelectorAll

    const cards = document.querySelectorAll('.card');

Returns a **static NodeList**: it represents the matches at the time the query ran. Adding a new matching element later does not automatically add it to this NodeList.

    cards.forEach(card => {
      console.log(card.textContent);
    });

Always handle a possible null result from querySelector before using the element.

## 4. HTMLCollection vs NodeList — live vs static

This is a common interview topic.

    const liveItems = document.getElementsByClassName('item');
    const staticItems = document.querySelectorAll('.item');

- getElementsByClassName and getElementsByTagName return live HTMLCollections in the usual document context.
- querySelectorAll returns a static NodeList.
- A live collection updates when the document changes.
- A static NodeList does not update its membership after it is created.

Example:

    const live = document.getElementsByClassName('row');
    const snapshot = document.querySelectorAll('.row');

    const newRow = document.createElement('div');
    newRow.className = 'row';
    document.body.append(newRow);

    console.log(live.length);    // includes new row
    console.log(snapshot.length); // old snapshot count

If you need a normal array, convert an iterable/collection:

    const elements = Array.from(document.querySelectorAll('.card'));

Do not confuse a NodeList with an Array. Some NodeLists support forEach, but they do not have every Array method.

## 5. Traversing the DOM

    const card = document.querySelector('.card');

    card.parentElement;
    card.children;
    card.firstElementChild;
    card.lastElementChild;
    card.nextElementSibling;
    card.previousElementSibling;
    card.closest('.panel');

closest(selector) starts at the current element and walks up through ancestors until it finds a match, or returns null.

Example: find the nearest form from a clicked button.

    const form = button.closest('form');

Use Element-specific traversal properties when you mean HTML elements. Use Node properties when text/comment nodes matter.

## 6. Creating and inserting elements

Create a node:

    const message = document.createElement('p');
    message.textContent = 'Employee added successfully';
    message.classList.add('success-message');

Insert it:

    const container = document.querySelector('#messages');
    container.append(message);

Other insertion methods:

    parent.append(child);             // append nodes or strings
    parent.prepend(child);            // insert at beginning
    parent.appendChild(child);        // append one Node
    parent.before(newNode);           // insert before parent
    parent.after(newNode);            // insert after parent
    parent.insertBefore(newNode, ref); // insert before a child

append and prepend accept multiple Nodes and strings. appendChild accepts a Node and returns the inserted node.

A node can exist in only one place in the DOM tree at a time. Appending an existing node moves it; it does not automatically create a copy.

## 7. DocumentFragment for grouped insertion

A DocumentFragment is a lightweight container for nodes. It is useful for assembling a group before inserting that group into the live document.

    const fragment = document.createDocumentFragment();

    for (const name of ['Asha', 'Ravi', 'Meera']) {
      const li = document.createElement('li');
      li.textContent = name;
      fragment.append(li);
    }

    document.querySelector('#names').append(fragment);

When the fragment is inserted, its children move into the document. The fragment itself does not become a visible element.

Do not claim that a fragment is always faster in every browser. Its main benefit is clear grouped construction and insertion.

## 8. Removing, replacing, and cloning nodes

    const oldNode = document.querySelector('.old');
    oldNode.remove();

    const container = document.querySelector('#container');
    container.replaceChildren(newNode); // removes old children, inserts newNode

    const copy = oldNode.cloneNode(true);

- remove() removes the element from its parent.
- replaceWith() replaces the current node.
- replaceChildren() replaces all children.
- cloneNode(false) clones only the node.
- cloneNode(true) clones the node and its descendants.

cloneNode does not copy listeners registered using addEventListener. It can also duplicate id attributes, which can create invalid/ambiguous document IDs. Change IDs when cloning templates.

## 9. textContent vs innerText vs innerHTML

### textContent

    element.textContent = userProvidedName;

Reads or writes the text content of an element and its descendants. It does not parse the assigned string as HTML. This is usually the safest choice for displaying plain user-provided text.

### innerText

    console.log(element.innerText);

Represents rendered, human-visible text more closely. It is CSS/layout aware and can trigger layout work. Use it when rendered text semantics are specifically needed, not as the default for every text operation.

### innerHTML

    element.innerHTML = '<strong>Saved</strong>';

Parses a string as HTML and replaces the element's descendants. This is useful for trusted, intentionally generated markup, but dangerous with untrusted input.

Never do this with user input:

    output.innerHTML = userInput;

An attacker could supply markup containing script-capable event handlers or other dangerous HTML. This can create a Cross-Site Scripting (XSS) vulnerability.

Safer:

    output.textContent = userInput;

If a feature genuinely needs rich HTML from an untrusted source, use a well-maintained HTML sanitizer with an appropriate allowlist, and follow the application's security policy. Do not try to write your own sanitizer with string replacements.

## 10. Attributes vs properties

HTML attributes are written in markup. DOM properties are values exposed on the live JavaScript object.

    <input id="email" value="initial@example.com">

    const input = document.querySelector('#email');

    console.log(input.getAttribute('value')); // original/current content attribute
    console.log(input.value);                 // live current input value

After a user edits the field, input.value reflects the current value. The value attribute generally represents the default value from markup and is not the same thing as the live value property.

Useful methods:

    element.getAttribute('aria-label');
    element.setAttribute('aria-label', 'Close dialog');
    element.hasAttribute('disabled');
    element.removeAttribute('title');

Boolean attributes such as disabled are true by their presence in HTML. Be careful: setAttribute('disabled', 'false') still means the attribute is present. For a form control, use the boolean property:

    button.disabled = true;
    button.disabled = false;

## 11. Classes, data attributes, and styles

### classList

    card.classList.add('active');
    card.classList.remove('hidden');
    card.classList.toggle('expanded');
    card.classList.contains('active');

Prefer classList for stateful styling instead of repeatedly replacing the entire className string.

### data attributes

HTML:

    <button data-employee-id="42">Remove</button>

JavaScript:

    const id = button.dataset.employeeId;

Dataset values are strings. Convert and validate them before treating them as numbers.

### Inline styles

    box.style.backgroundColor = 'tomato';
    box.style.setProperty('--accent-color', 'purple');
    box.style.removeProperty('background-color');

style reads/writes inline styles, not the complete computed style. To inspect computed CSS:

    const styles = getComputedStyle(box);
    console.log(styles.display);

Prefer toggling CSS classes for larger visual states. Keep styling rules in CSS where practical.

## 12. Safe dynamic UI: employee list example

A reliable rendering pattern:

1. Create elements with createElement.
2. Put untrusted text into textContent.
3. Set known attributes/properties explicitly.
4. Assemble rows in a DocumentFragment.
5. Replace or append the container's children.
6. Use event delegation for repeated controls.

See the runnable example in examples/day-12/dom-fundamentals.html and dom-fundamentals.js.

## 13. Event delegation preview

Instead of adding a click listener to every remove button, attach one listener to the stable parent.

    list.addEventListener('click', event => {
      const button = event.target.closest('button[data-action="remove"]');
      if (!button || !list.contains(button)) return;

      console.log('Remove id:', button.dataset.employeeId);
    });

This works because many DOM events bubble from the target through ancestors. Delegation is useful for lists whose children are created after the parent listener is registered. We will study event propagation, capturing, bubbling, and delegation in depth in the next lesson.

## 14. Common mistakes

- Assuming querySelector always returns an element; it may return null.
- Assuming querySelectorAll is live; it is static.
- Assuming getElementsByClassName returns an Array; it returns a live HTMLCollection.
- Confusing childNodes with children.
- Using innerHTML with user-controlled input.
- Treating setAttribute('disabled', 'false') as disabling nothing.
- Forgetting dataset values are strings.
- Assuming cloneNode copies addEventListener listeners.
- Reusing IDs when cloning nodes.
- Appending the same node to two parents and expecting it to appear in both.
- Reading layout properties after repeated writes and causing forced layout.
- Using innerText when textContent is sufficient.
- Updating a detached/stale reference after a node has been replaced.

## 15. Practical frontend use cases

- Render API records into a table or list.
- Add and remove dynamic form rows.
- Populate a select/dropdown from API data.
- Display validation and status messages.
- Toggle menus, tabs, badges, and loading states.
- Build delegated controls for large lists.
- Update accessibility attributes such as aria-expanded and aria-label.
- Safely display names, comments, and other user-provided text.

In Angular and React, normal application UI should usually be rendered through the framework's template/component system. Direct DOM manipulation is appropriate for focused integrations such as measuring an element, managing focus, integrating a third-party widget, or working with a native browser API. Avoid bypassing framework state/rendering for ordinary component updates.

## 16. Interview questions with answers

1. **What is the DOM?** An in-memory object tree representing the parsed document, exposed through browser APIs.
2. **Is DOM the same as HTML?** No. HTML is source/markup; DOM is the parsed live object model.
3. **Node vs Element?** Node is the general tree base concept; Element is an element node such as div or button.
4. **Document nodeType?** 9. Element nodeType? 1. Text nodeType? 3.
5. **querySelector vs querySelectorAll?** First matching element vs static NodeList of all matches.
6. **HTMLCollection vs NodeList?** HTMLCollection from common getElements methods is live; querySelectorAll returns a static NodeList.
7. **children vs childNodes?** Element children vs all child nodes including whitespace text and comments.
8. **What does closest() do?** Finds the nearest matching element starting at the current element and walking toward ancestors.
9. **append vs appendChild?** append accepts multiple nodes/strings and returns undefined; appendChild accepts one Node and returns it.
10. **What is DocumentFragment?** A lightweight container for building a group of nodes before inserting its children.
11. **textContent vs innerText?** textContent represents descendant text without rendered-layout semantics; innerText is closer to rendered visible text and can trigger layout.
12. **Why is innerHTML risky?** It parses strings as HTML; untrusted input can create XSS.
13. **How safely display user input?** Assign it to textContent or a form control's value.
14. **Attribute vs property?** Attribute is markup/content-attribute state; property is the live DOM object value. Some properties reflect attributes, but not all behave identically.
15. **Why does input.value differ from getAttribute('value')?** value is the live current value; the attribute usually represents the default markup value.
16. **How disable a button?** Set button.disabled = true; a present disabled attribute is boolean regardless of text value.
17. **Does cloneNode copy event listeners?** No, not listeners registered with addEventListener.
18. **What is event delegation?** One ancestor listener handles events from matching descendants through bubbling.
19. **What happens if you append an existing node elsewhere?** It is moved from its old parent.
20. **When avoid direct DOM manipulation in Angular/React?** For normal component rendering; let the framework manage state and DOM reconciliation.

## 17. Hands-on coding tasks

### Beginner
1. Create a page with h1, paragraph, and button. Select each with three different selector methods.
2. Print nodeType for document, an element, and its text node.
3. Compare children and childNodes on an element containing whitespace and a comment.
4. Select all cards with querySelectorAll, add another card, and prove the NodeList is static.
5. Compare a live getElementsByClassName collection with a static querySelectorAll result.

### Intermediate
6. Create a list item using createElement and textContent; append it to a list.
7. Build five list items using DocumentFragment.
8. Add a remove button to every row and handle removal with one delegated parent listener.
9. Compare input.value with getAttribute('value') after editing the input.
10. Build a dropdown from an array of departments using createElement and option.value/textContent.
11. Toggle an expanded class and keep aria-expanded synchronized.
12. Clone a card, assign a unique ID, and explain why its addEventListener listener was not cloned.

### Advanced
13. Build the employee list in the example, including add, filter, and remove.
14. Add empty-state and validation messages without using untrusted innerHTML.
15. Create a safe render function that replaces children using a DocumentFragment.
16. Use closest() to locate a row from a nested icon click.
17. Explain how a careless innerHTML assignment can cause XSS and demonstrate the safe textContent alternative.
18. In Angular or React, explain when direct DOM access is justified and when framework rendering should be used.

## 18. Revision sheet

    DOM = parsed document represented as an object tree
    Document = document entry point
    Node = general tree item
    Element = HTML element node
    Text = text node
    querySelector = first match or null
    querySelectorAll = static NodeList
    getElementsByClassName = live HTMLCollection
    children = element children; childNodes = all child nodes
    closest = nearest matching ancestor (including self)
    createElement = create an element
    append = append nodes/strings; appendChild = append one Node
    DocumentFragment = assemble a group before insertion
    remove = detach node; replaceChildren = replace child list
    textContent = safe plain-text insertion
    innerText = rendered-text semantics
    innerHTML = HTML parsing; unsafe with untrusted input
    attributes = markup/content attributes; properties = live DOM values
    classList = add/remove/toggle/check CSS classes
    dataset values are strings
    cloneNode does not copy addEventListener listeners
    event delegation uses bubbling at a stable ancestor

### 10-minute recall

Without looking at the notes:
- Explain live vs static collections.
- Write a safe create-and-append function.
- Explain why textContent is safer than innerHTML for user text.
- Explain value property vs value attribute.
- Describe DocumentFragment and event delegation.

---

**Next lesson — Day 13:** DOM events in depth: event object, event target/currentTarget, bubbling, capturing, propagation control, delegation, default actions, and practical event-driven UI.
