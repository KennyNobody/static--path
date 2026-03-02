import {Slider} from "../ui/slider";
import {Filter} from "../ui/filter";
import {Map} from "../ui/map";

class App {
    constructor() {
        this.init();
    }

    init = () => {
        console.log('App Inited');
        this.initSliders();
        this.initFilters();
        this.initMap();
    }

    initSliders = () => {
        const els = document.querySelectorAll('[data-slider]');

        els.forEach((item: HTMLElement) => new Slider(item));
    }

    initFilters = () => {
        const el = document.querySelector('[data-filter="block"]');

        if (el) new Filter(el);
    }

    initMap = () => {
        const el: HTMLElement = document.querySelector('[data-map="block"]');

        if (el) new Map(el);
    }
}

export {App};

