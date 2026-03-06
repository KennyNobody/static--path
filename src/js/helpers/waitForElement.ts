type WaitForElementRoot = Document | Element | ShadowRoot;

interface WaitForElementOptions {
    timeout?: number;
    root?: WaitForElementRoot;
}

const getObserverTarget = (root: WaitForElementRoot): Node | null => {
    if (root instanceof Document) {
        return root.body ?? root.documentElement;
    }

    return root;
};

const waitForElement = <T extends Element = HTMLElement>(selector: string, options: WaitForElementOptions = {}): Promise<T | null> => {
    const { timeout = 5000, root = document } = options;

    return new Promise((resolve) => {
        const element = root.querySelector<T>(selector);

        if (element) {
            resolve(element);

            return;
        }

        const observerTarget = getObserverTarget(root);

        if (!observerTarget) {
            resolve(null);

            return;
        }

        const observer = new MutationObserver(() => {
            const foundElement = root.querySelector<T>(selector);

            if (!foundElement) {
                return;
            }

            clearTimeout(timeoutId);
            observer.disconnect();
            resolve(foundElement);
        });

        const timeoutId = window.setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);

        observer.observe(observerTarget, {
            childList: true,
            subtree: true,
        });
    });
};

export {
    waitForElement,
};
