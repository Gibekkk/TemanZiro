import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import MainLayoutCompanion from "@/views/layouts/MainLayout/MainLayoutCompanion";
import ProfilePicture from "@/views/components/ProfilePicture/ProfilePicture";
import ProfileMenuCard from "@/views/components/ProfileMenuCard/ProfileMenuCard";
import ProfileMenuItem from "@/views/components/ProfileMenuItem/ProfileMenuItem";
import KycCard from "@/views/components/KycCard/KycCard";
import { useCompanionProfile } from "@/controllers/hooks/Companion/useCompanionProfile";
import styles from "./ProfileCompanion.style";

export default function ProfileCompanion() {
    const router = useRouter();
    const {
        theme,
        companionProfile,
        profileLoading,
        getGenderLabel,
        handleEditProfile,
        handleLogout,
        isComplete,
        isVerified,
        handleKycRedirect,
    } = useCompanionProfile();

    const handleActivities = () => {
        router.push("/(tabs_companion)/(profile)/activities");
    };

    const handlePersona = () => {
        router.push("/(tabs_companion)/(profile)/persona");
    };

    const handleReviews = () => {
        router.push("/(tabs_companion)/(profile)/reviews");
    };

    // Pale/light color values for icon background circles
    const iconColors = {
        // activitiesBg: "#FFF0E6",
        activitiesIcon: "#E96100", 
        // personaBg: "#E6F0FA",
        personaIcon: "#0066CC", 
        // reviewsBg: "#FFEBEB",
        reviewsIcon: "#FF4D4D", 
        // editBg: "#F2ECE4", 
        editIcon: "#8C7A6B", 
        // logoutBg: "#FFEBEB", 
        logoutIcon: "#EF4444", 
    };

    return (
        <MainLayoutCompanion showHeader={true} useScrollView={true} isDashboard={false} backgroundColor="#FAF5F0">
            {/* Profile Avatar Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarWrapper}>
                    <ProfilePicture
                        uri={companionProfile?.url_photoprofile_companion}
                        profileLoading={profileLoading}
                        showCameraIcon={false}
                        size={120}
                        borderWidth={4}
                        borderColor="#FFF"
                    />
                    <TouchableOpacity
                        style={[styles.editBadge, { backgroundColor: iconColors.activitiesIcon }]}
                        onPress={handleEditProfile}
                        activeOpacity={0.8}
                    >
                        <Feather name="edit-2" size={14} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Info Text */}
                <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
                    {profileLoading ? "Loading..." : companionProfile?.name_companion || "Teman Ziro"}
                </Text>

                <Text style={[styles.userDetails, { color: theme.colors.textSecondary }]}>
                    {profileLoading
                        ? "Loading..."
                        : `${companionProfile?.age_companion ? `${companionProfile.age_companion} Tahun` : "-"} • ${getGenderLabel(companionProfile?.gender_companion)}`}
                </Text>

                <View style={styles.locationContainer}>
                    <Feather name="map-pin" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                    <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                        {profileLoading ? "Loading..." : companionProfile?.address_companion || "Alamat belum tersedia"}
                    </Text>
                </View>
            </View>

            {/* Menu List Groups */}
            <View style={styles.menuContainer}>
                {/* First Card Group */}
                <ProfileMenuCard>
                    <ProfileMenuItem
                        title="Tertarik dengan Aktivitas"
                        icon={<Feather name="compass" size={18} color={iconColors.activitiesIcon} />}
                        // iconBgColor={iconColors.activitiesBg}
                        onPress={handleActivities}
                    />
                    <ProfileMenuItem
                        title="Karakter Saya"
                        icon={<MaterialCommunityIcons name="brain" size={18} color={iconColors.personaIcon} />}
                        // iconBgColor={iconColors.personaBg}
                        onPress={handlePersona}
                    />
                    <ProfileMenuItem
                        title="Nilai & Komen"
                        icon={<Feather name="star" size={18} color={iconColors.reviewsIcon} />}
                        // iconBgColor={iconColors.reviewsBg}
                        onPress={handleReviews}
                    />
                </ProfileMenuCard>

                {/* Second Card Group */}
                {/* Ini untuk data tambahan kek verifikasi data, add on, dll, yang berhubungan dengan admins */}
                <ProfileMenuCard>
                    <KycCard
                        status={
                            isVerified
                                ? "verified"
                                : isComplete
                                ? "pending"
                                : "unverified"
                        }
                        onComplete={handleKycRedirect}
                    />
                </ProfileMenuCard>

                {/* Third Card Group */}
                <ProfileMenuCard>
                    <ProfileMenuItem
                        title="Edit Profil"
                        icon={<Feather name="user-check" size={18} color={iconColors.editIcon} />}
                        // iconBgColor={iconColors.editBg}
                        onPress={handleEditProfile}
                    />
                    <ProfileMenuItem
                        title="Keluar Akun"
                        icon={<Feather name="log-out" size={18} color={iconColors.logoutIcon} />}
                        // iconBgColor={iconColors.logoutBg}
                        onPress={handleLogout}
                        variant="danger"
                    />
                </ProfileMenuCard>
            </View>
        </MainLayoutCompanion>
    );
}