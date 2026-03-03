class Input {
    private el: Element;
    private inputField: HTMLInputElement | null;
    private button: HTMLButtonElement | null;
    private isVisible: boolean = false;

    constructor(el: Element) {
        this.el = el;
        this.inputField = this.el.querySelector('[data-input="field"]') as HTMLInputElement | null;
        this.button = this.el.querySelector('[data-input="button"]') as HTMLButtonElement | null;

        this.init();
    }

    private init(): void {
        if (!this.button || !this.inputField) return;

        this.button.addEventListener('click', this.toggle.bind(this));
    }

    private toggle(): void {
        this.isVisible = !this.isVisible;

        console.log('ОПОП');

        if (this.inputField) {
            this.inputField.type = this.isVisible ? 'text' : 'password';
        }

        if (this.button) {
            this.button.classList.toggle('active', this.isVisible);
        }
    }
}

export {
    Input,
}
