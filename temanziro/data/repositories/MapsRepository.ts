import { CitySuggestion, LocationDetail, PlaceSuggestion } from "@/domain/models/MapsModel";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_MAPS_API_KEY || "";
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export const MapsRepository = {
    // Autocomplete Kota
    async getCityAutocomplete(input: string): Promise<CitySuggestion[]> {
        if (!input.trim()) return [];

        try {
            const url = `${BASE_URL}/autocomplete/json?input=${encodeURIComponent(
                input
            )}&types=(cities)&language=id&components=country:id&key=${GOOGLE_MAPS_API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google Maps API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
                throw new Error(`Google Places API returned status: ${data.status}`);
            }

            const predictions = data.predictions || [];

            return predictions.map((prediction: any) => {
                const cityName = prediction.structured_formatting?.main_text || "";
                const provinceName = prediction.structured_formatting?.secondary_text?.replace(", Indonesia", "") || "";

                return {
                    placeId: prediction.place_id,
                    cityName,
                    provinceName,
                    description: prediction.description,
                };
            });
        } catch (error) {
            console.error("Error in getCityAutocomplete:", error);
            throw error;
        }
    },

    // Autocomplete Lokasi
    async getLocationAutocomplete(input: string): Promise<PlaceSuggestion[]> {
        if (!input.trim()) return [];

        try {
            // Tidak membatasi 'types' agar bisa mencari alamat jalan (geocode) maupun nama tempat/bangunan (establishment)
            const url = `${BASE_URL}/autocomplete/json?input=${encodeURIComponent(
                input
            )}&language=id&components=country:id&key=${GOOGLE_MAPS_API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google Maps API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
                throw new Error(`Google Places API returned status: ${data.status}`);
            }

            const predictions = data.predictions || [];

            return predictions.map((prediction: any) => ({
                placeId: prediction.place_id,
                description: prediction.description,
                mainText: prediction.structured_formatting?.main_text || "",
                secondaryText: prediction.structured_formatting?.secondary_text || "",
            }));
        } catch (error) {
            console.error("Error in getLocationAutocomplete:", error);
            throw error;
        }
    },

    // Koordinat dari alamat (lat long)
    async getPlaceDetails(placeId: string): Promise<LocationDetail | null> {
        try {
            const url = `${BASE_URL}/details/json?place_id=${placeId}&fields=geometry,formatted_address&language=id&key=${GOOGLE_MAPS_API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google Maps API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== "OK") {
                throw new Error(`Google Places API returned status: ${data.status}`);
            }

            const result = data.result;
            if (!result) return null;

            return {
                placeId,
                formattedAddress: result.formatted_address,
                coordinate: {
                    latitude: result.geometry?.location?.lat || 0,
                    longitude: result.geometry?.location?.lng || 0,
                },
            };
        } catch (error) {
            console.error("Error in getPlaceDetails:", error);
            throw error;
        }
    }
};
