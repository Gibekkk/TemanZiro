import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import { useCharacterCompanion } from "@/controllers/hooks/Companion/useCharacterCompanion";
import { DEFAULT_TRAITS } from "@/constants/Config";
import styles from "./CharacterCompanion.style"

export default function CharacterCompanion() {
    const { theme } = useTheme();
    const {
        profileLoading,
        philosophy,
        setPhilosophy,
        selectedTraits,
        customTraits,
        toggleTrait,
        addCustomTrait,
        handleSave,
    } = useCharacterCompanion();

    const [isAdding, setIsAdding] = useState(false);
    const [customInput, setCustomInput] = useState("");

    const handleAddCustom = () => {
        const val = customInput.trim();
        if (val) {
            addCustomTrait(val);
            setCustomInput("");
            setIsAdding(false);
        } else {
            setIsAdding(false);
        }
    };

    const allTraits = [...DEFAULT_TRAITS, ...customTraits];

    const getActiveColor = (index: number) => {
        if (index % 2 === 0) {
            return {
                bg: "#FFF0E6",
                text: "#A35200",
                border: "#FFF0E6",
            };
        }
        return {
            bg: "#E6F0FA",
            text: "#0066CC",
            border: "#E6F0FA",
        };
    };

    if (profileLoading) {
        return (
            <SecondaryLayout title="Karakter Saya" alignLeft={true}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.secondary || "#e96100"} />
                </View>
            </SecondaryLayout>
        );
    }

    return (
        <SecondaryLayout title="Karakter Saya" alignLeft={true}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>FILOSOFI HIDUP</Text>
                <View style={styles.card}>
                    <TextInput
                        style={[styles.textArea, { color: theme.colors.textPrimary }]}
                        value={philosophy}
                        onChangeText={setPhilosophy}
                        placeholder="Tulis filosofi hidup kamu di sini..."
                        placeholderTextColor="#94a3b8"
                        multiline={true}
                        scrollEnabled={false}
                        textAlignVertical="top"
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>KAMU ORANGNYA KAYAK GIMANA</Text>
                <View style={styles.cardTag}>
                    <View style={styles.tagsContainer}>
                        {allTraits.map((trait, index) => {
                            const isSelected = selectedTraits.includes(trait);
                            const colors = getActiveColor(index);

                            return (
                                <TouchableOpacity
                                    key={trait}
                                    style={[
                                        styles.tagCapsule,
                                        isSelected
                                            ? { backgroundColor: colors.bg, borderColor: colors.border }
                                            : { backgroundColor: "#F3ECE4", borderColor: "#F3ECE4" },
                                    ]}
                                    onPress={() => toggleTrait(trait)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.tagText,
                                            isSelected
                                                ? { color: colors.text }
                                                : { color: "#5A4D41" },
                                        ]}
                                    >
                                        {trait}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        {isAdding ? (
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.customInput}
                                    value={customInput}
                                    onChangeText={setCustomInput}
                                    placeholder="Ketik..."
                                    placeholderTextColor="#94a3b8"
                                    onSubmitEditing={handleAddCustom}
                                    onBlur={handleAddCustom}
                                    autoFocus={true}
                                    maxLength={15}
                                />
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.addMoreButton}
                                onPress={() => setIsAdding(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.addMoreText}>Lainnya...</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <GeneralButton
                    variant="primary"
                    style={{ ...styles.saveButton, backgroundColor: theme.colors.secondary || "#e96100" }}
                    onClick={handleSave}
                >
                    Simpan
                </GeneralButton>
            </View>
        </SecondaryLayout>
    );
}
