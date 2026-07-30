import styles from "./EditProfilePopUp.style";
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import React, { useState, useEffect, useRef } from "react";
import IconLocation from "@/assets/icon/location-non.svg";
import IconSearch from "@/assets/icon/search-non.svg";
import { DUMMY_LOCATIONS } from "@/constants/Config";

interface EditProfilePopUpProps {
    visible: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    title: string;
    value: string;
    type: "text" | "location";
    placeholder?: string;
    cities?: string[];
    onSearchCity?: (query: string) => void;
}

export default function EditProfilePopUp({
    visible,
    onClose,
    onSave,
    title,
    value,
    type,
    placeholder,
    cities,
    onSearchCity,
}: EditProfilePopUpProps) {
    const { theme } = useTheme();
    const [tempValue, setTempValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const slideAnim = useRef(new Animated.Value(400)).current;

    useEffect(() => {
        if (visible) {
            setTempValue(value);
            setIsFocused(true);

            // Slide up animation
            slideAnim.setValue(400);
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
            }).start();

            setSuggestions([]);
        }
    }, [visible, value]);

    useEffect(() => {
        if (cities) {
            if (tempValue === value) {
                setSuggestions([]);
            } else {
                setSuggestions(cities);
            }
        }
    }, [cities, tempValue, value]);

    const handleTextChange = (text: string) => {
        setTempValue(text);
        if (text.trim().length > 0 && text !== value) {
            if (onSearchCity) {
                onSearchCity(text);
            } else {
                const listSource = cities && cities.length > 0 ? cities : DUMMY_LOCATIONS;
                const filtered = listSource.filter((loc) =>
                    loc.toLowerCase().includes(text.toLowerCase())
                );
                setSuggestions(filtered);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setTempValue(suggestion);
        setSuggestions([]);
        setIsFocused(false);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{title}</Text>
                                </View>

                                {type === "location" ? (
                                    <View style={{ width: "100%", marginBottom: 20 }}>
                                        <View style={[styles.searchBar, { borderColor: theme.colors.border, backgroundColor: theme.colors.primaryBackground }]}>
                                            <IconLocation width={18} height={18} fill="#94a3b8" style={styles.searchIconLeft} />
                                            <TextInput
                                                style={[styles.modalInputField, { color: theme.colors.textPrimary }]}
                                                value={tempValue}
                                                onChangeText={handleTextChange}
                                                placeholder={placeholder || "Cari kota/lokasi"}
                                                placeholderTextColor="#94a3b8"
                                                onFocus={() => {
                                                    setIsFocused(true);
                                                    if (tempValue.trim().length > 0 && tempValue !== value) {
                                                        if (onSearchCity) {
                                                            onSearchCity(tempValue);
                                                        } else {
                                                            const listSource = cities && cities.length > 0 ? cities : DUMMY_LOCATIONS;
                                                            const filtered = listSource.filter((loc) =>
                                                                loc.toLowerCase().includes(tempValue.toLowerCase())
                                                            );
                                                            setSuggestions(filtered);
                                                        }
                                                    } else {
                                                        setSuggestions([]);
                                                    }
                                                }}
                                            />
                                            <IconSearch width={18} height={18} fill="#94a3b8" style={styles.searchIconRight} />
                                        </View>

                                        {isFocused && suggestions.length > 0 && (
                                            <View style={[styles.suggestionsContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.primaryBackground }]}>
                                                <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 180 }}>
                                                    {suggestions.map((item, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={[styles.suggestionItem, { borderBottomColor: theme.colors.border }]}
                                                            onPress={() => handleSelectSuggestion(item)}
                                                        >
                                                            <Text style={[styles.suggestionText, { color: theme.colors.textPrimary }]}>{item}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <TextInput
                                        style={styles.modalInput}
                                        value={tempValue}
                                        onChangeText={setTempValue}
                                        placeholder={placeholder || "Masukkan teks"}
                                        placeholderTextColor="#94a3b8"
                                        autoFocus={true}
                                    />
                                )}

                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.modalCancelBtn}
                                        onPress={onClose}
                                    >
                                        <Text style={styles.modalCancelText}>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalSaveBtn}
                                        onPress={() => {
                                            onSave(tempValue);
                                            onClose();
                                        }}
                                    >
                                        <Text style={styles.modalSaveText}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}