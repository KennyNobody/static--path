import 'swiper/css';
import Swiper from "swiper";
import {Navigation, Pagination, EffectFade, Autoplay} from 'swiper/modules';
import {SwiperSlide} from "swiper/element";
import 'swiper/css/effect-fade';

class SliderSimilar {
    sliderInstance: Swiper | null = null;
    childInstance: Swiper | null = null;

    constructor(el: HTMLElement) {
        const mainEl = el.querySelector<HTMLElement>('[data-similar-slider="main"]');
        const introEl = el.querySelector<HTMLElement>('[data-similar-slider="intro"]');

        // Порядок важен: main первым, чтобы childInstance был готов к моменту init intro
        if (mainEl) this.initMainSlider(mainEl);
        if (introEl) this.initIntroSlider(introEl);
    }

    initMainSlider = (el: HTMLElement) => {
        this.childInstance = new Swiper(el, {
            slidesPerView: 1,
            allowTouchMove: false,
            modules: [EffectFade],
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
    }

    initIntroSlider = (el: HTMLElement) => {
        const updatePassedSlides = (swiper: Swiper) => {
            swiper.slides.forEach((slide: SwiperSlide, index: number) => {
                slide.classList.toggle('prev', index < swiper.activeIndex);
            });

            if (this.childInstance && this.childInstance.activeIndex !== swiper.activeIndex) {
                this.childInstance.slideTo(swiper.activeIndex);
            }
        };

        this.sliderInstance = new Swiper(el, {
            spaceBetween: 24,
            slidesPerView: 1,
            modules: [Pagination, Autoplay],
            autoplay: {
                delay: 3000,
            },
            navigation: {
                prevEl: '[data-slider-control="left"]',
                nextEl: '[data-slider-control="right"]',
                disabledClass: 'disabled-invert',
            },
            pagination: {
                clickable: true,
                el: '.slider-intro__pagination',
                bulletClass: 'bullet-line',
                bulletActiveClass: 'bullet-line--active',
            },
            on: {
                init: updatePassedSlides,
                slideChange: updatePassedSlides,
            }
        });
    }
}

export {
    SliderSimilar,
}
