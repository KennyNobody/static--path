class Filter {
    group1: HTMLElement;
    group2: HTMLElement;
    control1: HTMLElement;
    control2: HTMLElement;
    button1: HTMLElement;
    button2: HTMLElement;

    constructor(el: Element) {
        this.group1 = el.querySelector('[data-filter="group-1"]');
        this.group2 = el.querySelector('[data-filter="group-2"]');
        this.control1 = el.querySelector('[data-filter="control-1"]');
        this.control2 = el.querySelector('[data-filter="control-2"]');
        this.button1 = el.querySelector('[data-filter="button-1"]');
        this.button2 = el.querySelector('[data-filter="button-2"]');

        this.init();
    }

    init = () => {
        this.button1.addEventListener('click', () => {
           this.group1.removeAttribute('hidden');
           this.control1.removeAttribute('hidden');

            this.group2.setAttribute('hidden', 'hidden');
            this.control2.setAttribute('hidden', 'hidden');
        });

        this.button2.addEventListener('click', () => {
            this.group2.removeAttribute('hidden');
            this.control2.removeAttribute('hidden');

            this.group1.setAttribute('hidden', 'hidden');
            this.control1.setAttribute('hidden', 'hidden');
        });
    }
}

export {
    Filter,
}
