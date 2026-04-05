import type { Control, LayerGroup, Map, TileLayer } from "leaflet";
import leafletCss from "leaflet/dist/leaflet.css?inline";
import componentCss from "./styles.css?inline";
import { updateLegends } from "./legends";
import {
    createMap,
    DEFAULT_CENTER,
    DEFAULT_TILE_URL,
    DEFAULT_ZOOM,
    updateMarkers,
    updateTileLayer,
    updateViewport,
} from "./map";
import type { TravelMapData, TravelPoint } from "./types";
import {
    normalizePoints,
    parseBooleanAttribute,
    parseCenterAttribute,
    parseNumberAttribute,
} from "./utils";

const DEFAULT_THEME = "dark-monochrome";

export class TravelsMapElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["center", "data-src", "show-legends", "theme", "tiles-url", "zoom"];
    }

    private map: Map | null = null;
    private tileLayer: TileLayer | null = null;
    private tileUrl: string | null = null;
    private markerLayer: LayerGroup | null = null;
    private legendControls: Control[] = [];
    private resizeObserver: ResizeObserver | null = null;
    private pointsValue: TravelPoint[] = [];
    private dataRequestId = 0;
    private readonly mapElement: HTMLDivElement;
    private readonly locationsLegendElement: HTMLDivElement;
    private readonly countriesLegendElement: HTMLDivElement;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot!.innerHTML = `
            <style>${leafletCss}\n${componentCss}</style>
            <div class="map-shell" part="shell">
                <div class="map" part="map"></div>
                <div class="legend legend-secondary" data-role="countries" part="countries-legend"></div>
                <div class="legend" data-role="locations" part="locations-legend"></div>
            </div>
        `;

        this.mapElement = this.shadowRoot!.querySelector(".map") as HTMLDivElement;
        this.locationsLegendElement = this.shadowRoot!.querySelector(
            '[data-role="locations"]',
        ) as HTMLDivElement;
        this.countriesLegendElement = this.shadowRoot!.querySelector(
            '[data-role="countries"]',
        ) as HTMLDivElement;
    }

    connectedCallback(): void {
        this.ensureMap();
        this.setupResizeObserver();
        this.applyTheme();
        void this.loadConfiguredData();
        this.render();
    }

    disconnectedCallback(): void {
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;

        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        this.tileLayer = null;
        this.tileUrl = null;
        this.markerLayer = null;
        this.legendControls = [];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue || !this.isConnected) {
            return;
        }

        if (name === "data-src") {
            void this.loadConfiguredData();
            return;
        }

        if (name === "theme") {
            this.applyTheme();
        }

        this.render();
    }

    get points(): TravelPoint[] {
        return this.pointsValue;
    }

    set points(value: unknown) {
        this.pointsValue = normalizePoints(value);

        if (this.isConnected) {
            this.render();
        }
    }

    private async loadConfiguredData(): Promise<void> {
        const dataSrc = this.getAttribute("data-src");

        if (!dataSrc) {
            return;
        }

        const requestId = ++this.dataRequestId;

        try {
            const response = await fetch(dataSrc);
            if (!response.ok) {
                throw new Error(`Failed to load map data: ${response.status}`);
            }

            const payload = (await response.json()) as TravelMapData | TravelPoint[];
            if (requestId !== this.dataRequestId) {
                return;
            }

            this.pointsValue = normalizePoints("points" in payload ? payload.points : payload);
            this.render();
        } catch (error) {
            if (requestId !== this.dataRequestId) {
                return;
            }

            console.error(error);
            this.pointsValue = [];
            this.render();
        }
    }

    private ensureMap(): void {
        if (this.map) {
            return;
        }

        const { map, markerLayer } = createMap(this.mapElement);
        this.map = map;
        this.markerLayer = markerLayer;
    }

    private setupResizeObserver(): void {
        if (this.resizeObserver) {
            return;
        }

        this.resizeObserver = new ResizeObserver(() => {
            this.map?.invalidateSize();
        });
        this.resizeObserver.observe(this);
    }

    private getTheme(): string {
        return this.getAttribute("theme") || DEFAULT_THEME;
    }

    private applyTheme(): void {
        this.dataset.theme = this.getTheme();
    }

    private getCenter(): [number, number] {
        return parseCenterAttribute(this.getAttribute("center")) || DEFAULT_CENTER;
    }

    private getZoom(): number {
        return parseNumberAttribute(this.getAttribute("zoom"), DEFAULT_ZOOM);
    }

    private getShowLegends(): boolean {
        return parseBooleanAttribute(this.getAttribute("show-legends"), true);
    }

    private getTileUrl(): string {
        return this.getAttribute("tiles-url") || DEFAULT_TILE_URL;
    }

    private render(): void {
        if (!this.map || !this.markerLayer) {
            return;
        }

        const points = normalizePoints(this.pointsValue);

        this.tileLayer = updateTileLayer(this.map, this.tileLayer, this.tileUrl, this.getTileUrl());
        this.tileUrl = this.getTileUrl();
        updateMarkers(this.markerLayer, points);
        this.legendControls = updateLegends(
            this.map,
            points,
            this.getShowLegends(),
            {
                locations: this.locationsLegendElement,
                countries: this.countriesLegendElement,
            },
            this.legendControls,
        );
        updateViewport(this.map, points, this.getCenter(), this.getZoom());
    }
}
