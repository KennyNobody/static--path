import Panzoom, { PanzoomObject, PanzoomOptions } from '@panzoom/panzoom';

class Map {
    private el: HTMLElement;
    private items: HTMLElement[];
    private panzoom: PanzoomObject;

    constructor(el: HTMLElement) {
        this.el = el;
        this.items = Array.from(this.el.querySelectorAll<HTMLElement>('[data-map="item"]'));

        this.bindEvents();
        this.initPanzoom();
    }

    private bindEvents(): void {
        this.items.forEach((item: HTMLElement) => {
            const button = item.querySelector<HTMLButtonElement>('[data-map="button"]');

            button?.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                this.setActive(item);
            });
        });

        document.addEventListener('click', () => {
            this.clearActive();
        });
    }

    private setActive(activeItem: HTMLElement): void {
        this.items.forEach((item: HTMLElement) => {
            item.classList.toggle('active', item === activeItem);
        });
    }

    private clearActive(): void {
        this.items.forEach((item: HTMLElement) => {
            item.classList.remove('active');
        });
    }

    private initPanzoom(): void {
        const isMobile: boolean = window.innerWidth < 1299;
        if (!isMobile) return;

        this.panzoom = Panzoom(this.el, {
            maxScale: 2,
            minScale: 1,
            contain: 'outside',
            // startScale: isMobile ? 2 : 1,
        });

        this.el.parentElement?.addEventListener('wheel', (e: WheelEvent) => {
            this.panzoom.zoomWithWheel(e);
        });
    }
}

export {
    Map,
}
