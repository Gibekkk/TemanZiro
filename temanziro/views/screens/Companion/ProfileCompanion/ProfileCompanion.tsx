import React from "react";
import { View, Text } from "react-native";
import Feather from "@react-native-vector-icons/feather/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import MainLayoutCompanion from "@/views/layouts/MainLayout/MainLayoutCompanion";
import ProfilePicture from "@/views/components/ProfilePicture/ProfilePicture";
import ProfileMenuCard from "@/views/components/ProfileMenuCard/ProfileMenuCard";
import ProfileMenuItem from "@/views/components/ProfileMenuItem/ProfileMenuItem";
import KycCard from "@/views/components/KycCard/KycCard";
import { useCompanionProfile } from "@/controllers/hooks/Companion/useCompanionProfile";
import styles from "./ProfileCompanion.style";
import AddOnConfirmationCard from "@/views/components/AddOnConfirmation/AddOnConfirmation";
import { ADD_ON_STATUS } from "@/constants/AddOnConstant";

export default function ProfileCompanion() {
    const {
        theme,
        companionProfile,
        profileLoading,
        getGenderLabel,
        handleEditProfile,
        handleLogout,
        isComplete,
        isVerified,
        addonStatus,
        handleKycRedirect,
        handleActivities,
        handleAddOns,
        handlePersona,
        handleReviews,
        handleAddOnRedirect,
    } = useCompanionProfile();

    const iconColors = {
        activitiesIcon: "#E96100",
        personaIcon: "#0066CC",
        addOnsIcon: "#ff5ae1",
        reviewsIcon: "#FF4D4D",
        editIcon: "#8C7A6B",
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
                        showCameraIcon={true}
                        size={120}
                        borderWidth={4}
                        borderColor="#FFF"
                        onImageSelected={(uri) => {
                            console.log("Selected image uri:", uri);
                        }}
                    />
                    {/* <TouchableOpacity
                        style={[styles.editBadge, { backgroundColor: iconColors.activitiesIcon }]}
                        onPress={handleEditProfile}
                        activeOpacity={0.8}
                    >
                        <Feather name="edit-2" size={14} color="#FFF" />
                    </TouchableOpacity> */}
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
                        {profileLoading ? "Loading..." : companionProfile?.city_companion || "Alamat belum tersedia"}
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
                        onPress={handleActivities}
                    />
                    <ProfileMenuItem
                        title="Kelola Add-ons"
                        icon={<Feather name="plus-circle" size={18} color={iconColors.addOnsIcon} />}
                        onPress={handleAddOns}
                    />
                    <ProfileMenuItem
                        title="Karakter Saya"
                        icon={<MaterialCommunityIcons name="brain" size={18} color={iconColors.personaIcon} />}
                        onPress={handlePersona}
                    />
                    <ProfileMenuItem
                        title="Nilai & Komen"
                        icon={<Feather name="star" size={18} color={iconColors.reviewsIcon} />}
                        onPress={handleReviews}
                    />
                </ProfileMenuCard>

                {/* Second Card Group */}
                {/* Ini untuk data tambahan kek verifikasi data, add on, dll, yang berhubungan dengan admins */}
                {(!isVerified || (!!addonStatus && addonStatus !== ADD_ON_STATUS.ACCEPTED)) && (
                    <ProfileMenuCard>
                        {!isVerified && (
                            <KycCard
                                status={
                                    isComplete
                                        ? "pending"
                                        : "unverified"
                                }
                                onComplete={handleKycRedirect}
                            />
                        )}
                        {!!addonStatus && addonStatus !== ADD_ON_STATUS.ACCEPTED && (
                            <AddOnConfirmationCard
                                status={addonStatus}
                                onComplete={() => handleAddOnRedirect(addonStatus)}
                            />
                        )}
                    </ProfileMenuCard>
                )}

                {/* Third Card Group */}
                <ProfileMenuCard>
                    <ProfileMenuItem
                        title="Edit Profil"
                        icon={<Feather name="user-check" size={18} color={iconColors.editIcon} />}
                        onPress={handleEditProfile}
                    />
                    <ProfileMenuItem
                        title="Keluar Akun"
                        icon={<Feather name="log-out" size={18} color={iconColors.logoutIcon} />}
                        onPress={handleLogout}
                        variant="danger"
                    />
                </ProfileMenuCard>
            </View>
        </MainLayoutCompanion>
    );
}