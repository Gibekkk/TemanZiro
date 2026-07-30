import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "./AddOnsRejected.style";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/controllers/hooks/useTheme";
import ProfileMenuCard from "@/views/components/ProfileMenuCard/ProfileMenuCard";
import ProfileMenuItem from "@/views/components/ProfileMenuItem/ProfileMenuItem";
import { useCompanionAddOns } from "@/controllers/hooks/Companion/useCompanionAddOns";

export default function AddOnsRejected() {
    const { theme } = useTheme();
    const {
        loading,
        simStatus,
        simRejectionMessage,
        stnkStatus,
        stnkRejectionMessage,
        vehiclePhotoStatus,
        vehicleFrontRejectionMessage,
        vehiclePhotoSideStatus,
        vehicleSideRejectionMessage,
        portfolioRejectionMessage,
    } = useCompanionAddOns();

    if (loading) {
        return (
            <SecondaryLayout title="Data Add-On Ditolak" alignLeft={true} noPadding={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40 }}>
                    <ActivityIndicator size="large" color="#8C7A6B" />
                </View>
            </SecondaryLayout>
        );
    }

    const rejectedItems = [];

    if (simStatus === "rejected") {
        rejectedItems.push({
            id: "sim",
            title: "Foto SIM",
            message: simRejectionMessage || "Dokumen SIM ditolak.",
            icon: "card-outline"
        });
    }

    if (stnkStatus === "rejected") {
        rejectedItems.push({
            id: "stnk",
            title: "Foto STNK",
            message: stnkRejectionMessage || "Dokumen STNK ditolak.",
            icon: "document-text-outline"
        });
    }

    if (vehiclePhotoStatus === "rejected") {
        rejectedItems.push({
            id: "vehicleFront",
            title: "Foto Fisik Kendaraan (Tampak Depan)",
            message: vehicleFrontRejectionMessage || "Foto tampak depan ditolak.",
            icon: "car-outline"
        });
    }

    if (vehiclePhotoSideStatus === "rejected") {
        rejectedItems.push({
            id: "vehicleSide",
            title: "Foto Fisik Kendaraan (Tampak Samping)",
            message: vehicleSideRejectionMessage || "Foto tampak samping ditolak.",
            icon: "car-outline"
        });
    }

    if (portfolioRejectionMessage) {
        rejectedItems.push({
            id: "portfolio",
            title: "Link Portfolio/Dokumentasi",
            message: portfolioRejectionMessage,
            icon: "folder-open-outline"
        });
    }

    return (
        <SecondaryLayout title="Data Add-On Ditolak" alignLeft={true} noPadding={true}>
            <View style={styles.headerSection}>
                <Ionicons name="alert-circle-outline" size={50} color={theme.colors.red} />
                <Text style={styles.headerText}>Ditolak</Text>
                <Text style={styles.subHeaderText}>Permohonan Anda tidak disetujui.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeaderTitle}>Alasan Penolakan</Text>
                {rejectedItems.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 20, color: theme.colors.textSecondary || "#64748b" }}>
                        Tidak ada detail alasan penolakan yang ditemukan.
                    </Text>
                ) : (
                    <ProfileMenuCard>
                        {rejectedItems.map((item, index) => (
                            <ProfileMenuItem
                                key={item.id}
                                title={
                                    <View style={{ flex: 1, paddingVertical: 4 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 14, color: theme.colors.textPrimary || "#0f172a", marginBottom: 2 }}>
                                            {item.title}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary || "#64748b" }}>
                                            {item.message}
                                        </Text>
                                    </View>
                                }
                                icon={<Ionicons name={item.icon as any} size={18} color={theme.colors.red || "#ef4444"} />}
                                showArrow={false}
                                isLast={index === rejectedItems.length - 1}
                            />
                        ))}
                    </ProfileMenuCard>
                )}
            </View>
        </SecondaryLayout>
    );
}
