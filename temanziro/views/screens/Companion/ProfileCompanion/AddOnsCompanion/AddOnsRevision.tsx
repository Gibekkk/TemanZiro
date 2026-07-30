import React from "react";
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import Feather from "@react-native-vector-icons/feather/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import * as ImagePicker from "expo-image-picker";
import { useCompanionAddOns } from "@/controllers/hooks/Companion/useCompanionAddOns";
import styles from "./AddOnsRevision.style";
import { RevisionItem } from "@/views/components/AddOnRevisionItem/AddOnRevisionItem";

export default function AddOnsRevision() {
    const router = useRouter();

    const {
        theme,
        loading,
        simUrl,
        simStatus,
        simRejectionMessage,
        stnkUrl,
        stnkStatus,
        stnkRejectionMessage,
        vehiclePhotoStatus,
        vehicleFrontRejectionMessage,
        setVehiclePhotoSide,
        vehiclePhotoSideStatus,
        vehicleSideRejectionMessage,
        portfolioLink,
        setPortfolioLink,
        portfolioRejectionMessage,
        setSimLocalUri,
        setStnkLocalUri,
        setVehiclePhoto,
        handleSubmitRequest,
        revisingAddOnType,
    } = useCompanionAddOns();

    const handlePickSIM = () => {
        Alert.alert("Unggah SIM", "Pilih berkas SIM Anda:", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permission = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permission.granted) return;
                    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setSimLocalUri(res.assets[0].uri);
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setSimLocalUri(res.assets[0].uri);
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handlePickSTNK = () => {
        Alert.alert("Unggah STNK", "Pilih berkas STNK Anda:", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permission = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permission.granted) return;
                    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setStnkLocalUri(res.assets[0].uri);
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setStnkLocalUri(res.assets[0].uri);
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handlePickVehicleFront = () => {
        Alert.alert("Unggah Foto Kendaraan (Tampak Depan)", "Pilih foto tampak depan kendaraan:", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permission = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permission.granted) return;
                    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setVehiclePhoto(res.assets[0].uri);
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setVehiclePhoto(res.assets[0].uri);
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handlePickVehicleSide = () => {
        Alert.alert("Unggah Foto Kendaraan (Tampak Samping)", "Pilih foto tampak samping kendaraan:", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permission = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permission.granted) return;
                    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setVehiclePhotoSide(res.assets[0].uri);
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
                    if (!res.canceled) setVehiclePhotoSide(res.assets[0].uri);
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handleSaveRevision = async () => {
        const success = await handleSubmitRequest();
        if (success) {
            router.back();
        }
    };

    if (loading) {
        return (
            <SecondaryLayout title="Perbaiki Data Add-On" alignLeft={true} noPadding={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#8C7A6B" />
                </View>
            </SecondaryLayout>
        );
    }
    const isStnkRevision = stnkStatus === "revision";
    const isSimRevision = simStatus === "revision";
    const isVehicleFrontRevision = vehiclePhotoStatus === "revision";
    const isVehicleSideRevision = vehiclePhotoSideStatus === "revision";

    const getFilename = (url: string, defaultName: string) => {
        if (!url) return defaultName;
        return url.substring(url.lastIndexOf("/") + 1) || defaultName;
    };

    const vehicleDocs = [];
    if (isSimRevision) {
        vehicleDocs.push({
            id: "sim",
            title: "Foto SIM",
            value: getFilename(simUrl, "Foto SIM"),
            status: simStatus,
            rejectionMessage: simRejectionMessage,
            icon: <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8C7A6B" />,
            onUploadPress: handlePickSIM
        });
    }
    if (isStnkRevision) {
        vehicleDocs.push({
            id: "stnk",
            title: "Foto STNK",
            value: getFilename(stnkUrl, "Foto STNK"),
            status: stnkStatus,
            rejectionMessage: stnkRejectionMessage,
            icon: <Feather name="file-text" size={20} color="#8C7A6B" />,
            onUploadPress: handlePickSTNK
        });
    }

    return (
        <SecondaryLayout title="Perbaiki Data Add-On" alignLeft={true} noPadding={true}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Error / Warning Header Section */}
                <View style={styles.headerSection}>
                    <Feather name="alert-triangle" size={24} color={theme.colors.primary} />
                    <View style={styles.textHeaderWrapper}>
                        <Text style={styles.headerText}>
                            Beberapa dokumen perlu diperbaiki
                        </Text>
                        <Text style={styles.headerBody}>
                            Mohon periksa kembali dokumen yang ditandai merah dan unggah ulang file yang sesuai.
                        </Text>
                    </View>
                </View>

                {revisingAddOnType === "transportation" ? (
                    <>
                        {/* 1. INFORMASI KENDARAAN */}
                        {vehicleDocs.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionHeaderTitle}>INFORMASI KENDARAAN</Text>
                                <View style={styles.cardContainer}>
                                    {vehicleDocs.map((doc, index) => (
                                        <View key={doc.id}>
                                            <RevisionItem
                                                title={doc.title}
                                                value={doc.value}
                                                status={doc.status}
                                                rejectionMessage={doc.rejectionMessage}
                                                icon={doc.icon}
                                                onUploadPress={doc.onUploadPress}
                                            />
                                            {index < vehicleDocs.length - 1 && <View style={styles.cardDivider} />}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* 2. FOTO FISIK KENDARAAN */}
                        {(isVehicleFrontRevision || isVehicleSideRevision) && (
                            <View style={styles.section}>
                                <Text style={styles.sectionHeaderTitle}>FOTO FISIK KENDARAAN</Text>
                                <View style={styles.photoGrid}>
                                    {/* Tampak Depan */}
                                    {isVehicleFrontRevision && (
                                        <TouchableOpacity
                                            style={styles.photoCardRejected}
                                            onPress={handlePickVehicleFront}
                                            activeOpacity={0.8}
                                        >
                                            <Feather name="x-circle" size={20} color="#EF4444" style={styles.cornerOverlay} />
                                            <View style={styles.rejectedPlaceholderContent}>
                                                <Feather name="camera-off" size={24} color="#FCA5A5" />
                                                <View style={styles.rejectedBadgeLabel}>
                                                    <Text style={styles.rejectedBadgeText}>FOTO REVISI</Text>
                                                </View>
                                            </View>
                                            <View style={styles.photoCardFooter}>
                                                <Text style={styles.photoCardFooterTextRed}>Tampak Depan</Text>
                                                {vehicleFrontRejectionMessage ? (
                                                    <Text style={{ fontSize: 10, color: "#EF4444", textAlign: "center", marginTop: 4 }}>
                                                        {vehicleFrontRejectionMessage}
                                                    </Text>
                                                ) : null}
                                                <Text style={styles.photoCardFooterSubText}>Sentuh untuk Unggah</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {/* Tampak Samping */}
                                    {isVehicleSideRevision && (
                                        <TouchableOpacity
                                            style={styles.photoCardRejected}
                                            onPress={handlePickVehicleSide}
                                            activeOpacity={0.8}
                                        >
                                            <Feather name="x-circle" size={20} color="#EF4444" style={styles.cornerOverlay} />
                                            <View style={styles.rejectedPlaceholderContent}>
                                                <Feather name="camera-off" size={24} color="#FCA5A5" />
                                                <View style={styles.rejectedBadgeLabel}>
                                                    <Text style={styles.rejectedBadgeText}>FOTO REVISI</Text>
                                                </View>
                                            </View>
                                            <View style={styles.photoCardFooter}>
                                                <Text style={styles.photoCardFooterTextRed}>Tampak Samping</Text>
                                                {vehicleSideRejectionMessage ? (
                                                    <Text style={{ fontSize: 10, color: "#EF4444", textAlign: "center", marginTop: 4 }}>
                                                        {vehicleSideRejectionMessage}
                                                    </Text>
                                                ) : null}
                                                <Text style={styles.photoCardFooterSubText}>Sentuh untuk Unggah</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {/* DOCUMENTATION REVISION MODE */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderTitle}>PORTOFOLIO DOKUMENTASI</Text>
                            <View style={styles.cardContainer}>
                                <View style={styles.inputGroup}>
                                    <View style={styles.inputLabelWrapper}>
                                        <Text style={styles.inputLabel}>Link Portfolio (Drive)</Text>
                                    </View>
                                    <TextInput
                                        style={styles.textInput}
                                        value={portfolioLink}
                                        onChangeText={setPortfolioLink}
                                        placeholder="https://drive.google.com/..."
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>

                                {portfolioRejectionMessage ? (
                                    <View style={styles.rejectionBox}>
                                        <Text style={styles.rejectionText}>
                                            "{portfolioRejectionMessage}"
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </>
                )}

                {/* Submission Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSaveRevision}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>Simpan Perbaikan</Text>
                </TouchableOpacity>
            </ScrollView>
        </SecondaryLayout>
    );
}