import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import styles from "./AvailabilityDaysSelector.style";

interface AvailabilityDaysSelectorProps {
    selectedPreset: string | null;
    selectedDays: string[];
    onPresetSelect: (preset: string) => void;
    onDayToggle: (day: string) => void;
    onResetDays: () => void;
}

const PRESETS = [
    { key: "weekdays", label: "Weekdays" },
    { key: "weekend", label: "Weekend" },
    { key: "semua", label: "Semua" },
];

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const DAY_LABELS: Record<string, string> = {
    Senin: "S",
    Selasa: "S",
    Rabu: "R",
    Kamis: "K",
    Jumat: "J",
    Sabtu: "S",
    Minggu: "M",
};

export default function AvailabilityDaysSelector({
    selectedPreset,
    selectedDays,
    onPresetSelect,
    onDayToggle,
    onResetDays,
}: AvailabilityDaysSelectorProps) {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            {/* Header Title Section */}
            <Text style={styles.sectionHeaderTitle}>JADWAL TERSEDIA</Text>

            {/* Availability Selection Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                        Pilih Hari
                    </Text>
                    <TouchableOpacity onPress={onResetDays} activeOpacity={0.7}>
                        <Text style={[styles.resetButtonText, { color: theme.colors.secondary || "#e96100" }]}>
                            Reset
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Presets Row */}
                <View style={styles.presetsRow}>
                    {PRESETS.map((preset) => {
                        const isActive = selectedPreset === preset.key;
                        return (
                            <TouchableOpacity
                                key={preset.key}
                                onPress={() => onPresetSelect(preset.key)}
                                style={[
                                    styles.presetChip,
                                    isActive
                                        ? { backgroundColor: theme.colors.secondary || "#e96100", borderColor: theme.colors.secondary }
                                        : { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.presetChipText,
                                        isActive
                                            ? { color: "#FFF" }
                                            : { color: theme.colors.textSecondary || "#4B5563" },
                                    ]}
                                >
                                    {preset.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Day Selection Row (Circular Buttons) */}
                <View style={styles.daysGrid}>
                    {DAYS.map((day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                            <TouchableOpacity
                                key={day}
                                onPress={() => onDayToggle(day)}
                                style={[
                                    styles.dayCircle,
                                    isSelected
                                        ? { backgroundColor: theme.colors.secondary || "#e96100", borderColor: theme.colors.secondary }
                                        : { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.dayCircleText,
                                        isSelected
                                            ? { color: "#FFF" }
                                            : { color: theme.colors.textPrimary },
                                    ]}
                                >
                                    {DAY_LABELS[day]}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
