import 'swiper/css';
import Swiper from "swiper";
import { Navigation, Pagination } from 'swiper/modules';

class Slider {
    sliderInstance: Swiper | null = null;

    constructor(el: HTMLElement) {
        const mode = el.getAttribute('data-slider');

        if (mode === 'partners') this.initPartnersSlider(el);
        if (mode === 'news') this.initNewsSlider(el);
        if (mode === 'intro') this.initIntroSlider(el);
        if (mode === 'locations') this.initLocationsSlider(el);
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
            enabled: false,
            modules: [Navigation],
            // allowTouchMove: false,
            navigation: {
                prevEl: '[data-slider-control="left"]',
                nextEl: '[data-slider-control="right"]',
                disabledClass: 'disabled',
            },
            breakpoints: {
                1299: {
                    enabled: true,
                    slidesPerView: 3,
                }
            },
            on: {
                breakpoint: (el: Swiper) => {
                    if (!el.params.enabled) {
                        removeInlineStyles(el);
                    }
                }
            }
        });
    }

    initIntroSlider = (el: HTMLElement) => {
        this.sliderInstance = new Swiper(el, {
            // loop: true,
            spaceBetween: 24,
            slidesPerView: 1,
            // enabled: true,
            modules: [Pagination, Navigation],
            // allowTouchMove: false,
            // breakpoints: {
            //     1299: {
            //         slidesPerView: 3,
            //     }
            // },
            navigation: {
                prevEl: '[data-slider-control="left"]',
                nextEl: '[data-slider-control="right"]',
                disabledClass: 'disabled-invert',
            },
            pagination: {
                clickable: true,
                el: '.slider-intro__pagination',
                bulletClass: 'bullet-line',
                bulletActiveClass: 'bullet-line--active'

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

    initLocationsSlider = (el: HTMLElement) => {
        this.sliderInstance = new Swiper(el, {
            spaceBetween: 24,
            slidesPerView: 'auto',
            modules: [Navigation, Pagination],
            navigation: {
                prevEl: '[data-slider-control="left"]',
                nextEl: '[data-slider-control="right"]',
                disabledClass: 'disabled',
            },
            pagination: {
                clickable: true,
                el: '.slider-locations__pagination',
                bulletClass: 'bullet',
                bulletActiveClass: 'active'

            },

            // on: {
            //     init(swiper: Swiper) {
            //         updateSlideClasses(swiper);
            //     },
            //     slideChange(swiper: Swiper) {
            //         updateSlideClasses(swiper);
            //     },
            // },
        });
    }
}

const removeInlineStyles = (el: Swiper) => {
    el.wrapperEl.removeAttribute('style');

    el.slides.forEach((item: Element) => {
        item.removeAttribute('style');
    })
};

export {
    Slider,
}
