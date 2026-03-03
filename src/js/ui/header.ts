class Header {
    private el: HTMLElement;
    private button: HTMLElement;
    private menuMode: boolean;

    constructor(el: HTMLElement) {
        this.el = el;
        this.menuMode = false;
        this.init();
    }

    init = () => {
        this.button = this.el.querySelector('[data-menu="button"]');
        this.update();
        window.addEventListener('scroll', this.update);

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.toggleMenu();
            })
        }
    }

    update = () => {
        this.el.classList.toggle('active', window.scrollY > 0);
    }

    toggleMenu = () => {
        if (this.menuMode) {
            this.button.classList.remove('active');
            this.el.classList.remove('menu');
            this.menuMode = false;
        } else {
            this.button.classList.add('active');
            this.el.classList.add('menu');
            this.menuMode = true;
        }

    }
}

export { Header };
