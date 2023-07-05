export default class MutationInitialiser {
  #selector;
  #callback;
  #options;
  #enabled;
  #observer;

  constructor(selector, callback, options = {}) {
    this.#selector = selector;
    this.#callback = callback;
    this.#options = Object.assign({}, options);
    this.#options.subtree ??= false;
    this.#options.watch ??= false;
    this.#options.many ??= false;
    this.#options.scope ??= 0;
    this.#observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode instanceof HTMLElement) {
              if (addedNode.matches(this.#selector)) {
                this.#call(addedNode);

                if (!this.#enabled) return;
              }
            }
          }
        }
      }
    });
  }
  #call(element) {
    if (!this.#enabled) {
      return;
    }

    this.#callback(element);

    if (!this.#options.many) {
      // Disconnect after first call if many is not specified.
      this.disconnect();
    }
  }
  #firstPass(target) {
    // First pass. Find matches already on the page.
    if (this.#options.subtree) {
      const matches = target.querySelectorAll(this.#selector);
      for (const match of matches) {
        this.#call(match);
        if (!this.#enabled) return;
      }
    } else {
      for (const child of target.children) {
        if (child.matches(this.#selector)) {
          this.#call(child);
          if (!this.#enabled) return;
        }
      }
    }
  }
  observe(target) {
    this.#enabled = true;

    this.#firstPass(target);

    if (!this.#enabled) return;

    if (!this.#options.watch) {
      // If not watching, disconnect after DOM is loaded.
      window.addEventListener('DOMContentLoaded', () => {
        this.disconnect();
      });

      if (document.readyState != 'loading') {
        // Document is already finished loading. Do not observe when not watching.
        return;
      }
    }

    this.#observer.observe(target, this.#options);
  }
  disconnect() {
    this.#enabled = false;
    this.#observer.disconnect();
  }
  takeRecords() {
    return this.#observer.takeRecords();
  }
}

export class CompoundMutationInitialiser extends MutationInitialiser {
  constructor(parentSelector, selector, callback, parentOptions, options) {
    super(parentSelector, (parent) => {
      const initialiser = new MutationInitialiser(selector, callback, options);
      initialiser.observe(parent);
    }, parentOptions);
  }
}

export function defaultInitialiser(defaultTarget, defaultOptions) {
  return (selector, callback, options = {}, target = defaultTarget) => {
    const initialiser = new MutationInitialiser(selector,
      callback, Object.assign(defaultOptions, options));

    initialiser.observe(target);

    return initialiser;
  }
}
