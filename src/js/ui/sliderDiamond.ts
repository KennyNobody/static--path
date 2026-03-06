import Swiper from 'swiper';
import { EffectCreative, Navigation, Pagination } from 'swiper/modules';

interface ContentGroup {
    root: HTMLElement;
    items: HTMLElement[];
}

class SliderDiamond {
    sliderEl: HTMLElement | null = null;
    contents: NodeListOf<HTMLElement> | null = null;
    contentGroups: ContentGroup[] = [];
    swiperInstance: Swiper | null = null;

    constructor(root: HTMLElement) {
        this.sliderEl = root.querySelector<HTMLElement>('[data-diamond-slider-swiper]');
        this.contents = root.querySelectorAll<HTMLElement>('[data-diamond-slider-content]');

        this.init();
        this.bindEvents();
    }

    init = () => {
        this.initSlider();
        this.initContent();
        this.unifyContentHeights();
        this.showContentItem(0);
    }

    bindEvents = () => {
        window.addEventListener('resize', () => {
           this.unifyContentHeights();
        });
    }

    initSlider = () => {
        if (!this.sliderEl) return;

        this.swiperInstance = new Swiper(this.sliderEl, {
            effect: 'creative',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            modules: [EffectCreative, Navigation, Pagination],
            creativeEffect: {
                prev: {
                    translate: ['-150%', '-50%', -400],
                    scale: 0.5,
                    opacity: 0,
                },
                next: {
                    translate: ['75%', '-40%', -200],
                    scale: 0.5,
                },
            },
            navigation: {
                prevEl: '[data-diamond-slider-control="left"]',
                nextEl: '[data-diamond-slider-control="right"]',
                disabledClass: 'disabled',
            },
            pagination: {
                clickable: true,
                el: '.diamond-slider__pagination',
                bulletClass: 'bullet',
                bulletActiveClass: 'active',
            },
            on: {
                slideChange: () => {
                    this.showContentItem(this.swiperInstance.activeIndex);
                }
            }
        });
    };

    initContent = () => {
        this.contentGroups = Array
          .from(this.contents)
          .map((root) => {
              const items = Array.from(root.querySelectorAll<HTMLElement>('[data-diamond-slider-content-item]'));

              return {
                  root,
                  items,
              };
          })
          .filter((group) => group.items.length > 0);
    }

    unifyContentHeights = () => {
        this.contentGroups.forEach((group) => {
            const maxItemHeight = Array
              .from(group.items)
              .reduce((height, item) => Math.max(height, item.scrollHeight), 0);

            if (maxItemHeight > 0) {
                group.root.style.minHeight = `${maxItemHeight}px`;
            }
        })
    }

    showContentItem = (activeIndex: number) => {
        this.contentGroups.forEach((group) => {
            group.items.forEach((item, index) => {
                item.classList.toggle('diamond-slider-content__item--active', activeIndex === index);
            })
        })
    }
}

export {
    SliderDiamond,
};
