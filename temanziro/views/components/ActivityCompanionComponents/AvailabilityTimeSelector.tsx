import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import WheelColumn from "@/views/components/WheelColumn/WheelColumn";
import styles from "./AvailabilityTimeSelector.style";

interface AvailabilityTimeSelectorProps {
    timeMode: "standard" | "full_day";
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
    onTimeModeChange: (mode: "standard" | "full_day") => void;
    onStartHourChange: (val: string) => void;
    onStartMinuteChange: (val: string) => void;
    onEndHourChange: (val: string) => void;
    onEndMinuteChange: (val: string) => void;
}

export default function AvailabilityTimeSelector({
    timeMode,
    startHour,
    startMinute,
    endHour,
    endMinute,
    onTimeModeChange,
    onStartHourChange,
    onStartMinuteChange,
    onEndHourChange,
    onEndMinuteChange,
}: AvailabilityTimeSelectorProps) {
    const { theme } = useTheme();
    const [activeField, setActiveField] = useState<"start" | "end" | null>(null);

    const sh = parseInt(startHour, 10) || 0;
    const sm = parseInt(startMinute, 10) || 0;
    const eh = parseInt(endHour, 10) || 0;
    const em = parseInt(endMinute, 10) || 0;

    const handleStartHourChange = (val: number) => {
        onStartHourChange(String(val).padStart(2, "0"));
    };

    const handleStartMinuteChange = (val: number) => {
        onStartMinuteChange(String(val).padStart(2, "0"));
    };

    const handleEndHourChange = (val: number) => {
        onEndHourChange(String(val).padStart(2, "0"));
    };

    const handleEndMinuteChange = (val: number) => {
        onEndMinuteChange(String(val).padStart(2, "0"));
    };

    const toggleTimeMode = (isFullDay: boolean) => {
        onTimeModeChange(isFullDay ? "full_day" : "standard");
        setActiveField(null);
    };

    return (
        <View style={styles.container}>
            {/* Section Header Title */}
            <Text style={styles.sectionHeaderTitle}>PILIH WAKTU</Text>

            {/* Time Card Wrapper */}
            <View style={styles.card}>
                {timeMode === "standard" && (
                    <>
                        {/* Mulai Time Selection Row */}
                        <View style={styles.row}>
                            <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>
                                Mulai
                            </Text>
                            <TouchableOpacity
                                style={styles.timeValueBox}
                                onPress={() => setActiveField(activeField === "start" ? null : "start")}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.timeValueText, { color: theme.colors.secondary || "#e96100" }]}>
                                    {startHour}:{startMinute}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Inline Start Time Picker */}
                        {activeField === "start" && (
                            <View style={styles.pickerWrapper}>
                                <View style={styles.pickerHighlightBar} />
                                <WheelColumn
                                    value={sh}
                                    max={23}
                                    onChange={handleStartHourChange}
                                    activeColor={theme.colors.secondary}
                                    textColor={theme.colors.textSecondary}
                                />
                                <Text style={styles.pickerSeparator}>:</Text>
                                <WheelColumn
                                    value={sm}
                                    max={59}
                                    onChange={handleStartMinuteChange}
                                    activeColor={theme.colors.secondary}
                                    textColor={theme.colors.textSecondary}
                                />
                            </View>
                        )}

                        <View style={styles.divider} />

                        {/* Selesai Time Selection Row */}
                        <View style={styles.row}>
                            <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>
                                Selesai
                            </Text>
                            <TouchableOpacity
                                style={styles.timeValueBox}
                                onPress={() => setActiveField(activeField === "end" ? null : "end")}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.timeValueText, { color: theme.colors.secondary || "#e96100" }]}>
                                    {endHour}:{endMinute}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Inline End Time Picker */}
                        {activeField === "end" && (
                            <View style={styles.pickerWrapper}>
                                <View style={styles.pickerHighlightBar} />
                                <WheelColumn
                                    value={eh}
                                    max={23}
                                    onChange={handleEndHourChange}
                                    activeColor={theme.colors.secondary}
                                    textColor={theme.colors.textSecondary}
                                />
                                <Text style={styles.pickerSeparator}>:</Text>
                                <WheelColumn
                                    value={em}
                                    max={59}
                                    onChange={handleEndMinuteChange}
                                    activeColor={theme.colors.secondary}
                                    textColor={theme.colors.textSecondary}
                                />
                            </View>
                        )}

                        <View style={styles.divider} />
                    </>
                )}

                {/* Full Day 24 Hours Toggle Row */}
                <View style={styles.row}>
                    <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>
                        Full Day (24 Jam)
                    </Text>
                    <Switch
                        value={timeMode === "full_day"}
                        onValueChange={toggleTimeMode}
                        trackColor={{ false: "#E5E7EB", true: "#FBD5C0" }}
                        thumbColor={timeMode === "full_day" ? (theme.colors.secondary || "#e96100") : "#F4F3F0"}
                    />
                </View>
            </View>
        </View>
    );
}
