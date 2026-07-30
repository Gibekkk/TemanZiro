import React, { useState } from "react";
import { View, Text, Switch, TextInput, TouchableOpacity, Image, Alert, Modal, ScrollView } from "react-native";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import ProfileMenuCard from "@/views/components/ProfileMenuCard/ProfileMenuCard";
import ProfileMenuItem from "@/views/components/ProfileMenuItem/ProfileMenuItem";
import Feather from "@react-native-vector-icons/feather/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import styles from "./AddOnTransportation.style";

import { useCompanionAddOns } from "@/controllers/hooks/Companion/useCompanionAddOns";
import { useRouter } from "expo-router";

export default function AddOnTransportation() {
    const router = useRouter();

    const {
        loading,
        setDocumentationActive,
        setTransportActive,
        portfolioLink,
        setPortfolioLink,
        selectedTab,
        setSelectedTab,
        vehicleType,
        setVehicleType,
        plateNumber,
        setPlateNumber,
        simUrl,
        stnkUrl,
        vehiclePhoto,
        vehiclePhotoSide,
        simLocalUri,
        setSimLocalUri,
        stnkLocalUri,
        setStnkLocalUri,
        handleSubmitRequest,
        vehicles,
        selectedVehicleId,
        selectVehicle,
        toggleVehicleActive,
        handleUploadSIM,
        handleUploadSTNK,
        handleUploadVehicleFrontPhoto,
        handleUploadVehicleSidePhoto
    } = useCompanionAddOns();

    const [showDropdown, setShowDropdown] = useState(false);

    const isSimUploaded = !!simLocalUri || !!simUrl;
    const isStnkUploaded = !!stnkLocalUri || !!stnkUrl;

    // Document uploaders using expo-image-picker
    

    // Submission handler
    const handleSubmit = async () => {
        // Mark active states
        await setTransportActive(isSimUploaded && isStnkUploaded && !!vehiclePhoto && !!vehiclePhotoSide);

        const success = await handleSubmitRequest();
        if (success) {
            router.back();
        }
    };

    return (
        <SecondaryLayout title="Kelola Add-ons" alignLeft={true} noPadding={true}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

                {/* Header Title Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.mainTitle}>Optimalkan Layanan</Text>
                    <Text style={styles.subTitle}>
                        Aktifkan fitur tambahan untuk menjangkau lebih banyak klien dan meningkatkan kredibilitas portofolio Anda.
                    </Text>
                </View>

                {/* SECTION 2: TRANSPORTATION (Custom Component) */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeaderTitle}>TRANSPORTATION</Text>
                    <View style={styles.transCard}>
                        {/* Dropdown Pemilihan Kendaraan */}
                        {/* <View style={[styles.inputGroup, { marginBottom: 12 }]}>
                            <Text style={styles.inputLabel}>PILIH KENDARAAN</Text>
                            <TouchableOpacity
                                style={[styles.inputField, { justifyContent: "center" }]}
                                onPress={() => setShowDropdown(true)}
                                activeOpacity={0.7}
                            >
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <Text style={{ color: selectedVehicleId ? "#0f172a" : "#94a3b8", fontSize: 14 }}>
                                        {selectedVehicleId === "new"
                                            ? "+ Tambah Kendaraan Baru"
                                            : (vehicles.find(v => v.id === selectedVehicleId)
                                                ? `${vehicles.find(v => v.id === selectedVehicleId)?.model} (${vehicles.find(v => v.id === selectedVehicleId)?.license_plate})`
                                                : "Pilih Kendaraan")
                                        }
                                    </Text>
                                    <Feather name="chevron-down" size={16} color="#94a3b8" />
                                </View>
                            </TouchableOpacity>
                        </View> */}

                        {/* Toggle Aktifkan Kendaraan */}
                        {/* {selectedVehicleId !== "new" && selectedVehicleId !== "" && (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingHorizontal: 4 }}>
                                <Text style={{ fontSize: 13, fontWeight: "600", color: "#475569" }}>Gunakan Kendaraan Ini</Text>
                                <Switch
                                    value={vehicles.find(v => v.id === selectedVehicleId)?.is_active || false}
                                    onValueChange={() => toggleVehicleActive(selectedVehicleId)}
                                    trackColor={{ false: "#E2E8F0", true: "#8C7A6B" }}
                                    thumbColor="#FFFFFF"
                                />
                            </View>
                        )} */}

                        {/* Tab Selector */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tabButton, selectedTab === "motor" && styles.tabButtonActive]}
                                onPress={() => setSelectedTab("motor")}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.tabText, selectedTab === "motor" && styles.tabTextActive]}>
                                    Motor
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, selectedTab === "mobil" && styles.tabButtonActive]}
                                onPress={() => setSelectedTab("mobil")}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.tabText, selectedTab === "mobil" && styles.tabTextActive]}>
                                    Mobil
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Document Row: SIM */}
                        <TouchableOpacity style={styles.docRow} onPress={handleUploadSIM} activeOpacity={0.7}>
                            <View style={styles.docLeft}>
                                <View style={styles.docIconWrapper}>
                                    <MaterialCommunityIcons name="card-account-details-outline" size={18} color="#0f172a" />
                                </View>
                                <Text style={styles.docTitle}>SIM</Text>
                            </View>
                            <View style={styles.docRight}>
                                <Text style={[styles.docStatusText, isSimUploaded && { color: "#10b981" }]}>
                                    {isSimUploaded ? "Sudah Diunggah" : "Belum Unggah"}
                                </Text>
                                <IconAngleRight width={18} height={18} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Document Row: STNK */}
                        <TouchableOpacity style={styles.docRow} onPress={handleUploadSTNK} activeOpacity={0.7}>
                            <View style={styles.docLeft}>
                                <View style={styles.docIconWrapper}>
                                    <Feather name="file-text" size={18} color="#0f172a" />
                                </View>
                                <Text style={styles.docTitle}>STNK</Text>
                            </View>
                            <View style={styles.docRight}>
                                <Text style={[styles.docStatusText, isStnkUploaded && { color: "#10b981" }]}>
                                    {isStnkUploaded ? "Sudah Diunggah" : "Belum Unggah"}
                                </Text>
                                <IconAngleRight width={18} height={18} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        {/* Vehicle Image Upload Area */}
                        <Text style={styles.photoLabel}>Foto Kendaraan</Text>
                        <View style={styles.photoGrid}>
                            {/* Slot Tampak Depan */}
                            <TouchableOpacity
                                style={[styles.photoUploadBox, vehiclePhoto !== null && styles.photoUploadBoxActive]}
                                onPress={handleUploadVehicleFrontPhoto}
                                activeOpacity={0.8}
                            >
                                {vehiclePhoto ? (
                                    <Image
                                        source={{ uri: vehiclePhoto }}
                                        style={{ width: "100%", height: "100%", borderRadius: 12 }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <>
                                        <Image
                                            source={require("@/assets/images/icon.png")}
                                            style={styles.photoBgImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.uploadCenter}>
                                            <View style={styles.uploadIconWrapper}>
                                                <Feather name="camera" size={20} color="#E96100" />
                                            </View>
                                            <Text style={styles.uploadText}>Tampak Depan</Text>
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Slot Tampak Samping */}
                            <TouchableOpacity
                                style={[styles.photoUploadBox, vehiclePhotoSide !== null && styles.photoUploadBoxActive]}
                                onPress={handleUploadVehicleSidePhoto}
                                activeOpacity={0.8}
                            >
                                {vehiclePhotoSide ? (
                                    <Image
                                        source={{ uri: vehiclePhotoSide }}
                                        style={{ width: "100%", height: "100%", borderRadius: 12 }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <>
                                        <Image
                                            source={require("@/assets/images/icon.png")}
                                            style={styles.photoBgImage}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.uploadCenter}>
                                            <View style={styles.uploadIconWrapper}>
                                                <Feather name="camera" size={20} color="#E96100" />
                                            </View>
                                            <Text style={styles.uploadText}>Tampak Samping</Text>
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Form Input: Jenis Kendaraan */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>JENIS KENDARAAN</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder={selectedTab === "motor" ? "Contoh: Honda Vario 150" : "Contoh: Toyota Avanza"}
                                placeholderTextColor="#94a3b8"
                                value={vehicleType}
                                onChangeText={setVehicleType}
                            />
                        </View>

                        {/* Form Input: Nomor Plat */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>NOMOR PLAT</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="B 1234 ABC"
                                placeholderTextColor="#94a3b8"
                                value={plateNumber}
                                onChangeText={setPlateNumber}
                                autoCapitalize="characters"
                            />
                        </View>
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

            {/* Custom Dropdown Modal */}
            <Modal visible={showDropdown} transparent animationType="fade">
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "center", alignItems: "center" }}
                    activeOpacity={1}
                    onPress={() => setShowDropdown(false)}
                >
                    <View style={{ backgroundColor: "#FFFFFF", width: "85%", borderRadius: 16, padding: 16 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12, color: "#8C7A6B" }}>
                            Pilih Kendaraan
                        </Text>
                        {vehicles.map((v) => (
                            <TouchableOpacity
                                key={v.id}
                                style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#E2E8F0" }}
                                onPress={() => {
                                    selectVehicle(v.id);
                                    setShowDropdown(false);
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: "#0f172a", fontWeight: v.id === selectedVehicleId ? "bold" : "normal" }}>
                                        {v.model || "Kendaraan Baru"} ({v.type === "motor" ? "Motor" : "Mobil"}) - {v.license_plate || "No Plat"}
                                    </Text>
                                    {v.is_active && (
                                        <View style={{ backgroundColor: "#E6F0FA", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                            <Text style={{ fontSize: 9, color: "#0066CC", fontWeight: "bold" }}>AKTIF</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={{ paddingVertical: 12, marginTop: 4 }}
                            onPress={() => {
                                selectVehicle("new");
                                setShowDropdown(false);
                            }}
                        >
                            <Text style={{ color: "#E96100", fontWeight: selectedVehicleId === "new" ? "bold" : "normal" }}>
                                + Tambah Kendaraan Baru
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SecondaryLayout>
    );
}
