import 'swiper/css';
import Swiper from "swiper";

class Slider {
    sliderInstance: Swiper | null = null;

    constructor(el: HTMLElement) {
        const mode = el.getAttribute('data-slider');

        if (mode === 'partners') this.initPartnersSlider(el);
        if (mode === 'news') this.initNewsSlider(el);
    }

    initPartnersSlider = (el: HTMLElement) => {
        this.sliderInstance = new Swiper(el, {
            // loop: true,
            spaceBetween: 24,
            slidesPerView: 'auto',
            // enabled: true,
            // modules: [Pagination],
            // allowTouchMove: false,
            breakpoints: {
                1299: {
                    slidesPerView: 4,
                }
            },
            // on: {
            //     breakpoint: (el: Swiper) => {
            //         if (!el.params.enabled) {
            //             removeInlineStyles(el);
            //         }
            //     }
            // }
        });
    }

    initNewsSlider = (el: HTMLElement) => {
        this.sliderInstance = new Swiper(el, {
            // loop: true,
            spaceBetween: 24,
            slidesPerView: 'auto',
            // enabled: true,
            // modules: [Pagination],
            // allowTouchMove: false,
            breakpoints: {
                1299: {
                    slidesPerView: 3,
                }
            },
            // on: {
            //     breakpoint: (el: Swiper) => {
            //         if (!el.params.enabled) {
            //             removeInlineStyles(el);
            //         }
            //     }
            // }
        });
    }
}

export {
    Slider,
}
