class MutationInitaliser {
  constructor(selector, callback, options = {}) {
    this.selector = selector;
    this.callback = callback;
    options.subtree ??= true;
    if (!options.childList || !options.attributes || !options.characterData) {
      options.childList = true;
    }
    this.options = options;
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode instanceof HTMLElement) {
              if (addedNode.matches(this.selector)) {
                this.callback(addedNode);
              }
            }
          }
        }
      }
    });
  }
  observe(target = document) {
    const matches = target.querySelectorAll(this.selector);
    for (const match of matches) {
      this.callback(match);
    }
    if (!this.options.loader || document.readyState == 'loading') {
      this.observer.observe(target, this.options);
      if (this.options.loader) {
        window.addEventListener('DOMContentLoaded', () => {
          this.disconnect();
        });
      }
    }
  }
  disconnect() {
    this.observer.disconnect();
  }
  takeRecords() {
    return this.observer.takeRecords();
  }
}
