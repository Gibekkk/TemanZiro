import React from "react";
import MainLayoutCompanion from "@/views/layouts/MainLayout/MainLayoutCompanion";
import { View, ActivityIndicator, Text } from "react-native";
import VerifyBadge from "@/views/components/VerifyBadge/VerifyBadge";
import KycCard from "@/views/components/KycCard/KycCard";
import styles from "./ProfileCompanion.style";
import { useCompanionProfile } from "@/controllers/hooks/Companion/useCompanionProfile";
import ProfilePicture from "@/views/components/ProfilePicture/ProfilePicture";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import ReviewCard from "@/views/components/ReviewCard/ReviewCard";
import InterestSelector from "@/views/components/InterestSelector/InterestSelector";
import PersonaSelector from "@/views/components/PersonaSelector/PersonaSelector";
import IconEditProfile from "@/assets/icon/useredit.svg";
import IconLogout from "@/assets/icon/logoutorange.svg";
import IconStarActive from "@/assets/icon/staryellow.svg";
import IconStarInactive from "@/assets/icon/starnon.svg";
import MiniCard from "@/views/components/UI/IconLabel/MiniCard";

export default function ProfileCompanion() {
    const {
        theme,
        companionProfile,
        profileLoading,
        reviews,
        rating,
        isComplete,
        isVerified,
        getGenderIcon,
        getGenderLabel,
        handleKycRedirect,
        handleEditProfile,
        handleLogout,
        ratingDistribution,
        totalReviews,
    } = useCompanionProfile();

    return (
        <MainLayoutCompanion showHeader={true} useScrollView={true} isDashboard={false}>
            {/* Profile Avatar Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.miniZiroWrapper}>
                        <IMGMiniZiro width={50} height={50} />
                    </View>
                    <ProfilePicture
                        uri={companionProfile?.url_photoprofile_companion}
                        profileLoading={profileLoading}
                        showCameraIcon={false}
                    />
                </View>

                {/* Info Card */}
                <View style={[styles.infoCard]}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.userName]}>
                            {profileLoading ? "Loading..." : companionProfile?.name_companion || "Teman Ziro"}
                        </Text>
                        <VerifyBadge enabled={true} />
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statGroup}>
                            <Text style={[styles.statLabel]}>Jenis Kelamin</Text>
                            <View style={styles.statValue}>
                                {getGenderIcon(companionProfile?.gender_companion)}
                                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                                    {profileLoading ? "Loading..." : getGenderLabel(companionProfile?.gender_companion)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statGroup}>
                            <Text style={[styles.statLabel, { color: theme.colors.textPrimary }]}>Umur</Text>
                            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                                {profileLoading ? "Loading..." : companionProfile?.age_companion ? `${companionProfile.age_companion} Tahun` : "-"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.locationGroup}>
                        <Text style={[styles.statLabel, { color: theme.colors.textPrimary }]}>Lokasi</Text>
                        <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                            {profileLoading ? "Loading..." : companionProfile?.address_companion || "Alamat belum tersedia"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Philosophy Section */}
            <View style={styles.sectionContainer}>
                <View style={[styles.card]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Filosofi Hidup</Text>
                    <Text style={[styles.philosophyText, { color: theme.colors.textSecondary }]}>
                        {profileLoading ? "Loading..." : companionProfile?.philosophy_companion || "Belum ada filosofi hidup."}
                    </Text>
                </View>
            </View>


            {/* KYC Banner */}
            <View style={styles.kycSection}>
                <KycCard
                    status={isVerified ? "verified" : (isComplete ? "pending" : "unverified")}
                    onComplete={handleKycRedirect}
                />
            </View>

            {/* Interests Section */}
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitleHeader, { color: theme.colors.textPrimary }]}>Tertarik dengan Aktivitas</Text>
                {profileLoading ? (
                    <ActivityIndicator size="small" />
                ) : (companionProfile?.preference_activity_companion || []).length > 0 ? (
                    <InterestSelector
                        interests={companionProfile?.preference_activity_companion}
                        value={companionProfile?.preference_activity_companion}
                        disabled={true}
                        showHeader={false}
                    />
                ) : (
                    <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>Belum memilih aktivitas</Text>
                )}
            </View>

            {/* Persona Section */}
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitleHeader, { color: theme.colors.textPrimary }]}>Karakter Saya</Text>
                {profileLoading ? (
                    <ActivityIndicator size="small" />
                ) : (companionProfile?.preference_companion || []).length > 0 ? (
                    <PersonaSelector
                        preference_data={companionProfile?.preference_companion}
                        value={companionProfile?.preference_companion}
                        disabled={true}
                        showHeader={false}
                    />
                ) : (
                    <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>Belum memilih karakter</Text>
                )}
            </View>

            {/* Ratings & Reviews Section */}
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitleHeader, { color: theme.colors.textPrimary }]}>Nilai & Komen</Text>

                {/* Overall Rating & Breakdown Row */}
                <View style={[styles.card, { backgroundColor: theme.colors.tertiaryBackground }]}>
                    <View style={styles.ratingSummaryRow}>
                        <View style={styles.overallRatingContainer}>
                            <Text style={[styles.overallRatingText, { color: theme.colors.primary }]}>
                                {rating?.overall_rating?.toFixed(1) || "0.0"}
                            </Text>
                            <View style={styles.starsRow}>
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const isFilled = i < Math.round(rating?.overall_rating || 0);
                                    const StarIcon = isFilled ? IconStarActive : IconStarInactive;
                                    return <StarIcon key={i} width={16} height={16} />;
                                })}
                            </View>
                            <Text style={[styles.totalReviewsText, { color: theme.colors.textSecondary }]}>
                                {totalReviews} Ulasan
                            </Text>
                        </View>

                        {/* Breakdown Bars */}
                        <View style={styles.breakdownContainer}>
                            {ratingDistribution.map((dist) => {
                                const percentage = (dist.count / totalReviews) * 100;
                                return (
                                    <View key={dist.star} style={styles.breakdownRow}>
                                        <Text style={[styles.starNumberText, { color: theme.colors.textPrimary }]}>{dist.star}</Text>
                                        <View style={[styles.barBackground, { backgroundColor: theme.colors.secondaryBackground }]}>
                                            <View
                                                style={[
                                                    styles.barFill,
                                                    {
                                                        width: `${percentage}%`,
                                                        backgroundColor: theme.colors.secondary
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.reviewCountText, { color: theme.colors.textSecondary }]}>{dist.count}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Review Cards List */}
                <View style={styles.reviewList}>
                    {reviews.slice(0, 2).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                    {/* {reviews.length > 2 && (
                        <TouchableOpacity onPress={() => console.log("Ke halaman semua review")}>
                            <Text style={styles.seeAllText}>Lihat Semua Review</Text>
                        </TouchableOpacity>
                    )} */}
                </View>
            </View>

            {/* Action Buttons Menu */}
            <View style={styles.actionMenu}>
                <MiniCard
                    title="Edit Profil"
                    icon={IconEditProfile}
                    onPress={handleEditProfile}
                />
                <MiniCard
                    title="Keluar Akun"
                    icon={IconLogout}
                    onPress={handleLogout}
                />
            </View>
        </MainLayoutCompanion>
    );
}