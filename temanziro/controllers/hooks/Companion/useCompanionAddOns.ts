import { useState, useEffect } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import { AddOnRepository } from "@/data/repositories/AddOnRepository";
import { ADD_ON_STATUS } from "@/constants/AddOnConstant";
import { CompanionVehicleModel } from "@/domain/models/AddOnModel";
import {
    USE_DUMMY_DATA,
    DUMMY_DOCUMENTATION_ADDON,
    DUMMY_ADDON_PRICES,
    DUMMY_VEHICLES
} from "@/constants/Config";
import { Alert, Linking } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import * as ImagePicker from "expo-image-picker";

export function useCompanionAddOns() {
    const { theme } = useTheme();
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(true);

    const [documentationActive, setDocumentationActive] = useState(false);
    const [transportActive, setTransportActive] = useState(false);

    const [portfolioLink, setPortfolioLink] = useState("");
    const [documentationVerified, setDocumentationVerified] = useState(false);
    const [portfolioRejectionMessage, setPortfolioRejectionMessage] = useState("");

    const [selectedTab, setSelectedTab] = useState<"motor" | "mobil">("motor");
    const [vehicleType, setVehicleType] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [transportationVerified, setTransportationVerified] = useState(false);

    const [simUrl, setSimUrl] = useState("");
    const [simStatus, setSimStatus] = useState("Belum Unggah");
    const [simRejectionMessage, setSimRejectionMessage] = useState("");
    const [stnkUrl, setStnkUrl] = useState("");
    const [stnkStatus, setStnkStatus] = useState("Belum Unggah");
    const [stnkRejectionMessage, setStnkRejectionMessage] = useState("");
    const [vehicleFrontPhoto, setVehicleFrontPhoto] = useState<string | null>(null);
    const [vehicleFrontPhotoStatus, setVehicleFrontPhotoStatus] = useState("Belum Unggah");
    const [vehicleFrontRejectionMessage, setVehicleFrontRejectionMessage] = useState("");
    const [vehicleSidePhoto, setVehicleSidePhoto] = useState<string | null>(null);
    const [vehicleSidePhotoStatus, setVehicleSidePhotoStatus] = useState("Belum Unggah");
    const [vehicleSideRejectionMessage, setVehicleSideRejectionMessage] = useState("");

    const [simLocalUri, setSimLocalUri] = useState<string | null>(null);
    const [stnkLocalUri, setStnkLocalUri] = useState<string | null>(null);

    const [vehicles, setVehicles] = useState<CompanionVehicleModel[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");


    const handleContactAdmin = () => {
        const adminUrl = "https://wa.me/6281234567890";
        Linking.openURL(adminUrl).catch((err) => {
            console.error("Gagal membuka link hubungi admin:", err);
        });
    };

    const updateSelectedVehicleField = (field: string, value: any) => {
        setVehicles((prev) =>
            prev.map((v) => (v.id === selectedVehicleId ? { ...v, [field]: value } : v))
        );
    };

    const handleSetVehicleType = (val: string) => {
        setVehicleType(val);
        updateSelectedVehicleField("model", val);
    };

    const handleSetPlateNumber = (val: string) => {
        setPlateNumber(val);
        updateSelectedVehicleField("license_plate", val);
    };

    const handleSetSelectedTab = (val: "motor" | "mobil") => {
        setSelectedTab(val);
        updateSelectedVehicleField("type", val);
    };

    const handleSetSimLocalUri = (val: string | null) => {
        setSimLocalUri(val);
        updateSelectedVehicleField("simLocalUri", val);
    };

    const handleSetStnkLocalUri = (val: string | null) => {
        setStnkLocalUri(val);
        updateSelectedVehicleField("stnkLocalUri", val);
    };

    const handleSetVehicleFrontPhoto = (val: string | null) => {
        setVehicleFrontPhoto(val);
        updateSelectedVehicleField("vehicleFrontPhoto", val);
    };

    const handleSetVehicleSidePhoto = (val: string | null) => {
        setVehicleSidePhoto(val);
        updateSelectedVehicleField("vehicleSidePhoto", val);
    };

    const handleSetSimUrl = (val: string) => {
        setSimUrl(val);
        updateSelectedVehicleField("simUrl", val);
    };

    const handleSetSimStatus = (val: string) => {
        setSimStatus(val);
        updateSelectedVehicleField("simStatus", val);
    };

    const handleSetStnkUrl = (val: string) => {
        setStnkUrl(val);
        updateSelectedVehicleField("stnkUrl", val);
    };

    const handleSetStnkStatus = (val: string) => {
        setStnkStatus(val);
        updateSelectedVehicleField("stnkStatus", val);
    };

    const handleSetVehicleFrontPhotoStatus = (val: string) => {
        setVehicleFrontPhotoStatus(val);
        updateSelectedVehicleField("vehicleFrontPhotoStatus", val);
    };

    const handleSetVehicleSidePhotoStatus = (val: string) => {
        setVehicleSidePhotoStatus(val);
        updateSelectedVehicleField("vehicleSidePhotoStatus", val);
    };

    const handleUploadSIM = () => {
        Alert.alert("Unggah Dokumen", "Pilih file SIM Anda untuk diunggah", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permissionResult.granted) {
                        Alert.alert("Izin Ditolak", "Izin kamera diperlukan untuk memotret dokumen.");
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!result.canceled) {
                        setSimLocalUri(result.assets[0].uri);
                    }
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 0.8
                    });
                    if (!result.canceled) {
                        setSimLocalUri(result.assets[0].uri);
                    }
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handleUploadSTNK = () => {
        Alert.alert("Unggah Dokumen", "Pilih file STNK Anda untuk diunggah", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permissionResult.granted) {
                        Alert.alert("Izin Ditolak", "Izin kamera diperlukan untuk memotret dokumen.");
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!result.canceled) {
                        setStnkLocalUri(result.assets[0].uri);
                    }
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 0.8
                    });
                    if (!result.canceled) {
                        setStnkLocalUri(result.assets[0].uri);
                    }
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handleUploadVehicleFrontPhoto = () => {
        Alert.alert("Unggah Foto Depan", "Ambil foto tampak depan kendaraan Anda", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permissionResult.granted) {
                        Alert.alert("Izin Ditolak", "Izin kamera diperlukan untuk memotret kendaraan.");
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!result.canceled) {
                        handleSetVehicleFrontPhoto(result.assets[0].uri);
                    }
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 0.8
                    });
                    if (!result.canceled) {
                        handleSetVehicleFrontPhoto(result.assets[0].uri);
                    }
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };

    const handleUploadVehicleSidePhoto = () => {
        Alert.alert("Unggah Foto Samping", "Ambil foto tampak samping kendaraan Anda", [
            {
                text: "Kamera",
                onPress: async () => {
                    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permissionResult.granted) {
                        Alert.alert("Izin Ditolak", "Izin kamera diperlukan untuk memotret kendaraan.");
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
                    if (!result.canceled) {
                        handleSetVehicleSidePhoto(result.assets[0].uri);
                    }
                }
            },
            {
                text: "Galeri",
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        quality: 0.8
                    });
                    if (!result.canceled) {
                        handleSetVehicleSidePhoto(result.assets[0].uri);
                    }
                }
            },
            { text: "Batal", style: "cancel" }
        ]);
    };


    // Vehicle Selection Management
    const selectVehicle = (id: string) => {
        if (id === "new") {
            setSelectedVehicleId("new");
            setVehicleType("");
            setPlateNumber("");
            setSelectedTab("motor");
            setTransportationVerified(false);
            setSimUrl("");
            setSimStatus("Belum Unggah");
            setSimRejectionMessage("");
            setStnkUrl("");
            setStnkStatus("Belum Unggah");
            setStnkRejectionMessage("");
            setVehicleFrontPhoto(null);
            setVehicleFrontPhotoStatus("Belum Unggah");
            setVehicleFrontRejectionMessage("");
            setVehicleSidePhoto(null);
            setVehicleSidePhotoStatus("Belum Unggah");
            setVehicleSideRejectionMessage("");
            setSimLocalUri(null);
            setStnkLocalUri(null);
            return;
        }

        const vehicle = vehicles.find((v) => v.id === id);
        if (vehicle) {
            setSelectedVehicleId(id);
            setVehicleType(vehicle.model || "");
            setPlateNumber(vehicle.license_plate || "");
            setSelectedTab((vehicle.type as "motor" | "mobil") || "motor");
            setTransportationVerified(vehicle.is_verified || false);
            setSimUrl(vehicle.url_sim || "");
            setSimStatus(vehicle.sim_status || "Belum Unggah");
            setSimRejectionMessage(vehicle.sim_rejection_message || "");
            setStnkUrl(vehicle.url_stnk || "");
            setStnkStatus(vehicle.stnk_status || "Belum Unggah");
            setStnkRejectionMessage(vehicle.stnk_rejection_message || "");
            setVehicleFrontPhoto(vehicle.url_vehicle_front_photo || null);
            setVehicleFrontPhotoStatus(vehicle.vehicle_front_photo_status || "Belum Unggah");
            setVehicleFrontRejectionMessage(vehicle.vehicle_front_rejection_message || "");
            setVehicleSidePhoto(vehicle.url_vehicle_side_photo || null);
            setVehicleSidePhotoStatus(vehicle.vehicle_side_photo_status || "Belum Unggah");
            setVehicleSideRejectionMessage(vehicle.vehicle_side_photo_rejection_message || "");
            setSimLocalUri((vehicle as any).simLocalUri || null);
            setStnkLocalUri((vehicle as any).stnkLocalUri || null);
        }
    };

    const toggleVehicleActive = async (id: string) => {
        const targetVehicle = vehicles.find((v) => v.id === id);
        if (targetVehicle) {
            // Check verification only when attempting to activate (transitioning from inactive to active)
            if (!targetVehicle.is_active && !targetVehicle.is_verified) {
                Alert.alert("Gagal", "Kendaraan tidak bisa diaktifkan karena belum terverifikasi.");
                return;
            }
        }

        const updated = vehicles.map((v) => {
            if (v.id === id) {
                return { ...v, is_active: !v.is_active };
            }
            return { ...v, is_active: false };
        });
        setVehicles(updated);

        // Load this vehicle into flat state variables
        selectVehicle(id);

        if (!USE_DUMMY_DATA && currentUser?.uid) {
            try {
                await AddOnRepository.saveVehicles(currentUser.uid, updated);
            } catch (error) {
                console.error("Gagal menyimpan perubahan kendaraan aktif:", error);
            }
        }
    };

    const ensureNewVehicleExists = () => {
        if (selectedVehicleId === "new") {
            const newId = "new_" + Date.now();
            const newVehicle = {
                id: newId,
                type: selectedTab,
                model: vehicleType,
                license_plate: plateNumber,
                is_verified: false,
                is_active: true,
                sim_status: "Belum Unggah",
                stnk_status: "Belum Unggah",
                vehicle_front_photo_status: "Belum Unggah",
                vehicle_side_photo_status: "Belum Unggah"
            };
            setVehicles((prev) => [...prev.map(v => ({ ...v, is_active: false })), newVehicle]);
            setSelectedVehicleId(newId);
            return newId;
        }
        return selectedVehicleId;
    };

    // Data Loading & Effects
    useEffect(() => {
        let isMounted = true;

        async function loadDummyData() {
            setDocumentationActive(true);
            setTransportActive(false);
            setPortfolioLink(DUMMY_DOCUMENTATION_ADDON.url_portfolio);
            setDocumentationVerified(DUMMY_DOCUMENTATION_ADDON.is_accepted);
            setPortfolioRejectionMessage(DUMMY_DOCUMENTATION_ADDON.portfolio_rejection_message || "");

            setVehicles(DUMMY_VEHICLES);
            
            const revisionVehicle = DUMMY_VEHICLES.find(
                (v: any) =>
                    v.sim_status === "revision" ||
                    v.stnk_status === "revision" ||
                    v.vehicle_front_photo_status === "revision" ||
                    v.vehicle_side_photo_status === "revision"
            );
            const activeVehicle = revisionVehicle || DUMMY_VEHICLES.find(v => v.is_active) || DUMMY_VEHICLES[0];
            
            setSelectedVehicleId(activeVehicle.id);
            setSelectedTab(activeVehicle.type as "motor" | "mobil");
            setVehicleType(activeVehicle.model);
            setPlateNumber(activeVehicle.license_plate);
            setTransportationVerified(activeVehicle.is_verified);
            setSimUrl(activeVehicle.url_sim || "");
            setSimStatus(activeVehicle.sim_status || "Belum Unggah");
            setSimRejectionMessage(activeVehicle.sim_rejection_message || "");
            setStnkUrl(activeVehicle.url_stnk || "");
            setStnkStatus(activeVehicle.stnk_status || "Belum Unggah");
            setStnkRejectionMessage(activeVehicle.stnk_rejection_message || "");
            setVehicleFrontPhoto(activeVehicle.url_vehicle_front_photo || null);
            setVehicleFrontPhotoStatus(activeVehicle.vehicle_front_photo_status || "Belum Unggah");
            setVehicleFrontRejectionMessage(activeVehicle.vehicle_front_rejection_message || "");
            setVehicleSidePhoto(activeVehicle.url_vehicle_side_photo || null);
            setVehicleSidePhotoStatus(activeVehicle.vehicle_side_photo_status || "Belum Unggah");
            setVehicleSideRejectionMessage(activeVehicle.vehicle_side_photo_rejection_message || "");
        }

        async function loadProductionData(companionUid: string) {
            const addOns = await AddOnRepository.getAddOns(companionUid);

            if (!isMounted) return;

            if (addOns) {
                setDocumentationActive(!!addOns.is_active_documentation);
                setTransportActive(!!addOns.is_active_transportation);

                if (addOns.documentation) {
                    setPortfolioLink(addOns.documentation.url_portfolio || "");
                    setDocumentationVerified(addOns.documentation.is_accepted || false);
                    setPortfolioRejectionMessage(addOns.documentation.portfolio_rejection_message || "");
                }

                const loadedVehicles = addOns.vehicles || [];
                setVehicles(loadedVehicles);

                if (loadedVehicles.length > 0) {
                    const revisionVehicle = loadedVehicles.find(
                        (v: any) =>
                            v.sim_status === "revision" ||
                            v.stnk_status === "revision" ||
                            v.vehicle_front_photo_status === "revision" ||
                            v.vehicle_side_photo_status === "revision"
                    );
                    const activeVehicle = revisionVehicle || loadedVehicles.find((v: any) => v.is_active) || loadedVehicles[0];
                    
                    setSelectedVehicleId(activeVehicle.id);
                    setSelectedTab(activeVehicle.type as "motor" | "mobil");
                    setVehicleType(activeVehicle.model);
                    setPlateNumber(activeVehicle.license_plate);
                    setTransportationVerified(activeVehicle.is_verified);
                    setSimUrl(activeVehicle.url_sim || "");
                    setSimStatus(activeVehicle.sim_status || "Belum Unggah");
                    setSimRejectionMessage(activeVehicle.sim_rejection_message || "");
                    setStnkUrl(activeVehicle.url_stnk || "");
                    setStnkStatus(activeVehicle.stnk_status || "Belum Unggah");
                    setStnkRejectionMessage(activeVehicle.stnk_rejection_message || "");
                    setVehicleFrontPhoto(activeVehicle.url_vehicle_front_photo || null);
                    setVehicleFrontPhotoStatus(activeVehicle.vehicle_front_photo_status || "Belum Unggah");
                    setVehicleFrontRejectionMessage(activeVehicle.vehicle_front_rejection_message || "");
                    setVehicleSidePhoto(activeVehicle.url_vehicle_side_photo || null);
                    setVehicleSidePhotoStatus(activeVehicle.vehicle_side_photo_status || "Belum Unggah");
                    setVehicleSideRejectionMessage(activeVehicle.vehicle_side_photo_rejection_message || "");
                }
            }
        }

        async function loadData() {
            setLoading(true);
            try {
                if (USE_DUMMY_DATA) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    if (!isMounted) return;
                    await loadDummyData();
                } else {
                    if (currentUser?.uid) {
                        await loadProductionData(currentUser.uid);
                    }
                }
            } catch (error) {
                console.error("Gagal memuat data addon:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [currentUser]);

    // Active Status Switches Toggles Handlers
    const handleToggleDocumentation = async (value: boolean) => {
        if (value && !documentationVerified) {
            Alert.alert("Gagal", "Add-on dokumentasi tidak bisa diaktifkan karena dokumen/portfolio Anda belum terverifikasi.");
            return;
        }
        setDocumentationActive(value);
        if (!USE_DUMMY_DATA && currentUser?.uid) {
            try {
                await AddOnRepository.updateAddOnActiveStatus(currentUser.uid, "documentation", value);
            } catch (error) {
                console.error("Gagal memperbarui status aktif dokumentasi:", error);
                Alert.alert("Gagal", "Gagal memperbarui status keaktifan dokumentasi.");
                setDocumentationActive(!value);
            }
        }
    };

    const handleToggleTransport = async (value: boolean) => {
        if (value) {
            const hasVerifiedVehicle = vehicles.some((v) => v.is_verified);
            if (!hasVerifiedVehicle) {
                Alert.alert("Gagal", "Add-on transportasi tidak bisa diaktifkan karena belum ada kendaraan terdaftar yang terverifikasi.");
                return;
            }
        }
        setTransportActive(value);
        if (!USE_DUMMY_DATA && currentUser?.uid) {
            try {
                await AddOnRepository.updateAddOnActiveStatus(currentUser.uid, "transportation", value);
            } catch (error) {
                console.error("Gagal memperbarui status aktif transportasi:", error);
                Alert.alert("Gagal", "Gagal memperbarui status keaktifan transportasi.");
                setTransportActive(!value);
            }
        }
    };

    // Submission Request Handler
    const handleSubmitRequest = async () => {
        const uid = currentUser?.uid || "dummy_uid";
        const currentActiveId = ensureNewVehicleExists();

        if (USE_DUMMY_DATA) {
            setVehicles(prev => prev.map(v => {
                if (v.id === currentActiveId) {
                    return {
                        ...v,
                        model: vehicleType,
                        license_plate: plateNumber,
                        type: selectedTab,
                        url_sim: simLocalUri || v.url_sim,
                        url_stnk: stnkLocalUri || v.url_stnk,
                        url_vehicle_front_photo: vehicleFrontPhoto || v.url_vehicle_front_photo,
                        url_vehicle_side_photo: vehicleSidePhoto || v.url_vehicle_side_photo,
                        sim_status: simLocalUri ? "pending" : v.sim_status,
                        stnk_status: stnkLocalUri ? "pending" : v.stnk_status,
                        vehicle_front_photo_status: (vehicleFrontPhoto && !vehicleFrontPhoto.startsWith("http")) ? "pending" : v.vehicle_front_photo_status,
                        vehicle_side_photo_status: (vehicleSidePhoto && !vehicleSidePhoto.startsWith("http")) ? "pending" : v.vehicle_side_photo_status
                    };
                }
                return v;
            }));
            Alert.alert("Pengajuan Dikirim (Dummy)", "Pengajuan aktivasi Add-on Anda sedang diproses oleh tim internal.");
            return true;
        }

        try {
            setLoading(true);

            if (portfolioLink) {
                await AddOnRepository.updateDocumentationDetails(uid, {
                    url_portfolio: portfolioLink,
                    is_accepted: false
                });
            }

            let finalSimUrl = simUrl;
            let finalStnkUrl = stnkUrl;
            let finalVehicleFrontPhotoUrl = vehicleFrontPhoto;
            let finalVehicleSidePhotoUrl = vehicleSidePhoto;

            if (simLocalUri) {
                finalSimUrl = await AddOnRepository.uploadTransportationFile(uid, "sim", simLocalUri, "sim.jpg");
            }
            if (stnkLocalUri) {
                finalStnkUrl = await AddOnRepository.uploadTransportationFile(uid, "stnk", stnkLocalUri, "stnk.jpg");
            }
            if (vehicleFrontPhoto && !vehicleFrontPhoto.startsWith("http")) {
                finalVehicleFrontPhotoUrl = await AddOnRepository.uploadTransportationFile(uid, "vehicle_front", vehicleFrontPhoto, "front.jpg");
            }
            if (vehicleSidePhoto && !vehicleSidePhoto.startsWith("http")) {
                finalVehicleSidePhotoUrl = await AddOnRepository.uploadTransportationFile(uid, "vehicle_side", vehicleSidePhoto, "side.jpg");
            }

            const updatedVehicles = vehicles.map(v => {
                if (v.id === currentActiveId) {
                    return {
                        ...v,
                        model: vehicleType,
                        license_plate: plateNumber,
                        type: selectedTab,
                        url_sim: finalSimUrl,
                        url_stnk: finalStnkUrl,
                        url_vehicle_front_photo: finalVehicleFrontPhotoUrl,
                        url_vehicle_side_photo: finalVehicleSidePhotoUrl,
                        sim_status: simLocalUri ? "pending" : simStatus,
                        stnk_status: stnkLocalUri ? "pending" : stnkStatus,
                        vehicle_front_photo_status: (vehicleFrontPhoto && !vehicleFrontPhoto.startsWith("http")) ? "pending" : vehicleFrontPhotoStatus,
                        vehicle_side_photo_status: (vehicleSidePhoto && !vehicleSidePhoto.startsWith("http")) ? "pending" : vehicleSidePhotoStatus,
                        is_verified: false
                    };
                }
                return v;
            });

            await AddOnRepository.saveVehicles(uid, updatedVehicles);
            await AddOnRepository.updateGeneralAddonStatus(uid, ADD_ON_STATUS.PENDING);

            Alert.alert("Pengajuan Dikirim", "Pengajuan aktivasi Add-on Anda sedang diproses oleh tim internal.");
            return true;
        } catch (error) {
            console.error("Error submitting addon request:", error);
            Alert.alert("Gagal", "Terjadi kesalahan saat mengirimkan pengajuan.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getRevisingAddOnType = (): "documentation" | "transportation" | null => {
        if (
            simStatus === "revision" ||
            stnkStatus === "revision" ||
            vehicleFrontPhotoStatus === "revision" ||
            vehicleSidePhotoStatus === "revision"
        ) {
            return "transportation";
        }
        if (portfolioRejectionMessage) {
            return "documentation";
        }
        return null;
    };

    return {
        theme,
        loading,
        documentationActive,
        setDocumentationActive: handleToggleDocumentation,
        transportActive,
        setTransportActive: handleToggleTransport,
        portfolioLink,
        setPortfolioLink,
        documentationVerified,
        portfolioRejectionMessage,
        selectedTab,
        setSelectedTab: handleSetSelectedTab,
        vehicleType,
        setVehicleType: handleSetVehicleType,
        plateNumber,
        setPlateNumber: handleSetPlateNumber,
        transportationVerified,
        simUrl,
        setSimUrl: handleSetSimUrl,
        simStatus,
        setSimStatus: handleSetSimStatus,
        simRejectionMessage,
        stnkUrl,
        setStnkUrl: handleSetStnkUrl,
        stnkStatus,
        setStnkStatus: handleSetStnkStatus,
        stnkRejectionMessage,
        setVehicleFrontPhoto: handleSetVehicleFrontPhoto,
        vehiclePhoto: vehicleFrontPhoto,
        setVehiclePhoto: handleSetVehicleFrontPhoto,
        vehicleFrontPhotoStatus,
        vehiclePhotoStatus: vehicleFrontPhotoStatus,
        setVehicleFrontPhotoStatus: handleSetVehicleFrontPhotoStatus,
        vehicleFrontRejectionMessage,
        vehicleSidePhoto,
        vehiclePhotoSide: vehicleSidePhoto,
        setVehicleSidePhoto: handleSetVehicleSidePhoto,
        setVehiclePhotoSide: handleSetVehicleSidePhoto,
        vehicleSidePhotoStatus,
        vehiclePhotoSideStatus: vehicleSidePhotoStatus,
        vehicleSideRejectionMessage,
        simLocalUri,
        setSimLocalUri: handleSetSimLocalUri,
        stnkLocalUri,
        setStnkLocalUri: handleSetStnkLocalUri,
        handleSubmitRequest,
        revisingAddOnType: getRevisingAddOnType(),
        vehicles,
        selectedVehicleId,
        selectVehicle,
        toggleVehicleActive,
        addonPrices: DUMMY_ADDON_PRICES,
        handleSetVehicleSidePhotoStatus,
        handleContactAdmin,
        handleUploadSIM,
        handleUploadSTNK,
        handleUploadVehicleFrontPhoto,
        handleUploadVehicleSidePhoto
    };
}
