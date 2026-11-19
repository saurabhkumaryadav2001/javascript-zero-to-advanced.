# Day 12 — DOM Interview Questions & Answers

These are representative frontend interview questions commonly used by product and service companies. They are not claimed to be verbatim questions from a specific company's interview.

## Fundamentals

**1. What is the DOM?**  
The Document Object Model is the in-memory object tree created from the parsed document. It exposes APIs that scripts can use to inspect and update the page.

**2. Is the DOM the same as HTML?**  
No. HTML is markup/source. The DOM is the browser's parsed, live object representation. JavaScript changes the DOM; serialization may not match the original source exactly.

**3. What is the difference between Document, Node, and Element?**  
Document represents the document. Node is the general tree item concept. Element is a specific node type representing an HTML/XML element.

**4. What are common nodeType values?**  
Document is 9, Element is 1, Text is 3, and Comment is 8.

**5. Why can childNodes contain unexpected entries?**  
It includes all child nodes, including whitespace text nodes and comments. children includes only child Elements.

## Selection and collections

**6. querySelector vs querySelectorAll?**  
querySelector returns the first matching Element or null. querySelectorAll returns a static NodeList of all matches at query time.

**7. HTMLCollection vs NodeList?**  
HTMLCollection returned by common getElements methods is live. querySelectorAll returns a static NodeList. A NodeList is not a full Array.

**8. When should you use getElementById?**  
When selecting a unique element by its ID. It returns the element or null.

**9. How do you convert a NodeList to an Array?**  
Use Array.from(nodeList) or [...nodeList] when it is iterable.

**10. What does closest() do?**  
It checks the current Element and then its ancestors for the nearest selector match. It returns null if none matches.

## DOM mutation

**11. createElement vs innerHTML?**  
createElement constructs an Element object without parsing a markup string. innerHTML parses a string as HTML and replaces descendants.

**12. append vs appendChild?**  
append accepts multiple Nodes or strings and returns undefined. appendChild accepts one Node and returns the appended Node.

**13. What is DocumentFragment?**  
A lightweight container for assembling nodes before inserting its children into the document. The fragment itself is not inserted as a visible element.

**14. What happens when you append an existing node elsewhere?**  
The node is moved from its old parent to the new location. It is not duplicated.

**15. Does cloneNode(true) copy event listeners?**  
No. It clones the node and descendants, but not listeners registered through addEventListener. Be careful about duplicated IDs.

## Text, security, and properties

**16. textContent vs innerText?**  
textContent reads/writes descendant text without using rendered visibility semantics. innerText approximates rendered human-visible text and can trigger layout.

**17. Why can innerHTML cause XSS?**  
It parses the supplied string as HTML. If untrusted input is inserted, attacker-controlled markup or event-handler attributes can execute unwanted code.

**18. What is the safe way to display a user's name?**  
Create an element and assign the name through textContent. Avoid concatenating user input into innerHTML.

**19. Attribute vs property?**  
An attribute belongs to markup/content-attribute state. A property is a value on the live DOM object. Some properties reflect attributes, but they are not universally interchangeable.

**20. Why can input.value differ from getAttribute('value')?**  
The value property reflects the current live input value. The value attribute generally represents the default value from markup.

**21. Why does setAttribute('disabled', 'false') disable a button?**  
disabled is a boolean HTML attribute. Its presence means true; the text "false" does not turn it off. Use button.disabled = false or removeAttribute('disabled').

**22. What does dataset return?**  
A DOMStringMap whose data attribute values are strings. Convert and validate values when numbers or booleans are required.

## Frontend engineering

**23. What is event delegation?**  
Registering one listener on a stable ancestor and handling matching descendant events as they bubble upward.

**24. Why use event delegation for dynamic lists?**  
New children automatically work with the parent listener; no listener must be attached to each newly created button.

**25. How can you avoid unnecessary layout work during DOM updates?**  
Batch geometry reads, then batch DOM/style writes. Avoid alternating reads such as offsetWidth with writes such as style.width.

**26. Should Angular or React applications directly mutate the DOM for normal rendering?**  
Usually no. Use framework state and templates/components. Direct DOM access is for focused cases such as focus management, measurement, native APIs, and third-party integrations.

**27. How do you update an accessible toggle?**  
Update the visual class/state and keep aria-expanded or aria-pressed synchronized with the actual control state.

**28. What is the difference between remove() and replaceChildren()?**  
remove() detaches the current element from its parent. replaceChildren() replaces the child list of a container.

## Coding prompts

- Build a searchable employee list with add/remove controls.
- Create a dropdown from API-like data without string-building HTML.
- Implement one delegated click listener for dynamically generated rows.
- Safely render untrusted comments.
- Explain and fix a stale NodeList vs live HTMLCollection bug.
