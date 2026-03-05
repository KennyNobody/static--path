import {Slider} from "../ui/slider";
import {Filter} from "../ui/filter";
import {Map} from "../ui/map";
import {LeafletApp} from "../ui/leaflet";
import {Header} from "../ui/header";
import {Input} from "../ui/input";
import {SliderSimilar} from "../ui/sliderSimilar";
import {DiamondSlider} from "../ui/diamondSlider";

class App {
    constructor() {
        this.init();
    }

    init = () => {
        console.log('App Inited');
        this.initSliders();
        this.initFilters();
        this.initLeafletApp();
        this.initHeader();
        this.initInput();
        this.initSimilarSliders();
        this.initDiamondSliders();
    }

    initSliders = () => {
        const els = document.querySelectorAll('[data-slider]');

        els.forEach((item: HTMLElement) => new Slider(item));
    }

    initSimilarSliders = () => {
        const els = document.querySelectorAll('[data-similar-slider="block"]');

        els.forEach((item: HTMLElement) => new SliderSimilar(item));
    }

    initDiamondSliders = () => {
        const els = document.querySelectorAll('[data-diamond-slider]');

        els.forEach((item: HTMLElement) => new DiamondSlider(item));
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

    initHeader = () => {
        const el: HTMLElement = document.querySelector('[data-header="block"]');

        if (el) new Header(el);
    }

    initInput = () => {
        const els: NodeListOf<Element> = document.querySelectorAll('[data-input="password"]');

        els.forEach((item) => new Input(item));
    }
}

export {App};
