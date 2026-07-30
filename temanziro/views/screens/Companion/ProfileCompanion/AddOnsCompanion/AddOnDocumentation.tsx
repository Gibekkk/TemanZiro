import React, { useState } from "react";
import { View, Text, Switch, TextInput, TouchableOpacity, ScrollView } from "react-native";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import ProfileMenuCard from "@/views/components/ProfileMenuCard/ProfileMenuCard";
import ProfileMenuItem from "@/views/components/ProfileMenuItem/ProfileMenuItem";
import Feather from "@react-native-vector-icons/feather/static";
import styles from "./AddOnDocumentation.style";
import { useCompanionAddOns } from "@/controllers/hooks/Companion/useCompanionAddOns";
import { useRouter } from "expo-router";

export default function AddOnDocumentation() {
    const router = useRouter();

    const {
        loading,
        setDocumentationActive,
        handleSubmitRequest,
    } = useCompanionAddOns();

    // Section 1: UI-only documentation type switches
    const [fotoActive, setFotoActive] = useState(false);
    const [videoActive, setVideoActive] = useState(false);


    // Submission handler
    const handleSubmit = async () => {
        // Mark active states
        await setDocumentationActive(fotoActive || videoActive);

        const success = await handleSubmitRequest();
        if (success) {
            router.back();
        }
    };

    return (
        <SecondaryLayout title="Add-On Dokumentasi" alignLeft={true} noPadding={true}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

                {/* Header Title Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.mainTitle}>Optimalkan Layanan</Text>
                    <Text style={styles.subTitle}>
                        Aktifkan fitur tambahan untuk menjangkau lebih banyak klien dan meningkatkan kredibilitas portofolio Anda.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeaderTitle}>DOCUMENTATION</Text>
                    <ProfileMenuCard>
                        <ProfileMenuItem
                            title="Foto"
                            icon={<Feather name="camera" size={18} color="#0f172a" />}
                            rightElement={
                                <Switch
                                    value={fotoActive}
                                    onValueChange={setFotoActive}
                                    trackColor={{ false: "#E2E8F0", true: "#8C7A6B" }}
                                    thumbColor="#FFFFFF"
                                />
                            }
                        />
                        <ProfileMenuItem
                            title="Video"
                            icon={<Feather name="video" size={18} color="#0f172a" />}
                            rightElement={
                                <Switch
                                    value={videoActive}
                                    onValueChange={setVideoActive}
                                    trackColor={{ false: "#E2E8F0", true: "#8C7A6B" }}
                                    thumbColor="#FFFFFF"
                                />
                            }
                        />
                    </ProfileMenuCard>
                    <View style={[styles.inputGroup, { marginTop: 12, paddingHorizontal: 10 }]}>
                        <Text style={styles.inputLabel}>LINK PORTFOLIO (DRIVE)</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="https://drive.google.com/..."
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                </View>


                {/* BOTTOM WARNING/INFO BANNER */}
                <View style={styles.bannerContainer}>
                    <Feather name="info" size={16} color="#A75D00" />
                    <Text style={styles.bannerText}>
                        Pengajuan akan diproses dalam waktu 1-3 hari kerja. Pastikan dokumen yang diunggah terlihat jelas dan masih berlaku.
                    </Text>
                </View>

                {/* SUBMIT BUTTON */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8} disabled={loading}>
                    <Text style={styles.submitButtonText}>Ajukan Aktivasi</Text>
                </TouchableOpacity>

            </ScrollView>

        </SecondaryLayout>
    );
}
