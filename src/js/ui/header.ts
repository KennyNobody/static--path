class Header {
    private el: HTMLElement;
    private button: HTMLElement;

    constructor(el: HTMLElement) {
        this.el = el;
        this.init();
    }

    init = () => {
        this.button = this.el.querySelector('[data-menu="button"]');
        this.update();
        window.addEventListener('scroll', this.update);

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.el.classList.toggle('menu');
            })
        }
    }

    update = () => {
        this.el.classList.toggle('active', window.scrollY > 0);
    }

    toggleMenu = () => {

    }
}

export { Header };
