import type { TravelPoint } from "./types";

const DEFAULT_CENTER: [number, number] = [38.957083, -39.074225];

export function parseBooleanAttribute(value: string | null, defaultValue = true): boolean {
    if (value === null) {
        return defaultValue;
    }

    return value !== "false";
}

export function parseNumberAttribute(value: string | null, fallback: number): number {
    if (value === null || value === "") {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseCenterAttribute(value: string | null): [number, number] {
    if (!value) {
        return DEFAULT_CENTER;
    }

    const parts = value.split(",").map((part) => Number(part.trim()));
    if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
        return DEFAULT_CENTER;
    }

    return [parts[0], parts[1]];
}

export function normalizePoints(points: unknown): TravelPoint[] {
    if (!Array.isArray(points)) {
        return [];
    }

    return points
        .map((point) => ({
            lat: Number((point as Partial<TravelPoint>)?.lat),
            lng: Number((point as Partial<TravelPoint>)?.lng),
            title: String((point as Partial<TravelPoint>)?.title ?? ""),
        }))
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
}

export function countCountries(points: TravelPoint[]): number {
    const uniqueCountries = new Set<string>();

    points.forEach((point) => {
        const [, country] = point.title.split(" - ");
        if (country) {
            uniqueCountries.add(country.trim());
        }
    });

    return uniqueCountries.size;
}
