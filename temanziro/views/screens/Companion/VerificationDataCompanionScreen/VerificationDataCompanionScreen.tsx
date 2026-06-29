import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
// Asumsi letak custom hook theme Anda
import { useTheme } from "@/controllers/hooks/useTheme";
import LocationCard from "@/views/components/LocationCard/LocationCard";
import PersonaSelector from "@/views/components/PersonaSelector/PersonaSelector";
import InterestSelector from "@/views/components/InterestSelector/InterestSelector";

// Mock import komponen lain
import Button from "@/views/components/GeneralButton/GeneralButton";
import ProgressBar from "@/views/components/ProgressBar/ProgressBar";
import TimeSelector from "@/views/components/TimeSelector/TimeSelector";
import TimeSelection from "@/views/components/TimePicker/TimePicker";

import styles from "./VerificationDataCompanionScreen.style";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

export default function CompanionDataScreenPage() {
  const { theme } = useTheme();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [pendingNewPreferences, setPendingNewPreferences] = useState<string[]>([]);
  const [cityError, setCityError] = useState("");

  // Fetching logic dihilangkan sesuai permintaan (fokus UI)
  const cities = ["Jakarta", "Surabaya", "Makassar", "Bandung"];
  const preferenceNames = ["Membaca", "Menulis", "Fotografi"];

  const handleCityChange = (val: string) => {
    setSelectedCity(val);
    setCityError("");
  };

  const handleSubmit = () => {
    console.log("Submit ditekan");
  };

  const handleSkip = () => {
    console.log("Skip ditekan");
  };

  return (
    <SecondaryLayout title="Sesuaikan Profil Anda">
      <View
        style={[styles.container, { backgroundColor: theme.colors.primaryBackground }]}
      >
        <ProgressBar
          title="Ceritain Tentang Kamu"
          currentStep={4}
          totalSteps={4}
        />

        <Text style={[styles.subtitle1, { color: theme.colors.secondary }]}>
          Hampir sampai! Bantu kami menyesuaikan pengalaman Anda.
        </Text>

        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Ceritain Kesukaanmu
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Kasih tahu vibe-mu biar TemanZiro bisa rekomendasiin aktivitas dan grup yang pas buat kamu!
        </Text>

        <LocationCard
          title="Kotamu"
          label="Dimana kamu tinggal?"
          cities={cities}
          value={selectedCity}
          onValueChange={handleCityChange}
        />
        {!!cityError && (
          <Text style={styles.errorText}>{cityError}</Text>
        )}

        <PersonaSelector
          preference_data={preferenceNames}
          value={selectedPreferences}
          onMinatChange={setSelectedPreferences}
          onNewPreferencesChange={setPendingNewPreferences}
          showAddButton={true}
        />

        <InterestSelector />
        <TimeSelector />
        <TimeSelection />

        <View style={styles.buttonContainer}>
          <GeneralButton
            variant="primary"
            style={styles.button}
            onClick={handleSubmit}
          >
            Mulai
          </GeneralButton>
          <Button
            variant="ghost"
            shadow="none"
            style={styles.buttonskip}
            onClick={handleSkip}
          >
            Lewati
          </Button>
        </View>
      </View>
    </SecondaryLayout>
  );
}