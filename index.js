class MutationInitaliser {
  constructor(selector, callback, options = {}) {
    this.selector = selector;
    this.callback = callback;
    this.options = Object.assign({}, options);
    this.options.subtree ??= false;
    this.options.watch ??= false;
    this.options.many ??= false;
    this.options.scope ??= 0;
    if (!options.childList || !options.attributes || !options.characterData) {
      this.options.childList = true;
    }
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode instanceof HTMLElement) {
              if (addedNode.matches(this.selector)) {
                this.call(addedNode);

                if (!this.enabled) return;
              }
            }
          }
        }
      }
    });
  }
  call(element) {
    if (!this.enabled) {
      return;
    }

    this.callback(element);

    if (!this.options.many) {
      // Disconnect after first call if many is not specified.
      this.disconnect();
    }
  }
  observe(target) {
    this.enabled = true;

    const matches = target.querySelectorAll(this.selector);
    for (const match of matches) {
      this.call(match);
    }

    if (!this.enabled) {
      return;
    }

    if (!this.options.watch && document.readyState != 'loading') {
      // Document is already finished loading. Do not observe when not watching.
      this.enabled = false;
      return;
    }

    this.observer.observe(target, this.options);

    if (!this.options.watch) {
      // If not watching, disconnect after DOM is loaded.
      window.addEventListener('DOMContentLoaded', () => {
        this.disconnect();
      });
    }
  }
  disconnect() {
    this.enabled = false;
    this.observer.disconnect();
  }
  takeRecords() {
    return this.observer.takeRecords();
  }
}
