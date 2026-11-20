# Day 13 — DOM Events Interview Questions & Answers

These are representative frontend interview questions used to assess browser fundamentals; they are not attributed to any specific company's interview.

## Fundamentals

**1. What is a DOM event?**  
An object-based notification that something happened in the document or browser, such as a click, input, key press or form submission.

**2. What is the Event object?**  
The object passed to a listener. It exposes event type, target, phase, default-cancellation state and event-specific details.

**3. target vs currentTarget?**  
target is the original event target. currentTarget is the object whose listener is currently executing.

**4. What are the three event phases?**  
Capturing, target and bubbling.

**5. Does every event bubble?**  
No. focus and blur do not bubble in the usual way; focusin and focusout do.

## Propagation and cancellation

**6. What is event bubbling?**  
A bubbling event travels from the target outward through ancestor nodes after target processing.

**7. What is event capturing?**  
The event travels from outer ancestors inward toward the target before target processing.

**8. preventDefault vs stopPropagation?**  
preventDefault cancels a cancelable default browser action. stopPropagation prevents further travel along the propagation path.

**9. stopPropagation vs stopImmediatePropagation?**  
stopImmediatePropagation also prevents later listeners on the same current target from executing.

**10. Can preventDefault stop bubbling?**  
No. Default cancellation and propagation are separate mechanisms.

## Practical and advanced

**11. What is event delegation?**  
Registering one listener on a stable ancestor and identifying the relevant descendant from the event target.

**12. Why use closest() in event delegation?**  
The user may click a nested icon or span inside a button. closest() finds the intended ancestor control.

**13. Why might removeEventListener fail?**  
The callback reference or capture setting differs from registration. New anonymous functions are different function objects.

**14. What does once do?**  
It automatically removes a listener after its first invocation.

**15. What does passive do?**  
It tells the browser the listener will not cancel the default action, enabling optimizations for applicable input events.

**16. Why use AbortController with listeners?**  
Listeners registered with its signal can all be removed by aborting the controller.

**17. input vs change?**  
For text controls, input fires as the value is edited; change generally fires when the edit is committed. Exact behavior depends on the control.

**18. key vs code?**  
key is the interpreted key value; code identifies the physical key position.

**19. Why listen to form submit instead of only button click?**  
It also handles keyboard submission and other valid form submission paths.

**20. What is a limitation of event delegation?**  
The event must reach the ancestor. For non-bubbling events, use a bubbling alternative, capture where appropriate, or a direct listener.

## Product-company style follow-ups

- Design a dynamic table with row actions without registering one listener per row.
- How would you prevent a nested icon click from breaking delegated behavior?
- How do you clean up listeners when a route/component is destroyed?
- How would you make a custom dropdown keyboard accessible?
- When should you avoid stopPropagation()?
- How would you debug an event that fires twice?
- Why can a passive touch listener not cancel scrolling?
- How would you handle a form submitted by pressing Enter?

## Service-company style fundamentals

- Define event bubbling and capturing with an example.
- Explain target and currentTarget.
- Difference between preventDefault and stopPropagation.
- Explain addEventListener and removeEventListener.
- What is event delegation and why is it useful?
- Difference between input, change and submit events.
