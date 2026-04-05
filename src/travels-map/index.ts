import { TravelsMapElement } from "./TravelsMapElement";

if (!customElements.get("travels-map")) {
    customElements.define("travels-map", TravelsMapElement);
}

export { TravelsMapElement };
export type { TravelMapData, TravelPoint } from "./types";
