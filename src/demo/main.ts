import "./styles.css";
import "../travels-map";
import { data } from "./data";

const travelsMap = document.querySelector("travels-map");

if (travelsMap instanceof HTMLElement) {
    (travelsMap as HTMLElement & { points: typeof data.points }).points = data.points;
}
