import L, { type LayerGroup, type Map, type TileLayer } from "leaflet";
import type { TravelPoint } from "./types";

export const DEFAULT_CENTER: [number, number] = [38.957083, -39.074225];
export const DEFAULT_ZOOM = 3;
export const DEFAULT_TILE_URL =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
export const DEFAULT_TILE_OPTIONS = {
    maxZoom: 19,
    subdomains: "abcd",
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

export function createMap(element: HTMLElement): { map: Map; markerLayer: LayerGroup } {
    const map = L.map(element, {
        zoomControl: false,
        attributionControl: true,
        worldCopyJump: true,
    });

    const markerLayer = L.layerGroup().addTo(map);

    return { map, markerLayer };
}

export function updateTileLayer(
    map: Map,
    tileLayer: TileLayer | null,
    currentTileUrl: string | null,
    tileUrl: string,
): TileLayer {
    if (tileLayer && currentTileUrl === tileUrl) {
        return tileLayer;
    }

    tileLayer?.remove();
    return L.tileLayer(tileUrl, DEFAULT_TILE_OPTIONS).addTo(map);
}

export function updateMarkers(markerLayer: LayerGroup, points: TravelPoint[]): void {
    markerLayer.clearLayers();

    const markerIcon = L.divIcon({
        className: "",
        html: '<div class="travel-marker"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });

    points.forEach((point) => {
        L.marker([point.lat, point.lng], {
            title: point.title,
            icon: markerIcon,
        })
            .addTo(markerLayer)
            .bindTooltip(point.title, {
                direction: "top",
                offset: [0, -10],
            });
    });
}

export function updateViewport(
    map: Map,
    points: TravelPoint[],
    center: [number, number],
    zoom: number,
): void {
    if (!points.length) {
        map.setView(center, zoom);
        return;
    }

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
}
