import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, ScrollView } from "react-native";
import IconLocation from "@/assets/icon/location-non.svg";
import { DUMMY_LOCATIONS } from "@/constants/Config";
import styles from "./AddressInput.style";

interface AddressInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
}

export default function AddressInput({
    value = "",
    onChangeText,
    placeholder = "Alamat belum tersedia",
}: AddressInputProps) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const handleTextChange = (text: string) => {
        setQuery(text);
        if (onChangeText) {
            onChangeText(text);
        }

        if (text.trim().length > 0) {
            const filtered = DUMMY_LOCATIONS.filter((loc) =>
                loc.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setSuggestions([]);
        setIsFocused(false);
        if (onChangeText) {
            onChangeText(suggestion);
        }
    };

    return (
        <View style={styles.inputContainerRow}>
            <IconLocation width={18} height={18} style={styles.inputIcon} />
            <TextInput
                style={styles.bottomBorderInput}
                value={query}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                onFocus={() => {
                    setIsFocused(true);
                    if (query.trim().length > 0) {
                        const filtered = DUMMY_LOCATIONS.filter((loc) =>
                            loc.toLowerCase().includes(query.toLowerCase())
                        );
                        setSuggestions(filtered);
                    }
                }}
                onBlur={() => {
                    setTimeout(() => {
                        setIsFocused(false);
                    }, 300);
                }}
            />

            {isFocused && suggestions.length > 0 && (
                <View style={styles.dropdownContainer}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {suggestions.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={styles.dropdownItem}
                                onPress={() => handleSelectSuggestion(item)}
                            >
                                <Text style={styles.dropdownItemText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}
