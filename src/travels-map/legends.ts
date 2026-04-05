import L, { type Control, type Map } from "leaflet";
import { countCountries } from "./utils";
import type { TravelPoint } from "./types";

type LegendElements = {
    countries: HTMLDivElement;
    locations: HTMLDivElement;
};

export function updateLegends(
    map: Map,
    points: TravelPoint[],
    showLegends: boolean,
    legendElements: LegendElements,
    existingControls: Control[],
): Control[] {
    existingControls.forEach((control) => control.remove());

    if (!showLegends) {
        legendElements.locations.hidden = true;
        legendElements.countries.hidden = true;
        return [];
    }

    legendElements.locations.hidden = false;
    legendElements.countries.hidden = false;
    legendElements.locations.textContent = `${points.length} locations`;
    legendElements.countries.textContent = `${countCountries(points)} countries`;

    return ["locations", "countries"].map((type) => {
        const element = type === "locations" ? legendElements.locations : legendElements.countries;
        const control = new L.Control({ position: "bottomright" });
        control.onAdd = () => element;
        control.addTo(map);
        return control;
    });
}
