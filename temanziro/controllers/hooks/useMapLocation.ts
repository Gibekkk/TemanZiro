import { useState, useCallback } from "react";
import { MapsRepository } from "@/data/repositories/MapsRepository";
import { CitySuggestion, PlaceSuggestion, LocationDetail } from "@/domain/models/MapsModel";

export const useMapLocation = () => {
    const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<PlaceSuggestion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Kota / Kabupaten Indonesia
    const searchCity = useCallback(async (query: string) => {
        if (!query.trim()) {
            setCitySuggestions([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const results = await MapsRepository.getCityAutocomplete(query);
            setCitySuggestions(results);
        } catch (err: any) {
            setError(err.message || "Failed to fetch city suggestions");
        } finally {
            setLoading(false);
        }
    }, []);

    // Cari Alamat / Tempat di Indonesia
    const searchLocation = useCallback(async (query: string) => {
        if (!query.trim()) {
            setLocationSuggestions([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const results = await MapsRepository.getLocationAutocomplete(query);
            setLocationSuggestions(results);
        } catch (err: any) {
            setError(err.message || "Failed to fetch location suggestions");
        } finally {
            setLoading(false);
        }
    }, []);

    // Koordinat dari alamat
    const getDetails = useCallback(async (placeId: string): Promise<LocationDetail | null> => {
        setLoading(true);
        setError(null);
        try {
            return await MapsRepository.getPlaceDetails(placeId);
        } catch (err: any) {
            setError(err.message || "Failed to fetch place details");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSuggestions = useCallback(() => {
        setCitySuggestions([]);
        setLocationSuggestions([]);
        setError(null);
    }, []);

    return {
        citySuggestions,
        locationSuggestions,
        loading,
        error,
        searchCity,
        searchLocation,
        getDetails,
        clearSuggestions,
    };
};
