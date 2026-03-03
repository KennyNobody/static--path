import {Slider} from "../ui/slider";
import {Filter} from "../ui/filter";
import {Map} from "../ui/map";
import {LeafletApp} from "../ui/leaflet";

class App {
    constructor() {
        this.init();
    }

    init = () => {
        console.log('App Inited');
        this.initSliders();
        this.initFilters();
        this.initLeafletApp();
        // this.initMap();
    }

    initSliders = () => {
        const els = document.querySelectorAll('[data-slider]');

        els.forEach((item: HTMLElement) => new Slider(item));
    }

    initFilters = () => {
        const el = document.querySelector('[data-filter="block"]');

        if (el) new Filter(el);
    }

    initLeafletApp = () => {
        const el = document.querySelector('[data-leaflet="block"]');

        if (el) new LeafletApp(el);
    }

    // initMap = () => {
    //     const el: HTMLElement = document.querySelector('[data-map="block"]');
    //
    //     if (el) new Map(el);
    // }
}

export {App};

