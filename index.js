class MutationInitaliser {
  constructor(selector, callback, options = { subtree: true, childList: true }) {
    this.selector = selector;
    this.callback = callback;
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
    this.observer.observe(target, this.options);
  }
  disconnect() {
    this.observer.disconnect();
  }
  takeRecords() {
    return this.observer.takeRecords();
  }
}
