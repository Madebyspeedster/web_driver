import _ from 'underscore';

enum WINDOW_CHANGES {
  dom = 'DOMChanged',
  urlHash = 'hashchange',
  urlChange = 'beforeunload',
}

enum DOCUMENT_CHANGES {
  state = 'readystatechange',
}

export class PageObserver {
  constructor(callback, options?: MutationObserverInit) {
    this.callbackFn = callback;
    this.observerOptions = _.extend(this.observerOptions, options);

    this.init();
  }

  private observerOptions: object = {
    childList: true,
    attributes: true,
    subtree: true,
  };

  private target: HTMLElement | undefined;

  private events: Event[] = [];

  private callbackFn = function(event: CustomEvent | Event) {
    confirm('OK?');
  };

  private init(): void {
    browser.execute(
      (WINDOW_CHANGES, observerOptions) => {
        const target = document.querySelector('html');
        var observer = new MutationObserver(mutationList =>
          window.dispatchEvent(
            new CustomEvent(WINDOW_CHANGES.dom, { detail: mutationList })
          )
        );
        observer.observe(target, observerOptions);
      },
      WINDOW_CHANGES,
      this.observerOptions
    );
  }

  public async start(): Promise<any> {
    return browser.executeAsync(
      (WINDOW_CHANGES, DOCUMENT_CHANGES, done) => {
        alert(done);
        Object.values(WINDOW_CHANGES).map(event =>
          window.addEventListener(event as WINDOW_CHANGES, done)
        );
        Object.values(DOCUMENT_CHANGES).map(event =>
          window.document.addEventListener(event as DOCUMENT_CHANGES, done)
        );
      },
      WINDOW_CHANGES,
      DOCUMENT_CHANGES
    );
  }

  public stop() {
    browser.executeAsync(
      (WINDOW_CHANGES, DOCUMENT_CHANGES, done) => {
        Object.values(WINDOW_CHANGES).map(event =>
          window.removeEventListener(event as WINDOW_CHANGES, done)
        );
        Object.values(DOCUMENT_CHANGES).map(event =>
          window.document.removeEventListener(event as DOCUMENT_CHANGES, done)
        );
      },
      WINDOW_CHANGES,
      DOCUMENT_CHANGES
    );
  }
}
