import {Slider} from "../ui/slider";
import {Filter} from "../ui/filter";

class App {
    constructor() {
        this.init();
    }

    init = () => {
        console.log('App Inited');
        this.initSliders();
        this.initFilters();
    }

    initSliders = () => {
        const els = document.querySelectorAll('[data-slider]');

        els.forEach((item: HTMLElement) => new Slider(item));
    }

    initFilters = () => {
        const el = document.querySelector('[data-filter="block"]');

        if (el) new Filter(el);
    }
}

export {App};

