# Day 12 — DOM Fundamentals Practice

Try each task before checking the lesson notes. Run the browser example by opening examples/day-12/dom-fundamentals.html.

## Beginner

- [ ] Select the page title by ID, class, and CSS selector in separate experiments.
- [ ] Print nodeType for document, an element, and a text node.
- [ ] Compare children with childNodes on an element containing whitespace and a comment.
- [ ] Query all cards, add another matching card, and inspect the static NodeList length.
- [ ] Compare getElementsByClassName with querySelectorAll after inserting a new matching element.

## Intermediate

- [ ] Create a list item using createElement and textContent.
- [ ] Build five list items using DocumentFragment.
- [ ] Add a remove button and handle all removals with one delegated parent listener.
- [ ] Change an input, then compare input.value with getAttribute('value').
- [ ] Build a department dropdown from an array using createElement and option properties.
- [ ] Toggle an expanded class and update aria-expanded.
- [ ] Clone a card, assign a unique ID, and test whether addEventListener listeners are copied.

## Advanced

- [ ] Extend the employee example with edit functionality.
- [ ] Add an empty state and validation messages without untrusted innerHTML.
- [ ] Render 500 records using a DocumentFragment and measure with performance.now().
- [ ] Use closest() to find a row from a nested icon/button click.
- [ ] Demonstrate an unsafe innerHTML example in a local throwaway page, then replace it with textContent. Do not deploy the unsafe version.
- [ ] Explain when Angular/React code should use framework rendering rather than direct DOM mutation.

## Output-based drills

1. A querySelectorAll result is stored. A matching node is appended. Does the stored NodeList length change? Explain.
2. A live HTMLCollection is stored. A matching node is appended. Does its length change? Explain.
3. Why can childNodes[0] be a text node when the first visible child is a div?
4. What happens when the same DOM node is appended to a second parent?
5. Does cloneNode(true) copy addEventListener handlers?
6. Why is setAttribute('disabled', 'false') still disabled?
7. Why can input.value differ from getAttribute('value')?
8. Why is textContent safer than innerHTML for user-controlled text?

## Mini-project acceptance criteria

Build an employee directory that:
- Adds a non-empty employee name.
- Filters names case-insensitively.
- Removes an employee using event delegation.
- Shows an empty state.
- Displays accessible status feedback with aria-live.
- Uses textContent for all user-provided text.
- Does not build HTML by concatenating user input.
- Uses one render function to keep the UI consistent.

## Self-review

- [ ] I can explain Document, Node, Element, and Text.
- [ ] I understand live HTMLCollection vs static NodeList.
- [ ] I can create, insert, replace, clone, and remove nodes.
- [ ] I can explain textContent, innerText, and innerHTML.
- [ ] I can distinguish attributes from live DOM properties.
- [ ] I understand classList and dataset.
- [ ] I can explain why untrusted innerHTML is dangerous.
