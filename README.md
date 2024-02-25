# Mutation Initialiser

## Synopsis

`MutationInitialiser` provides a wrapper around
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver)
to initialise
[elements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) with a
[callback
function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
per a given
[selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)
as they are inserted into the Document Object Model
([DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)).
Common use case is to attach events listeners, add CSS classes, or set other
HTML element attributes once an element has been loaded into the DOM.

```javascript
import { defaultInitialiser } from 'mutation-initialiser';
const initialise = defaultInitialiser(document, {
  childList: true,
  subtree: true,
  many: true,
  attributes: true,
  watch: true,
});

initialise('div.example', element => {
  // Do something to this element once.
});
```

### Installation

```console
npm i element-loaded-by-id
```

## Example

API documentation is missing whilst this is under development.
Feel free to browse the [examples](https://bezborodow.github.io/mutation-initialiser/examples/).

## See Also

Alternatives are:

  * To simply receive a promise for when an element is loaded into the document,
    consider [`elementLoaded()`](https://www.npmjs.com/package/element-loaded).
  * To simply handle an event for an element that does not exist yet, consider using
    [event delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events).
  * For more complicated cases, use `MutationObserver` directly.
  * For building [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements),
    consider [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).
