import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {COORDINATES} from "./coords";
import {waitForElement} from "../helpers/waitForElement";

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

const getPopupImageToMarkerOffset = (markerElement: HTMLElement, popupImageElement: HTMLElement) => {
    const markerCenter = getElementCenter(markerElement);
    const popupIconCenter = getElementCenter(popupImageElement);

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

    private alignPopupImageToMarker = async (marker: L.Marker, popup: L.Popup) => {
        const markerElement = marker.getElement();
        const popupElement = popup.getElement();

        if (!markerElement || !popupElement) {
            return;
        }

        const popupImageElement = await waitForElement<HTMLElement>('.marker__image', {
            root: popupElement,
            timeout: 500,
        });

        if (!popupImageElement) {
            return;
        }

        const offset = getPopupImageToMarkerOffset(markerElement, popupImageElement);
        const currentOffset = L.point(popup.options.offset ?? [0, 0]);
        const nextOffset = currentOffset.add(offset);

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
                    <img class="marker__image" src="${MARKER.icon}" alt="">
                </div>

                <p class="marker__title">${MARKER.title}</p>
                <a href="${MARKER.link}" class="marker__link">На карту</a>
            </div>
        `;

        const marker = L
            .marker(MARKER.coords, { icon })
            .addTo(this.map)
            .bindPopup(popup, {
                className: 'marker-popup',
                closeButton: false,
                offset: [0, -42], // [horizontal, vertical]
            });

        marker.on('popupopen', ({ popup: openedPopup }: L.PopupEvent) => {
            requestAnimationFrame(() => {
                // Выравниваем попап относительно внутренней иконки по маркеру
                this.alignPopupImageToMarker(marker, openedPopup);
            });
        });
    }
}

export {
    LeafletApp,
}
