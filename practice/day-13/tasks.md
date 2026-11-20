# Day 13 — DOM Events Practice

Complete in order. Run the companion example, then modify it.

## Beginner

- [ ] Add a click listener and log type, target, currentTarget, bubbles, cancelable and eventPhase.
- [ ] Create three nested elements. Register capture and bubble listeners and write down the exact order.
- [ ] Click a nested span inside a button. Explain why target and currentTarget differ.
- [ ] Create a link and cancel navigation using preventDefault().
- [ ] Create a form and handle submit without a page reload.
- [ ] Compare input and change events on a text field and a select element.

## Intermediate

- [ ] Register two listeners on one element. Compare stopPropagation() with stopImmediatePropagation().
- [ ] Register a listener with { once: true } and click repeatedly.
- [ ] Add and remove a listener using the same named function reference.
- [ ] Demonstrate why two separate arrow functions cannot remove each other.
- [ ] Register two listeners with one AbortController signal and remove them by aborting.
- [ ] Add 20 rows dynamically and remove any row using one delegated listener.
- [ ] Click a nested icon inside a remove button and use closest().
- [ ] Filter the list using input and clear the filter with Escape.

## Advanced

- [ ] Build an employee directory with add, filter, remove, empty state and status announcement.
- [ ] Make all controls keyboard accessible. Prefer native buttons and form controls.
- [ ] Demonstrate a non-bubbling event and choose a correct alternative (capture, bubbling variant, or direct listener).
- [ ] Show why preventDefault() has no effect in a passive listener.
- [ ] Create a reusable delegated action handler that checks container.contains(matchedControl).
- [ ] Explain event listener cleanup in a long-lived SPA component.
- [ ] Compare native DOM listeners with Angular template bindings and React handlers.

## Output challenge

Predict this order before running the example:

~~~js
outer.addEventListener("click", () => console.log("outer capture"), true);
middle.addEventListener("click", () => console.log("middle capture"), true);
inner.addEventListener("click", () => console.log("target"));
middle.addEventListener("click", () => console.log("middle bubble"));
outer.addEventListener("click", () => console.log("outer bubble"));
~~~

Click inner. Explain capture, target and bubble phases in your own words.
