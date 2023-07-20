export default class MutationInitialiser {
  #selector;
  #callback;
  #options;
  #enabled;
  #observer;
  #seen;

  constructor(selector, callback, options = {}) {
    this.#selector = selector;
    this.#callback = callback;
    this.#options = Object.assign({}, options);
    this.#options.subtree ??= false;
    this.#options.watch ??= false;
    this.#options.many ??= false;
    this.#options.scope ??= 0;
    this.#observer = new MutationObserver(this.#mutation.bind(this));
    this.#seen = [];
  }
  #mutation(mutations) {
    for (const mutation of mutations)
      if (mutation.type === 'childList')
        for (const addedNode of mutation.addedNodes)
          if (addedNode instanceof HTMLElement) {
            this.#find(addedNode);
            if (!this.#enabled) return;
          }
  }
  #find(element) {
    if (element.closest) {
      const match = element.closest(this.#selector);
      if (match) {
        this.#call(match);
      }
    }

    if (!this.#enabled) return;

    if (this.#options.many) {
      const matches = element.querySelectorAll(this.#selector);
      for (const match of matches) {
        this.#call(match);
      }
    } else {
      const match = element.querySelector(this.#selector);
      if (match) {
        this.#call(match);
      }
    }
  }
  #call(element) {
    if (!this.#enabled) {
      return;
    }

    // Call only once.
    if (this.#seen.indexOf(element) != -1) {
      return;
    }
    this.#seen.push(element);

    this.#callback(element);

    if (!this.#options.many) {
      // Disconnect after first call if many is not specified.
      this.disconnect();
    }
  }
  observe(target) {
    this.#enabled = true;

    // If not watching, disconnect after DOM is loaded.
    if (!this.#options.watch) {
      window.addEventListener('DOMContentLoaded', () => {
        this.disconnect();
      });
    }

    // Observe while loading or if always watching.
    if (document.readyState == 'loading' || this.#options.watch) {
      this.#observer.observe(target, this.#options);
    }

    // First Pass.
    this.#find(target);
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
