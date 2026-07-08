import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { CameraView } from "expo-camera";
import { useTheme } from "@/controllers/hooks/useTheme";
import { useCamera } from "@/controllers/hooks/useCamera";
import styles from "./CheckInButton.style";

import IconCamera from "@/assets/icon/camerawhite.svg";
import IconQR from "@/assets/icon/scan-qr-code.svg";

interface CheckInButtonProps {
    role: "companion" | "booker" | string;
    bookingId: string;
    onSuccess?: (bookingId: string) => void;
    disabled?: boolean;
}

export default function CheckInButton({
    role,
    bookingId,
    onSuccess,
    disabled = false,
}: CheckInButtonProps) {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [scanned, setScanned] = useState(false);

    const { permission, checkAndRequestPermission } = useCamera();

    const isCompanion = role === "companion";

    const handleOpenPress = async () => {
        if (!isCompanion) {
            const granted = await checkAndRequestPermission();
            if (!granted) {
                Alert.alert(
                    "Izin Kamera Ditolak",
                    "Aplikasi membutuhkan izin kamera untuk melakukan scan QR Code check-in."
                );
                return;
            }
        }
        setScanned(false);
        setModalVisible(true);
    };

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        if (data === bookingId) {
            Alert.alert("Check-In Berhasil", "Booking berhasil dikonfirmasi!", [
                {
                    text: "OK",
                    onPress: () => {
                        setModalVisible(false);
                        if (onSuccess) onSuccess(bookingId);
                    },
                },
            ]);
        } else {
            Alert.alert(
                "QR Code Tidak Cocok",
                "QR Code yang Anda scan tidak sesuai dengan booking ini.",
                [{ text: "Scan Ulang", onPress: () => setScanned(false) }]
            );
        }
    };

    return (
        <>
            {/* Button Launcher */}
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    {
                        borderColor: disabled ? theme.colors.border : theme.colors.primary,
                        backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
                    },
                ]}
                disabled={disabled}
                onPress={handleOpenPress}
            >
                {isCompanion ? (
                    <IconQR width={16} height={16} fill={disabled ? theme.colors.textSecondary : theme.colors.lightText} />
                ) : (
                    <IconCamera width={16} height={16} />
                )}
                <Text
                    style={[
                        styles.buttonText,
                        { color: disabled ? theme.colors.textSecondary : theme.colors.lightText },
                    ]}
                >
                    {isCompanion ? "Tampilkan QR" : "Check-In"}
                </Text>
            </TouchableOpacity>

            {/* Modal Pop-up */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: theme.colors.primaryBackground },
                        ]}
                    >
                        {isCompanion ? (
                            <View style={styles.contentContainer}>
                                <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
                                    QR Code Check-In
                                </Text>
                                <Text
                                    style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}
                                >
                                    Tunjukkan QR Code ini kepada Booker untuk melakukan scan check-in.
                                </Text>

                                <View
                                    style={[
                                        styles.qrContainer,
                                        {
                                            borderColor: theme.colors.border,
                                            backgroundColor: "#ffffff",
                                        },
                                    ]}
                                >
                                    <QRCode
                                        value={bookingId}
                                        size={220}
                                        color={theme.colors.primary}
                                        backgroundColor="#ffffff"
                                    />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.contentContainer}>
                                <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
                                    Scan QR Code
                                </Text>
                                <Text
                                    style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}
                                >
                                    Arahkan kamera ke QR Code milik Companion untuk check-in.
                                </Text>

                                <View style={styles.scannerWrapper}>
                                    {permission?.granted ? (
                                        <CameraView
                                            style={StyleSheet.absoluteFillObject}
                                            facing="back"
                                            barcodeScannerSettings={{
                                                barcodeTypes: ["qr"],
                                            }}
                                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                                        >
                                            {/* Scanner Target Frame Overlay */}
                                            <View style={styles.overlayFrame}>
                                                <View style={styles.scannerBox}>
                                                    <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.secondary }]} />
                                                    <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.secondary }]} />
                                                    <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.secondary }]} />
                                                    <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.secondary }]} />
                                                </View>
                                            </View>
                                        </CameraView>
                                    ) : (
                                        <View style={styles.permissionPlaceholder}>
                                            <ActivityIndicator size="large" color={theme.colors.secondary} />
                                            <Text
                                                style={[
                                                    styles.permissionText,
                                                    { color: theme.colors.textSecondary },
                                                ]}
                                            >
                                                Menyiapkan kamera...
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Close Button */}
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: theme.colors.secondary }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
