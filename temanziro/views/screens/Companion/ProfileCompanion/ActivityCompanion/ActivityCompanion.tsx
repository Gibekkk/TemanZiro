import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import GenderSelector from "@/views/components/GenderSelector/GenderSelector";
import AvailabilityDaysSelector from "@/views/components/ActivityCompanionComponents/AvailabilityDaysSelector";
import AvailabilityTimeSelector from "@/views/components/ActivityCompanionComponents/AvailabilityTimeSelector";
import ActivityGroupedSelector from "@/views/components/ActivityCompanionComponents/ActivityGroupedSelector";
import { useActivityCompanion } from "@/controllers/hooks/Companion/useActivityCompanion";
import styles from "./ActivityCompanion.style";

export default function ActivityCompanion() {
    const { theme } = useTheme();
    const {
        profileLoading,
        selectedPreset,
        selectedDays,
        timeMode,
        setTimeMode,
        startHour,
        setStartHour,
        startMinute,
        setStartMinute,
        endHour,
        setEndHour,
        endMinute,
        setEndMinute,
        acceptedGender,
        setAcceptedGender,
        selectedActivities,
        handlePresetSelect,
        toggleDay,
        toggleActivity,
        handleResetDays,
        handleSave,
    } = useActivityCompanion();

    if (profileLoading) {
        return (
            <SecondaryLayout title="Tertarik dengan Aktivitas" alignLeft={true}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.secondary || "#e96100"} />
                </View>
            </SecondaryLayout>
        );
    }

    return (
        <SecondaryLayout title="Tertarik dengan Aktivitas" alignLeft={true}>
            <View style={styles.genderPreferenceSection}>
                <Text style={styles.sectionHeaderTitle}>PREFERENSI BOOKING</Text>
                <View style={styles.genderCard}>
                    <Text style={[styles.genderCardTitle, { color: theme.colors.textPrimary }]}>
                        Gender yang Diterima
                    </Text>
                    <Text style={styles.genderCardSubtitle}>
                        Pilih siapa saja yang bisa membooking kamu
                    </Text>
                    <View style={styles.selectorWrapper}>
                        <GenderSelector
                            value={acceptedGender}
                            onChange={setAcceptedGender}
                            options={["pria", "wanita", "semua"]}
                            showIcon={false}
                            activeBgColor={theme.colors.secondary || "#e96100"}
                        />
                    </View>
                </View>
            </View>

            <ActivityGroupedSelector
                selectedActivities={selectedActivities}
                onActivityToggle={toggleActivity}
            />

            {/* Days Selector Section */}
            <AvailabilityDaysSelector
                selectedPreset={selectedPreset}
                selectedDays={selectedDays}
                onPresetSelect={handlePresetSelect}
                onDayToggle={toggleDay}
                onResetDays={handleResetDays}
            />

            {/* 2. Time Selector Section */}
            <AvailabilityTimeSelector
                timeMode={timeMode}
                startHour={startHour}
                startMinute={startMinute}
                endHour={endHour}
                endMinute={endMinute}
                onTimeModeChange={setTimeMode}
                onStartHourChange={setStartHour}
                onStartMinuteChange={setStartMinute}
                onEndHourChange={setEndHour}
                onEndMinuteChange={setEndMinute}
            />

            

            {/* 4. Switchable Activities List */}
            

            {/* 5. Save Button */}
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
