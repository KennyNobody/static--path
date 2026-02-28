import {Slider} from "../ui/slider";

class App {
    constructor() {
        this.init();
    }

    init = () => {
        console.log('App Inited');
        this.initSliders();
    }

    initSliders = () => {
        const els = document.querySelectorAll('[data-slider]');

        els.forEach((item: HTMLElement) => new Slider(item));
    }
}

export {App};

