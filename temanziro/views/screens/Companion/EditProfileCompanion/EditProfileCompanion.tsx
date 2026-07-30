import React, { useState } from "react";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./EditProfileCompanion.style";
import ProfilePicture from "@/views/components/ProfilePicture/ProfilePicture";
import { useCompanionEditProfile } from "@/controllers/hooks/Companion/useCompanionEditProfile";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import EditProfilePopUp from "@/views/components/EditProfilePopUp/EditProfilePopUp";

export default function EditProfileCompanion() {
    const {
        companionProfile,
        profileLoading,
        name, setName,
        gender,
        age,
        location, setLocation,
        cities,
        handleSearchCity,
        handleSave,
    } = useCompanionEditProfile();

    // Modal state controls
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");

    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [tempLocation, setTempLocation] = useState("");

    const getRegisteredDateString = () => {
        const registeredDate = companionProfile?.registered_date;
        if (!registeredDate) return "Jan 2024";
        try {
            const date = typeof registeredDate.toDate === "function"
                ? registeredDate.toDate()
                : new Date(registeredDate as any);
            if (isNaN(date.getTime())) return "Jan 2024";

            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch (error) {
            throw error;
        }
    };

    return (
        <SecondaryLayout title="Edit Profile">
            {/* Profile Avatar Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarWrapper}>
                    <ProfilePicture
                        uri={companionProfile?.url_photoprofile_companion}
                        profileLoading={profileLoading}
                        showCameraIcon={true}
                        onImageSelected={(uri) => {
                            console.log("Selected image uri:", uri);
                        }}
                    />
                    <View style={styles.headerTextWrapper}>
                        <Text style={styles.headerText}>Anggota sejak {getRegisteredDateString()}</Text>
                    </View>
                </View>
            </View>

            {/* Custom Edit Profile Info Table */}
            <View style={styles.menuContainer}>
                <View style={styles.tableCard}>
                    {/* Row 1: Nama */}
                    <TouchableOpacity
                        style={styles.tableRow}
                        activeOpacity={0.7}
                        onPress={() => {
                            setTempName(name);
                            setIsEditingName(true);
                        }}
                    >
                        <View style={styles.labelContainer}>
                            <Text style={styles.rowLabel}>Nama</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.rowValue}>{name || "-"}</Text>
                        </View>
                        <View style={styles.arrowContainer}>
                            <IconAngleRight width={20} height={20} style={styles.arrowIcon} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.tableDivider} />

                    {/* Row 2: Gender */}
                    <View style={styles.tableRow}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.rowLabel}>Gender</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.rowValue}>
                                {gender === "pria" ? "Pria" : gender === "wanita" ? "Wanita" : "Rahasia"}
                            </Text>
                        </View>
                        <View style={styles.arrowContainer} />
                    </View>

                    <View style={styles.tableDivider} />

                    {/* Row 3: Tanggal Lahir  */}
                    <View style={styles.tableRow}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.rowLabel}>Tanggal Lahir</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.rowValue}>{age ? `${age} Tahun` : "-"}</Text>
                        </View>
                        <View style={styles.arrowContainer} />
                    </View>

                    <View style={styles.tableDivider} />

                    {/* Row 4: Kota */}
                    <TouchableOpacity
                        style={styles.tableRow}
                        activeOpacity={0.7}
                        onPress={() => {
                            setTempLocation(location);
                            setIsEditingLocation(true);
                        }}
                    >
                        <View style={styles.labelContainer}>
                            <Text style={styles.rowLabel}>Kota</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.rowValue} numberOfLines={1} ellipsizeMode="tail">
                                {location || "Pilih lokasi"}
                            </Text>
                        </View>
                        <View style={styles.arrowContainer}>
                            <IconAngleRight width={20} height={20} style={styles.arrowIcon} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <GeneralButton
                variant="primary"
                style={styles.button}
                onClick={handleSave}
            >
                Simpan
            </GeneralButton>

            {/* PopUp Edit Nama */}
            <EditProfilePopUp
                visible={isEditingName}
                onClose={() => setIsEditingName(false)}
                onSave={setName}
                title="Ubah Nama"
                value={tempName}
                type="text"
                placeholder="Masukkan nama"
            />

            {/* PopUp Edit Kota */}
            <EditProfilePopUp
                visible={isEditingLocation}
                onClose={() => setIsEditingLocation(false)}
                onSave={setLocation}
                title="Ubah Kota"
                value={tempLocation}
                type="location"
                placeholder="Cari kota/lokasi"
                cities={cities}
                onSearchCity={handleSearchCity}
            />
        </SecondaryLayout>
    );
}