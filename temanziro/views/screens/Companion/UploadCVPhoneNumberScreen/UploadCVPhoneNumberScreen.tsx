import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/controllers/hooks/useTheme";

// Layout & Components
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

// Styles
import styles from "./UploadCVPhoneNumberScreen.style";
import ProgressBar from "@/views/components/ProgressBar/ProgressBar";
import IconUploadCV from "@/assets/icon/uploadcvorange.svg";

export default function CompanionDataScreenPage() {
  const { theme } = useTheme();
  const { role } = useLocalSearchParams();

  // State untuk menyimpan input pengguna (opsional, untuk persiapan integrasi)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fileName, setFileName] = useState(""); // Menyimpan nama file CV jika sudah diunggah

  const handleSubmit = () => {
    console.log("Submit ditekan", { phoneNumber, fileName });
    router.push({
      pathname: "/verification/VerificationDataCompanionScreen_Call",
      params: { role },
    });
  };

  const handleSkip = () => {
    console.log("Skip ditekan");
  };

  return (
    <SecondaryLayout title="Sesuaikan Profil Anda">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: theme.colors.primaryBackground },
        ]}
      >
        <ProgressBar
          title="Masukkan CV & Nomor Telepon"
          currentStep={3}
          totalSteps={4}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
          Lengkapi Berkas Companion
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}
        >
          Untuk menjaga kualitas layanan di TemanZiro, mohon cantumkan kontak
          aktif dan CV/Portofolio terbaikmu.
        </Text>
        {/* 1. Form Nomor Telepon / WhatsApp */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Nomor WhatsApp
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.primaryBackground,
              },
            ]}
          >
            <View
              style={[
                styles.prefixContainer,
                { borderRightColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.prefixText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                +62
              </Text>
            </View>
            <TextInput
              style={[styles.input, { color: theme.colors.primary }]}
              placeholder="81234567890"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>
        {/* 2. Area Upload CV / Portofolio */}
        {/* Update pada File JSX (CompanionDataScreenPage.tsx) Bungkus area setelah
        TouchableOpacity dengan logika pengecekan state untuk menampilkan tombol
        hapus: TypeScript */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.primary }]}>
            Unggah CV atau Portofolio
          </Text>

          <TouchableOpacity
            style={[
              styles.uploadBox,
              {
                borderColor: theme.colors.secondary,
                backgroundColor: `${theme.colors.secondary}10`,
              },
            ]}
            activeOpacity={0.7}
            // Hanya ijinkan tap pilih file JIKA belum ada file yang di-upload
            onPress={() => !fileName && setFileName("CV_Fahri_2026.pdf")}
          >
            <View
              style={[
                styles.iconPlaceholder,
                { backgroundColor: `${theme.colors.secondary}50` },
              ]}
            >
              <IconUploadCV width={24} height={24} />
            </View>

            <Text
              style={[styles.uploadTitle, { color: theme.colors.secondary }]}
            >
              {fileName ? fileName : "Tap untuk memilih file PDF"}
            </Text>

            {!fileName && (
              <Text
                style={[
                  styles.uploadSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Ukuran maksimal 5MB
              </Text>
            )}
          </TouchableOpacity>

          {/* 🌟 TOMBOL HAPUS (Hanya muncul jika fileName tidak kosong) 🌟 */}
          {!!fileName && (
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.6}
              onPress={() => setFileName("")} // 👈 Reset state ke string kosong untuk balik ke kondisi awal
            >
              {/* Kamu bisa ganti teks ini dengan Icon Trash/Tempat Sampah jika mau */}
              <Text
                style={[
                  styles.deleteButtonText,
                  { color: theme.colors.error || "#FF3B30" },
                ]}
              >
                Hapus Berkas
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Spacer agar tombol tetap di bawah jika layar panjang */}
        <View style={styles.spacer} />
        {/* Action Buttons */}
        <GeneralButton
          variant="primary"
          style={styles.buttonSubmit}
          onClick={handleSubmit}
        >
          Kirim
        </GeneralButton>
        <GeneralButton
          variant="ghost"
          shadow="none"
          style={styles.buttonSkip}
          onClick={handleSkip}
        >
          Lewati dulu
        </GeneralButton>
      </ScrollView>
    </SecondaryLayout>
  );
}
