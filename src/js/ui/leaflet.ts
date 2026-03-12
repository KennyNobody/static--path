import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {COORDINATES} from "./coords";
import {isMobile} from "../helpers/isMobile";

const POPUP_BASE_OFFSET = L.point(0, -42);

const POPUP_METRICS = {
    desktop: {
        iconSize: 84,
        paddingX: 12,
        paddingY: 12,
    },
    mobile: {
        iconSize: 84,
        paddingX: 8,
        paddingY: 8,
    },
} as const;

const MARKER = {
    coords: [42.68037, 45.90168] as [number, number],
    icon: './assets/images/icon-marker-forest.svg',
    title: 'Чайринский водопад',
    link: '#',
};

const getElementCenter = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
};

const getPopupMetrics = () => {
    return isMobile() ? POPUP_METRICS.mobile : POPUP_METRICS.desktop;
};

const getPopupImageToMarkerOffset = (markerElement: HTMLElement, popupElement: HTMLElement) => {
    const markerCenter = getElementCenter(markerElement);
    const popupRect = popupElement.getBoundingClientRect();
    const popupMetrics = getPopupMetrics();

    const popupIconCenter = {
        x: popupRect.left + popupMetrics.paddingX + popupMetrics.iconSize / 2,
        y: popupRect.top + popupMetrics.paddingY + popupMetrics.iconSize / 2,
    };

    return L.point(
        markerCenter.x - popupIconCenter.x,
        markerCenter.y - popupIconCenter.y,
    );
};

class LeafletApp {
    el: Element;
    map: L.Map;

    constructor(el: Element) {
        this.el = el;
        this.initMap();
        this.addTrack();
        this.addMarker();
    }

    private alignPopupImageToMarker = (marker: L.Marker, popup: L.Popup) => {
        popup.options.offset = [POPUP_BASE_OFFSET.x, POPUP_BASE_OFFSET.y];
        popup.update();

        const markerElement = marker.getElement() as (HTMLElement | null);
        const popupElement = popup.getElement() as (HTMLElement | null);

        if (!markerElement || !popupElement) {
            return;
        }

        const offset = getPopupImageToMarkerOffset(markerElement, popupElement);
        const nextOffset = POPUP_BASE_OFFSET.add(offset);

        popup.options.offset = [nextOffset.x, nextOffset.y];
        popup.update();
    }

    initMap = () => {
        this.map = L.map(this.el as HTMLElement, {
            scrollWheelZoom: false,
            touchZoom: true,
        }).setView([43.486414, 43.646551], 8);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
    }

    addTrack = () => {
        L.polyline(COORDINATES, { color: '#FFB300', weight: 7 }).addTo(this.map);
    }

    addMarker = () => {
        const icon = L.icon({
            iconUrl: MARKER.icon,
            iconSize: [84, 84],
        });

        const popup = `
            <div class="marker" data-map="item">
                <div class="marker__preview" data-map="button">
                    <img class="marker__image" src="${MARKER.icon}" width="84" height="84" alt="">
                </div>

                <p class="marker__title title-marker">${MARKER.title}</p>
                <a href="${MARKER.link}" class="marker__link body-marker-link">На карту</a>
            </div>
        `;

        const marker = L
            .marker(MARKER.coords, { icon })
            .addTo(this.map)
            .bindPopup(popup, {
                className: 'marker-popup',
                closeButton: false,
                offset: [POPUP_BASE_OFFSET.x, POPUP_BASE_OFFSET.y], // [horizontal, vertical]
            });

        marker.on('popupopen', ({ popup: openedPopup }: L.PopupEvent) => {
            // Выравниваем попап относительно внутренней иконки по маркеру
            requestAnimationFrame(() => {
                this.alignPopupImageToMarker(marker, openedPopup);
            });
        });
    }
}

export {
    LeafletApp,
}
