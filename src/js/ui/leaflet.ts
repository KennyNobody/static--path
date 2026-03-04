import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {COORDINATES} from "./coords";

const MARKER = {
    coords: [42.68037, 45.90168] as [number, number],
    icon: './assets/images/icon-marker-forest.svg',
    title: 'Чайринский водопад',
    link: '#',
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

        L.marker(MARKER.coords, { icon })
            .addTo(this.map)
            .bindPopup(popup, {
                className: 'marker-popup',
                closeButton: false,
                offset: [0, -42], // [horizontal, vertical]
            });
    }
}

export {
    LeafletApp,
}
