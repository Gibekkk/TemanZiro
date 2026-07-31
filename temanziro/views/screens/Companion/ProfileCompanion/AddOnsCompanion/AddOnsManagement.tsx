import React from "react";
import { View, Text, Switch, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import Feather from "@react-native-vector-icons/feather/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { useCompanionAddOns } from "@/controllers/hooks/Companion/useCompanionAddOns";
import AddOnNew from "@/views/components/AddOnNew/AddOnNew";
import styles from "./AddOnsManagement.style";

export default function AddOnsManagement() {
    const router = useRouter();

    const {
        loading,
        documentationActive,
        setDocumentationActive,
        transportActive,
        setTransportActive,
        portfolioLink,
        vehicles,
        toggleVehicleActive,
        handleContactAdmin,
        selectVehicle
    } = useCompanionAddOns();

    const colors = {
        primary: "#8C7A6B",
        brandOrange: "#9C430B",
        divider: "#F1ECE5",
    };

    if (loading) {
        return (
            <SecondaryLayout title="Kelola Add-ons" alignLeft={true} noPadding={true}>
                <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SecondaryLayout>
        );
    }

    const hasAddOns = !!portfolioLink || (vehicles && vehicles.length > 0);

    if (!hasAddOns) {
        return (
            <SecondaryLayout title="Kelola Add-ons" alignLeft={true} noPadding={true}>
                <AddOnNew
                    onAddDocumentation={() => {
                        router.push("/(tabs_companion)/(profile)/addons-documentation");
                    }}
                    onAddTransportation={() => {
                        selectVehicle("new");
                        router.push("/(tabs_companion)/(profile)/addons-transportation");
                    }}
                />
            </SecondaryLayout>
        );
    }

    return (
        <SecondaryLayout title="Kelola Add-ons" alignLeft={true} noPadding={true}>
            <View style={styles.container}>

                {/* STATUS AKTIF SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeaderTitle}>STATUS AKTIF</Text>
                    <View style={styles.card}>
                        <View style={styles.itemRow}>
                            <View style={styles.leftSection}>
                                <View style={[styles.iconWrapper, { backgroundColor: "#FFF0E6" }]}>
                                    <Feather name="aperture" size={20} color="#E96100" />
                                </View>
                                <Text style={styles.itemTitle}>Add-on Dokumentasi</Text>
                            </View>
                            <Switch
                                value={documentationActive}
                                onValueChange={setDocumentationActive}
                                trackColor={{ false: "#E2E8F0", true: colors.brandOrange }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#E2E8F0"
                            />
                        </View>
                        
                        <View style={styles.divider} />

                        <View style={styles.itemRow}>
                            <View style={styles.leftSection}>
                                <View style={styles.iconWrapper}>
                                    <MaterialCommunityIcons name="moped" size={20} color="#0066CC" />
                                </View>
                                <Text style={styles.itemTitle}>Add-on Transportasi</Text>
                            </View>
                            <Switch
                                value={transportActive}
                                onValueChange={setTransportActive}
                                trackColor={{ false: "#E2E8F0", true: colors.brandOrange }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#E2E8F0"
                            />
                        </View>
                    </View>
                </View>

                {/* DETAIL DOKUMENTASI TERDAFTAR SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeaderTitle}>DETAIL DOKUMENTASI TERDAFTAR</Text>
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.itemRow}
                            onPress={() => {
                                router.push("/(tabs_companion)/(profile)/addons-transportation");
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.leftSection}>
                                <View style={styles.iconWrapper }>
                                    <Feather name="file-text" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>Link Portofolio</Text>
                                    <View style={styles.linkRow}>
                                        <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="tail">
                                            {portfolioLink || "https://drive.google.com/..."}
                                        </Text>
                                        <Feather name="edit-2" size={12} color={colors.brandOrange} style={styles.editIcon} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.itemRow}
                            onPress={() => {
                                selectVehicle("new");
                                router.push("/(tabs_companion)/(profile)/addons-documentation");
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.leftSection}>
                                <View style={[styles.iconWrapper, { backgroundColor: "transparent" }]}>
                                    <Feather name="plus" size={20} color={colors.brandOrange} />
                                </View>
                                <Text style={styles.addVehicleText}>Tambahkan Portfolio</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* DETAIL KENDARAAN TERDAFTAR SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeaderTitle}>DETAIL KENDARAAN TERDAFTAR</Text>
                    <View style={styles.card}>
                        {vehicles && vehicles.length > 0 ? (
                            vehicles.map((v, idx) => (
                                <View key={v.id || idx}>
                                    <View style={styles.itemRow}>
                                        <View style={styles.leftSection}>
                                            <View style={[styles.iconWrapper, { backgroundColor: "#FAF5EF" }]}>
                                                <MaterialCommunityIcons 
                                                    name={v.type === "mobil" ? "car" : "motorbike"} 
                                                    size={20} 
                                                    color={colors.primary} 
                                                />
                                            </View>
                                            <View style={styles.textContainer}>
                                                <View style={styles.titleWithBadgeRow}>
                                                    <Text style={styles.vehicleModelText} numberOfLines={1}>
                                                        {v.model || "Kendaraan"}
                                                    </Text>
                                                    <View style={[
                                                        styles.statusBadge,
                                                        v.is_verified ? styles.verifiedBadge : styles.unverifiedBadge
                                                    ]}>
                                                        <Text style={[
                                                            styles.statusBadgeText,
                                                            v.is_verified ? styles.verifiedBadgeText : styles.unverifiedBadgeText
                                                        ]}>
                                                            {v.is_verified ? "TERVERIFIKASI" : "BELUM VERIFIKASI"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.licensePlateText}>
                                                    {v.license_plate || "-"}
                                                </Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={v.is_active}
                                            onValueChange={() => toggleVehicleActive(v.id)}
                                            trackColor={{ false: "#E2E8F0", true: colors.brandOrange }}
                                            thumbColor="#FFFFFF"
                                            ios_backgroundColor="#E2E8F0"
                                        />
                                    </View>
                                    
                                    <View style={styles.divider} />
                                </View>
                            ))
                        ) : null}

                        {/* Tambahkan Kendaraan Button Row */}
                        <TouchableOpacity
                            style={styles.itemRow}
                            onPress={() => {
                                selectVehicle("new");
                                router.push("/(tabs_companion)/(profile)/addons-transportation");
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.leftSection}>
                                <View style={[styles.iconWrapper, { backgroundColor: "transparent" }]}>
                                    <Feather name="plus" size={20} color={colors.brandOrange} />
                                </View>
                                <Text style={styles.addVehicleText}>Tambahkan Kendaraan</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* BOTTOM INFO & ACTION */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Data ini bersifat permanen dan sudah{"\n"}diverifikasi oleh tim internal.
                    </Text>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={handleContactAdmin}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.linkTextButton}>Hubungi Admin untuk ubah data</Text>
                        <Feather name="external-link" size={14} color={colors.brandOrange} />
                    </TouchableOpacity>
                </View>

            </View>
        </SecondaryLayout>
    );
}
