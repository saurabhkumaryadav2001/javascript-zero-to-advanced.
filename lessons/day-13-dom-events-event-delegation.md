# Day 13 — DOM Events, Propagation & Event Delegation

## Learning goals

Understand how browser events are created and dispatched; distinguish target from currentTarget; explain capturing, target and bubbling phases; control default actions and propagation; register and remove listeners correctly; and build dynamic interfaces with event delegation.

## 1. What is an event?

An event is a notification that something happened in the document or browser: a click, key press, input edit, form submission, pointer movement, resource load, and so on. The browser dispatches an event object to registered listeners. Your code reacts rather than repeatedly checking whether something happened.

HTML:
~~~html
<button id="saveButton" type="button">Save</button>
~~~

JavaScript:
~~~js
const saveButton = document.querySelector("#saveButton");

saveButton.addEventListener("click", () => {
  console.log("Save was clicked");
});
~~~

The browser owns event dispatch. JavaScript registers callbacks; when the event occurs, the browser invokes the relevant callbacks according to the event's dispatch rules.

## 2. The Event object

A listener receives an Event object. For a click, the actual object is generally a MouseEvent, which inherits from UIEvent and Event.

~~~js
button.addEventListener("click", event => {
  console.log(event.type);            // "click"
  console.log(event.target);          // original target
  console.log(event.currentTarget);   // element whose listener is running
  console.log(event.bubbles);
  console.log(event.cancelable);
  console.log(event.defaultPrevented);
  console.log(event.eventPhase);
});
~~~

Important properties and methods:

- type: event name such as click, input or submit.
- target: original event target; it may be a nested child.
- currentTarget: object whose listener is currently executing.
- eventPhase: 1 = capturing, 2 = at target, 3 = bubbling, 0 = none.
- bubbles: whether the event bubbles.
- cancelable: whether its default action can be canceled.
- defaultPrevented: whether preventDefault successfully canceled the default.
- preventDefault(): requests cancellation of a cancelable default action.
- stopPropagation(): stops further travel along the propagation path.
- stopImmediatePropagation(): also stops later listeners on the same current target.

The target is not guaranteed to be an Element. It can be a Text node or another EventTarget. Check before calling Element-only methods such as closest().

## 3. target vs currentTarget

~~~html
<div id="card">
  <button id="save"><span id="label">Save</span></button>
</div>
~~~

~~~js
document.querySelector("#card").addEventListener("click", event => {
  console.log("target:", event.target);
  console.log("currentTarget:", event.currentTarget);
});
~~~

If the user clicks the span, target is the span (the original target), while currentTarget is the div whose listener is running. As the event travels, currentTarget changes for each listener. It is meaningful while that listener executes; do not expect it to remain useful inside a later asynchronous callback. Store what you need first.

## 4. Event propagation: capturing, target, bubbling

For a bubbling event, the simplified route is:

1. Capturing: outer ancestors travel inward toward the target.
2. Target: listeners on the target are processed.
3. Bubbling: the event travels outward through ancestors.

Nested structure:

~~~text
window
  document
    html
      body
        #outer
          #middle
            button#inner  <-- target
~~~

~~~js
outer.addEventListener("click", () => console.log("outer bubble"));
middle.addEventListener("click", () => console.log("middle bubble"));
inner.addEventListener("click", () => console.log("inner target"));
~~~

Click inner. For a normal bubbling click, the output is inner target, middle bubble, outer bubble.

### Capturing listeners

Use the third argument true or an options object with capture: true.

~~~js
outer.addEventListener("click", () => console.log("outer capture"), { capture: true });
middle.addEventListener("click", () => console.log("middle capture"), { capture: true });
inner.addEventListener("click", () => console.log("inner target"));
~~~

A typical complete order for the nested example is:

~~~text
outer capture
middle capture
inner target
middle bubble
outer bubble
~~~

At the target, capture and non-capture listeners both participate in target processing. Do not simplify target phase to only one listener category.

Not every event bubbles. focus and blur do not bubble in the usual way; focusin and focusout do. Check the behavior of the event you are using.

## 5. addEventListener and options

Syntax: element.addEventListener(type, listener, options).

- capture: run in the capture phase.
- once: automatically remove after the first invocation.
- passive: promise not to call preventDefault; useful for applicable scroll/touch listeners.
- signal: an AbortSignal that can remove the listener when aborted.

~~~js
const controller = new AbortController();

window.addEventListener("resize", handleResize, {
  passive: true,
  signal: controller.signal
});

// Later: removes listeners registered with this signal.
controller.abort();

button.addEventListener("click", handleFirstClick, { once: true });
~~~

A passive listener cannot cancel the default action. Calling preventDefault from it has no effect and may produce a browser warning. Do not use passive when your handler must cancel scrolling or another default behavior.

## 6. Removing listeners correctly

~~~js
function handleClick(event) {
  console.log(event.type);
}

button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);
~~~

The callback reference and capture setting must match. This does not work:

~~~js
button.addEventListener("click", () => console.log("hi"));
button.removeEventListener("click", () => console.log("hi")); // different function object
~~~

Each arrow expression creates a different function. Keep a named function or saved reference when removal is required.

## 7. preventDefault vs stopPropagation vs stopImmediatePropagation

These methods solve different problems.

### preventDefault

Cancels a cancelable browser default action. It does not stop propagation.

~~~js
form.addEventListener("submit", event => {
  event.preventDefault(); // prevent normal navigation/reload
  saveFormData();
});
~~~

Other examples: cancel a link's navigation or a cancelable keyboard action. Use it when you intentionally replace the browser behavior.

### stopPropagation

Stops the event from continuing to other nodes along its propagation path. It does not cancel the default browser action and does not stop other listeners on the same current target.

### stopImmediatePropagation

Stops further propagation and prevents later listeners on the same current target from running.

Avoid using propagation-stopping methods as a default habit. They can make components interfere unexpectedly. Prefer clear ownership, delegation and explicit state.

## 8. Event delegation

Event delegation registers one listener on a stable ancestor and uses bubbling to handle events from descendants.

Benefits:
- Dynamic children work without attaching a listener each time.
- Fewer listener registrations.
- Centralized behavior for repeated controls.
- Useful for tables, lists, menus and grids.

~~~html
<ul id="employees">
  <li data-id="17">
    <span>Asha</span>
    <button type="button" data-action="remove">Remove</button>
  </li>
</ul>
~~~

~~~js
const list = document.querySelector("#employees");

list.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;

  const removeButton = event.target.closest('button[data-action="remove"]');
  if (!removeButton || !list.contains(removeButton)) return;

  const row = removeButton.closest("li[data-id]");
  if (!row) return;

  console.log("Remove employee:", row.dataset.id);
  row.remove();
});
~~~

Why closest()? The user may click a nested icon or span inside the button. target could be that child, not the button.

Why list.contains()? It confirms that the matched button belongs to this list.

Delegation relies on the event reaching the ancestor. For non-bubbling events, use a bubbling alternative such as focusin, capture where appropriate, or a direct listener.

## 9. Mouse, pointer, keyboard, input and form events

### Mouse and pointer

- click: activation by mouse, keyboard or another click-like input.
- dblclick: double click.
- mousedown / mouseup: mouse button press and release.
- pointerdown / pointerup / pointermove: device-independent pointer events.
- pointerenter / pointerleave: pointer enters/leaves an element; these do not bubble like pointerover/out.

Prefer Pointer Events when supporting mouse, pen and touch with one model.

### Keyboard

~~~js
document.addEventListener("keydown", event => {
  console.log(event.key);  // interpreted key, e.g. "Escape", "Enter", "a"
  console.log(event.code); // physical position, e.g. "KeyA"
  console.log(event.repeat); // true while auto-repeating
});
~~~

key is affected by keyboard layout and modifiers; code identifies the physical key position. Prefer native button, anchor and input elements instead of recreating keyboard behavior on generic divs.

### Input and change

~~~js
input.addEventListener("input", event => {
  console.log(event.target.value); // updates as user edits
});

select.addEventListener("change", event => {
  console.log(event.target.value); // committed selection change
});
~~~

For text fields, input generally fires as the value is edited; change generally fires when the edit is committed, often on blur. Exact timing depends on control type. Setting element.value in code does not automatically dispatch an input event.

### Form submit

~~~js
form.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(form);
  console.log(formData.get("email"));
});
~~~

Listen to the form submit event rather than only the submit button click. This also handles keyboard submission.

## 10. Practical project: employee directory

The companion browser example includes:

- Add employee using form submit.
- Filter names using input.
- Remove rows using one delegated click listener.
- Handle Escape to clear the filter.
- Demonstrate target/currentTarget and propagation.
- Use textContent for names rather than unsafe HTML injection.
- Use native controls and a live status region.

Open examples/day-13/event-delegation.html in a browser. The JavaScript is in event-delegation.js.

## 11. Angular and React connection

Angular template events:

~~~html
<button (click)="save()">Save</button>
<input (input)="onSearch($event)">
<form (ngSubmit)="submit()"></form>
~~~

Angular wires browser events to component methods. Use framework templates and lifecycle patterns rather than manually registering listeners for ordinary template interactions.

React:

~~~jsx
function SaveButton() {
  function handleClick(event) {
    console.log(event.currentTarget);
  }

  return <button onClick={handleClick}>Save</button>;
}
~~~

React manages its event handling and component lifecycle. Use React state and handlers for normal UI behavior.

## 12. Common mistakes

1. Assuming target is the element with the listener; that is currentTarget.
2. Assuming every event bubbles.
3. Using preventDefault when you meant to stop propagation.
4. Using stopPropagation to cancel link navigation or form submission.
5. Passing a new anonymous function to removeEventListener.
6. Forgetting event.target might not be an Element.
7. Delegating a non-bubbling event without an alternative.
8. Calling target.matches or target.closest without checking its type.
9. Forgetting a nested child can be the click target; use closest.
10. Making generic divs clickable without keyboard support or semantic controls.
11. Calling preventDefault from a passive listener.
12. Listening for a submit button click instead of the form submit event.
13. Forgetting listener cleanup in long-lived components.
14. Using propagation-stopping methods to hide unclear component ownership.

## 13. Interview questions and answers

### Fundamentals

**Q1. What is a DOM event?**  
An object-based notification that something happened in the document or browser, such as a click, input, key press or submit.

**Q2. What is the Event object?**  
The object passed to a listener that provides event type, target, phase, default-cancellation state and event-specific information.

**Q3. target vs currentTarget?**  
target is the original target; currentTarget is the object whose listener is currently executing.

**Q4. What are the three event phases?**  
Capturing, target and bubbling.

**Q5. Does every event bubble?**  
No. focus and blur do not bubble in the usual way; focusin and focusout do.

### Propagation and cancellation

**Q6. What is event bubbling?**  
After target processing, a bubbling event travels from the target through ancestors toward the document.

**Q7. What is event capturing?**  
The event travels from outer ancestors toward the target before target processing.

**Q8. preventDefault vs stopPropagation?**  
preventDefault cancels a cancelable default browser action; stopPropagation stops travel along the propagation path.

**Q9. stopPropagation vs stopImmediatePropagation?**  
The latter also prevents remaining listeners on the same current target from running.

**Q10. Can preventDefault stop bubbling?**  
No. Default cancellation and propagation are independent.

### Practical and advanced

**Q11. What is event delegation?**  
A stable ancestor handles matching descendant events by inspecting the event target.

**Q12. Why use closest in delegation?**  
A click may originate on a nested icon or span; closest finds the intended ancestor control.

**Q13. Why might removeEventListener fail?**  
The callback reference or capture setting differs. Two anonymous functions are different objects.

**Q14. What does once do?**  
Automatically removes a listener after its first invocation.

**Q15. What does passive do?**  
Promises the listener will not cancel the default action, enabling optimizations for applicable input events.

**Q16. Why use AbortController with listeners?**  
Listeners registered with its signal can all be removed by aborting the controller.

**Q17. input vs change?**  
For text inputs, input fires as the value is edited; change generally fires when the edit is committed.

**Q18. key vs code?**  
key is the interpreted key value; code identifies the physical key position.

**Q19. Why listen to form submit instead of button click?**  
It handles keyboard submission and other valid form submission paths.

**Q20. What is a limitation of delegation?**  
The event must reach the ancestor. Non-bubbling events need a bubbling variant, capture, or direct listener.

### Product-company style follow-ups

- Design a dynamic table with row actions without one listener per row.
- How do you handle a nested icon click in a delegated button?
- How do you clean up listeners when a route/component is destroyed?
- How do you make a custom dropdown keyboard accessible?
- When should you avoid stopPropagation?
- How would you debug an event that fires twice?
- Why can a passive touch listener not cancel scrolling?
- How would you handle a form submitted by pressing Enter?

### Service-company style fundamentals

- Define event bubbling and capturing with an example.
- Explain target and currentTarget.
- Difference between preventDefault and stopPropagation.
- Explain addEventListener and removeEventListener.
- What is event delegation and why is it useful?
- Difference between input, change and submit events.

## 14. Hands-on coding tasks

### Beginner

1. Add a click listener and log type, target, currentTarget, bubbles, cancelable and eventPhase.
2. Create three nested elements and log capture/bubble order.
3. Click a nested span inside a button and explain target/currentTarget.
4. Create a link and cancel navigation using preventDefault.
5. Create a form and handle submit without reload.
6. Compare input and change on text and select controls.

### Intermediate

7. Demonstrate stopPropagation and stopImmediatePropagation with multiple listeners.
8. Add a listener with once and click repeatedly.
9. Add and remove a listener using the same named function.
10. Show why two anonymous arrow functions cannot remove each other.
11. Use one AbortController signal for two listeners, then abort.
12. Add 20 rows and remove any row using one delegated listener.
13. Click a nested icon inside a remove button and use closest.
14. Filter a list using input and clear with Escape.

### Advanced

15. Build an employee directory with add, filter, remove, empty state and status announcement.
16. Make it keyboard accessible using native buttons and form controls.
17. Demonstrate a non-bubbling event and solve it with an appropriate alternative.
18. Explain why preventDefault has no effect in a passive listener.
19. Build a reusable delegated action handler that validates container.contains.
20. Explain listener cleanup in a single-page application.
21. Compare native listeners with Angular template events and React handlers.

## 15. Revision sheet

| Concept | Remember |
|---|---|
| Event | Browser notification |
| Event object | Details about the event |
| target | Original event target |
| currentTarget | Element whose listener is executing |
| Capturing | Ancestors toward target |
| Target | Event reaches target |
| Bubbling | Target toward ancestors |
| preventDefault | Cancel default action when cancelable |
| stopPropagation | Stop further propagation |
| stopImmediatePropagation | Also stop later listeners on current target |
| Delegation | One ancestor listener handles descendants |
| closest | Find nearest matching element, including self |
| once | Auto-remove after one call |
| passive | Listener promises not to cancel default action |
| signal | AbortController-based listener cleanup |
| input | Fires as text value is edited |
| change | Fires when a value is committed |
| submit | Form submission event |
| key | Interpreted key value |
| code | Physical key position |

### 10-minute recall

- Draw the three event phases.
- Explain target vs currentTarget using a nested button and span.
- Explain preventDefault vs stopPropagation.
- Write a delegated remove-button handler.
- Explain why removeEventListener needs the same function reference.

## 16. Repository files

- lessons/day-13-dom-events-event-delegation.md
- examples/day-13/event-delegation.html
- examples/day-13/event-delegation.js
- practice/day-13/tasks.md
- interview/day-13-questions.md

**Next lesson:** Day 14 — Browser Storage & Cookies: localStorage, sessionStorage, cookies, IndexedDB basics, storage events, security, expiration and practical frontend persistence.
