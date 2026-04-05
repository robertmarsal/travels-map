import "./styles.css";
import "../travels-map";
import { data } from "./data";

const travelMap = document.querySelector("travels-map");

if (travelMap instanceof HTMLElement) {
    (travelMap as HTMLElement & { points: typeof data.points }).points = data.points;
}
