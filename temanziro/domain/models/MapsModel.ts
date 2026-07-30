export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface PlaceSuggestion {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
}

export interface CitySuggestion {
    placeId: string;
    cityName: string;
    provinceName: string;
}

export interface LocationDetail {
    placeId: string;
    formattedAddress: string;
    coordinate: Coordinate;
}
