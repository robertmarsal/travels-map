export type TravelPoint = {
    lat: number;
    lng: number;
    title: string;
};

export type TravelMapData = {
    points: TravelPoint[];
};
