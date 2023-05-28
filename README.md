# `MutationInitialiser`

This provides a wrapper around
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver)
to initialise elements on a page as they are inserted into the document.

Alternatives are:

  * To simply receive a promise for when an element is loaded into the document,
    consider [`elementLoaded()`](https://www.npmjs.com/package/element-loaded).
  * To simply handle an event for an element that does not exist yet, consider using
    [event delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events).
  * For more complicated cases, use `MutationObserver` directly.
  * For building [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements),
    consider [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

API documentation is missing whilst this is under development. Feel free to browse the examples.
