import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { isMobile } from '../helpers/isMobile';

gsap.registerPlugin(Observer);

interface RectState {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface SlideState {
    x: number;
    y: number;
    scale: number;
    zIndex: number;
}

interface DiamondSliderElements {
    root: HTMLElement;
    slides: HTMLElement[];
    prevButton: HTMLButtonElement | null;
    nextButton: HTMLButtonElement | null;
    pagination: HTMLElement | null;
    decorations: HTMLElement | null;
}

const Z_INDEX_CONFIG = {
    base: 1,
    stackPastBand: 1,
    stackFutureBand: 2,
    activeBand: 3,
    transitionOverlayOffset: 1,
} as const;

const RESPONSIVE_CONFIG = {
    stackScaleMobileBoost: 0.2,
} as const;

class DiamondSlider {
    elements: DiamondSliderElements | null = null;
    index = 0;
    isAnimating = false;
    resizeRaf: number | null = null;
    duration = 0.7;
    observer: Observer | null = null;
    paginationDots: HTMLElement[] = [];

    baseSize = {
        width: 0,
        height: 0,
    };

    baseMainRect: RectState = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    };

    layout = {
        mainLeftOffset: 24,
        mainBottomOffset: 24,
        stackTopOffset: -24,
        stackRightOffset: -24,
        stackOverflowRight: 36,
        stackScaleDesktop: 0.4,
        stackScale: 0.4,
    };

    constructor(root: HTMLElement) {
        this.elements = this.collectElements(root);

        if (!this.elements) {
            return;
        }

        this.init();
    }

    collectElements = (root: HTMLElement): DiamondSliderElements | null => {
        const slides = Array.from(root.querySelectorAll<HTMLElement>('.diamond-slider__slide'));
        const navigation = root.querySelector<HTMLElement>('.diamond-slider__navigation');
        const controls = navigation ? Array.from(navigation.querySelectorAll<HTMLButtonElement>('.button-control')) : [];

        if (!slides.length) {
            return null;
        }

        return {
            root,
            slides,
            prevButton: controls[0] || null,
            nextButton: controls[1] || null,
            pagination: root.querySelector<HTMLElement>('.diamond-slider__pagination'),
            decorations: root.querySelector<HTMLElement>('.diamond-slider__decorations'),
        };
    }

    init = () => {
        this.updateResponsiveLayout();
        this.normalizeSlides();
        this.measureBaseSize();
        this.render(true);
        this.renderPagination();
        this.updateButtons();
        this.bindControls();
        this.bindPagination();
        this.bindSwipe();
        this.bindResize();
    }

    updateResponsiveLayout = () => {
        const mobileBoost = isMobile() ? RESPONSIVE_CONFIG.stackScaleMobileBoost : 0;
        this.layout.stackScale = Math.min(1, this.layout.stackScaleDesktop + mobileBoost);
    }

    normalizeSlides = () => {
        const { slides } = this.elements;

        slides.forEach((slide) => {
            gsap.set(slide, {
                x: 0,
                y: 0,
                scale: 1,
                transformOrigin: '0 0',
            });
        });
    }

    measureBaseSize = () => {
        const { root, slides } = this.elements;
        const sampleSlide = slides[0];

        if (!sampleSlide) {
            return;
        }

        gsap.set(sampleSlide, { scale: 1 });
        const sampleRect = sampleSlide.getBoundingClientRect();

        this.baseSize = {
            width: sampleRect.width,
            height: sampleRect.height,
        };

        const rootRect = root.getBoundingClientRect();

        this.baseMainRect = {
            left: sampleRect.left - rootRect.left,
            top: sampleRect.top - rootRect.top,
            width: sampleRect.width,
            height: sampleRect.height,
        };
    }

    bindControls = () => {
        const { prevButton, nextButton } = this.elements;

        if (prevButton) {
            prevButton.addEventListener('click', this.prev);
        }

        if (nextButton) {
            nextButton.addEventListener('click', this.next);
        }
    }

    bindPagination = () => {
        const { pagination } = this.elements;

        if (!pagination) {
            return;
        }

        pagination.addEventListener('click', this.handlePaginationClick);
    }

    handlePaginationClick = (event: Event) => {
        if (this.isAnimating) {
            return;
        }

        if (!(event.target instanceof Element)) {
            return;
        }

        const dot = event.target.closest('.diamond-slider__dot') as (HTMLElement | null);

        if (!dot || !dot.dataset.index) {
            return;
        }

        const nextIndex = Number(dot.dataset.index);

        if (Number.isNaN(nextIndex)) {
            return;
        }

        this.goTo(nextIndex);
    }

    bindSwipe = () => {
        const { root } = this.elements;

        this.observer = Observer.create({
            target: root,
            type: 'touch,pointer',
            tolerance: 10,
            dragMinimum: 5,
            lockAxis: true,
            allowClicks: true,
            ignore: '.button-control',
            onLeft: this.next,
            onRight: this.prev,
        });
    }

    bindResize = () => {
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        if (this.resizeRaf !== null) {
            window.cancelAnimationFrame(this.resizeRaf);
        }

        this.resizeRaf = window.requestAnimationFrame(() => {
            this.resizeRaf = null;

            this.updateResponsiveLayout();
            this.normalizeSlides();
            this.measureBaseSize();
            this.render(true);
        });
    }

    renderPagination = () => {
        const { slides, pagination } = this.elements;

        if (!pagination) {
            return;
        }

        pagination.innerHTML = '';
        this.paginationDots = [];

        slides.forEach((_, index) => {
            const dot = document.createElement('div');

            dot.className = 'diamond-slider__dot bullet';
            dot.dataset.index = String(index);
            pagination.appendChild(dot);

            this.paginationDots.push(dot);
        });

        this.updatePagination();
    }

    updatePagination = () => {
        if (!this.paginationDots.length) {
            return;
        }

        this.paginationDots.forEach((dot, index) => {
            const isActiveDot = index === this.index;

            dot.classList.toggle('active', isActiveDot);
        });
    }

    getMainRect = (): RectState => {
        const { root } = this.elements;
        const rootRect = root.getBoundingClientRect();
        const width = this.baseMainRect.width || this.baseSize.width || rootRect.width;
        const height = this.baseMainRect.height || this.baseSize.height || rootRect.height;
        const left = this.baseMainRect.left;
        const top = this.baseMainRect.top;

        return {
            left: Math.max(0, Math.min(left, rootRect.width - width)),
            top: Math.max(0, Math.min(top, rootRect.height - height)),
            width,
            height,
        };
    }

    getStackRect = (mainRect: RectState): RectState => {
        const { root } = this.elements;
        const rootRect = root.getBoundingClientRect();
        const preferredStackSize = mainRect.height * this.layout.stackScale;
        const maxStackWidth = Math.max(1, rootRect.width - this.layout.stackRightOffset);
        const maxStackHeight = Math.max(1, rootRect.height - this.layout.stackTopOffset);
        const stackSize = Math.min(preferredStackSize, maxStackWidth, maxStackHeight);
        const left = rootRect.width - this.layout.stackRightOffset - stackSize + this.layout.stackOverflowRight;
        const top = this.layout.stackTopOffset;
        const maxLeft = rootRect.width - stackSize + this.layout.stackOverflowRight;

        return {
            left: Math.max(0, Math.min(left, maxLeft)),
            top: Math.max(0, Math.min(top, rootRect.height - stackSize)),
            width: stackSize,
            height: stackSize,
        };
    }

    getActiveZIndex = (slidesCount: number): number => {
        return (slidesCount * Z_INDEX_CONFIG.activeBand) + Z_INDEX_CONFIG.base;
    }

    getStackZIndex = (slideIndex: number, activeIndex: number, slidesCount: number): number => {
        if (slideIndex > activeIndex) {
            const depth = slideIndex - activeIndex;
            const futureBase = slidesCount * Z_INDEX_CONFIG.stackFutureBand;

            return futureBase - depth + Z_INDEX_CONFIG.base;
        }

        const depth = activeIndex - slideIndex;
        const pastBase = slidesCount * Z_INDEX_CONFIG.stackPastBand;

        return Math.max(Z_INDEX_CONFIG.base, pastBase - depth + Z_INDEX_CONFIG.base);
    }

    getTransitionTopZIndex = (state: SlideState[]): number => {
        const maxZIndex = state.reduce((max, current) => {
            return current.zIndex > max ? current.zIndex : max;
        }, Z_INDEX_CONFIG.base);

        return maxZIndex + Z_INDEX_CONFIG.transitionOverlayOffset;
    }

    buildState = (activeIndex: number): SlideState[] => {
        const { slides } = this.elements;
        const slidesCount = slides.length;
        const mainRect = this.getMainRect();
        const stackRect = this.getStackRect(mainRect);
        const baseWidth = this.baseSize.width || mainRect.width || 1;

        return slides.map((_, slideIndex) => {
            if (slideIndex === activeIndex) {
                return {
                    x: mainRect.left,
                    y: mainRect.top,
                    scale: mainRect.width / baseWidth,
                    zIndex: this.getActiveZIndex(slidesCount),
                };
            }

            return {
                x: stackRect.left,
                y: stackRect.top,
                scale: stackRect.width / baseWidth,
                zIndex: this.getStackZIndex(slideIndex, activeIndex, slidesCount),
            };
        });
    }

    applyState = (state: SlideState[], immediate: boolean, onComplete?: () => void) => {
        const { slides } = this.elements;

        if (immediate) {
            state.forEach((slideState, slideIndex) => {
                const slide = slides[slideIndex];

                slide.style.zIndex = String(slideState.zIndex);

                gsap.set(slide, {
                    x: slideState.x,
                    y: slideState.y,
                    scale: slideState.scale,
                    opacity: 1,
                });
            });

            return;
        }

        const timeline = gsap.timeline({
            defaults: {
                duration: this.duration,
                ease: 'power3.inOut',
                overwrite: true,
            },
            onComplete,
        });

        state.forEach((slideState, slideIndex) => {
            const slide = slides[slideIndex];

            timeline.to(slide, {
                x: slideState.x,
                y: slideState.y,
                scale: slideState.scale,
                opacity: 1,
            }, 0);
        });
    }

    animateSwap = (fromIndex: number, toIndex: number, direction: 'forward' | 'backward', onComplete?: () => void) => {
        const { slides } = this.elements;
        const fromState = this.buildState(fromIndex);
        const toState = this.buildState(toIndex);
        const fromSlide = slides[fromIndex];
        const toSlide = slides[toIndex];
        const incomingToMain = toState[toIndex];
        const outgoingToStack = toState[fromIndex];
        const finalIncomingZ = toState[toIndex].zIndex;
        const finalOutgoingZ = toState[fromIndex].zIndex;
        const transitionTopZ = this.getTransitionTopZIndex(toState);
        const firstPhaseDuration = this.duration * 0.5;
        const secondPhaseDuration = this.duration * 0.6;
        const staggerDelay = this.duration * 0.1;

        this.applyState(fromState, true);

        toState.forEach((state, index) => {
            if (index === fromIndex || index === toIndex) {
                return;
            }

            slides[index].style.zIndex = String(state.zIndex);
        });

        const timeline = gsap.timeline({
            defaults: {
                overwrite: true,
            },
            onComplete: () => {
                fromSlide.style.zIndex = String(finalOutgoingZ);
                toSlide.style.zIndex = String(finalIncomingZ);

                if (onComplete) {
                    onComplete();
                }
            },
        });

        if (direction === 'forward') {
            timeline.to(toSlide, {
                x: incomingToMain.x,
                y: incomingToMain.y,
                scale: incomingToMain.scale,
                opacity: 1,
                duration: firstPhaseDuration,
                ease: 'power3.out',
                onStart: () => {
                    toSlide.style.zIndex = String(transitionTopZ);
                },
            }, 0);

            timeline.to(fromSlide, {
                x: outgoingToStack.x,
                y: outgoingToStack.y,
                scale: outgoingToStack.scale,
                opacity: 1,
                duration: secondPhaseDuration,
                ease: 'power3.inOut',
                onStart: () => {
                    fromSlide.style.zIndex = String(finalOutgoingZ);
                },
            }, staggerDelay);

            return;
        }

        timeline.to(fromSlide, {
            x: outgoingToStack.x,
            y: outgoingToStack.y,
            scale: outgoingToStack.scale,
            opacity: 1,
            duration: firstPhaseDuration,
            ease: 'power3.inOut',
            onStart: () => {
                fromSlide.style.zIndex = String(finalOutgoingZ);
            },
        }, 0);

        timeline.to(toSlide, {
            x: incomingToMain.x,
            y: incomingToMain.y,
            scale: incomingToMain.scale,
            opacity: 1,
            duration: secondPhaseDuration,
            ease: 'power3.out',
            onStart: () => {
                toSlide.style.zIndex = String(transitionTopZ);
            },
        }, staggerDelay);
    }

    render = (immediate = false, onComplete?: () => void) => {
        const state = this.buildState(this.index);

        this.applyState(state, immediate, onComplete);
    }

    updateButtons = () => {
        const { slides, prevButton, nextButton } = this.elements;
        const canGoPrev = this.index > 0;
        const canGoNext = this.index < slides.length - 1;

        if (this.isAnimating) {
            if (prevButton) {
                prevButton.disabled = false;
                prevButton.classList.remove('disabled');
                prevButton.classList.add('loading');
            }

            if (nextButton) {
                nextButton.disabled = false;
                nextButton.classList.remove('disabled');
                nextButton.classList.add('loading');
            }

            this.updatePagination();

            return;
        }

        if (prevButton) {
            prevButton.classList.remove('loading');
            prevButton.disabled = !canGoPrev;
            prevButton.classList.toggle('disabled', !canGoPrev);
        }

        if (nextButton) {
            nextButton.classList.remove('loading');
            nextButton.disabled = !canGoNext;
            nextButton.classList.toggle('disabled', !canGoNext);
        }

        this.updatePagination();
    }

    goTo = (nextIndex: number) => {
        const { slides } = this.elements;
        const currentIndex = this.index;

        if (this.isAnimating) {
            return;
        }

        if (nextIndex < 0 || nextIndex >= slides.length || nextIndex === currentIndex) {
            return;
        }

        this.isAnimating = true;
        this.updateButtons();

        const direction = nextIndex > currentIndex ? 'forward' : 'backward';

        this.animateSwap(currentIndex, nextIndex, direction, () => {
            this.index = nextIndex;
            this.isAnimating = false;
            this.updateButtons();
        });
    }

    next = () => {
        this.goTo(this.index + 1);
    }

    prev = () => {
        this.goTo(this.index - 1);
    }
}

export {
    DiamondSlider,
};
