import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/controllers/hooks/useTheme";

import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";
import Tag from "@/views/components/PersonaTag/PersonaTag";
import ActivityCard, { ActivityType } from "@/views/components/ActivityListCard/ActivityListCard";
import RatingReviewSection from "@/views/components/RatingReview/RatingReview";

import IconVerified from "@/assets/icon/verified1.svg";
import IconUserCheck from "@/assets/icon/usercheck.svg";
import IconStarOrange from "@/assets/icon/starorange.svg";
import IconConfirm from "@/assets/icon/confirm.svg";

import styles from "./ViewProfileTemanJalanScreen.style";

export default function ViewProfileTemanJalanScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { companionId } = useLocalSearchParams();

  const [companionData] = useState({
    id: companionId || "1",
    name_companion: "Sarah",
    age_companion: 24,
    url_photoprofile_companion: "https://i.pravatar.cc/400?img=47",
    philosophy_companion: "Menjadi pendengar yang baik adalah kunci untuk memahami dunia dari sudut pandang orang lain. Saya senang berbagi cerita dan tawa.",
    preference_companion: ["Ramah", "Asik", "Pendengar Baik"],
    preference_activity_companion: ["nongkrong", "jalan", "kuliner"],
    is_verified_companion: true,
    total_session: 124,
    rating_companion: 4.8,
    createdAt: "2024",
    companion_rating: {
      count_rating: { "1": 0, "2": 0, "3": 1, "4": 15, "5": 108 },
      overall_rating: 4.8,
    }
  });

  const [reviewsWithUser] = useState([
    {
      id: "REV-1",
      name: "Budi Santoso",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 5,
      comment: "Sarah sangat asik diajak ngobrol dan pengetahuannya luas. Recommended banget buat temen nongkrong!",
    },
    {
      id: "REV-2",
      name: "Anita",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 4,
      comment: "Teman jalan yang seru, sangat tepat waktu dan pendengar yang baik.",
    }
  ]);

  const handleGoToHistory = () => {
    router.push("/booker/confirmationtemanjalan");
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.colors.primaryBackground }]}>
      <SecondaryLayout title="Profil Companion" alignLeft={true} noPadding>          
          {/* --- Hero Section --- */}
          <View style={styles.heroWrapper}>
            <View style={[styles.heroSection, { borderColor: theme.colors.border }]}>
              <Image
                source={{ uri: companionData.url_photoprofile_companion }}
                style={styles.heroImage}
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.9)"]}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0, y: 1 }}
                style={styles.heroOverlay}
              />

              <View style={[styles.statsBadge, { borderColor: theme.colors.border }]}>
                <IconUserCheck width={20} height={20} />
                <Text style={styles.statsBadgeText}>{companionData.total_session}</Text>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>
                    {companionData.name_companion}, {companionData.age_companion}
                  </Text>
                  {companionData.is_verified_companion && (
                    <IconVerified width={24} height={24} />
                  )}
                  <View style={styles.ratingHero}>
                    <IconStarOrange width={22} height={22} />
                    <Text style={styles.ratingHeroText}>
                      {companionData.rating_companion.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {companionData.preference_companion.length > 0 ? (
                    companionData.preference_companion.slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))
                  ) : (
                    <Tag>Belum ada preferensi</Tag>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* --- Content Section --- */}
          <View style={[styles.contentSection, { backgroundColor: theme.colors.primaryBackground }]}>
            
            {/* --- Philosophy Section --- */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Filosofi Companion
                </Text>
                <Text style={[styles.memberDate, { color: theme.colors.primary }]}>
                  Anggota sejak {companionData.createdAt}
                </Text>
              </View>
              <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {companionData.philosophy_companion}
              </Text>
            </View>

            {/* --- Preferred Activities Section --- */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Tertarik dengan Kegiatan
              </Text>
              <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
              <View style={styles.activityGrid}>
                {companionData.preference_activity_companion.length > 0 ? (
                  companionData.preference_activity_companion.map((activityType) => (
                    <ActivityCard key={activityType} type={activityType as ActivityType} />
                  ))
                ) : (
                  <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    Belum ada kegiatan yang dipilih.
                  </Text>
                )}
              </View>
            </View>

            {/* --- Reviews Section --- */}
            <View style={styles.sectionNoBottomMargin}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Apa kata orang lain
                </Text>
              </View>
              <View style={[styles.line, { backgroundColor: theme.colors.border }]} />

              {reviewsWithUser.length > 0 ? (
                <RatingReviewSection
                  overallRating={companionData.companion_rating.overall_rating.toString()}
                  ratingDistribution={[
                    { star: 5, count: companionData.companion_rating.count_rating["5"] },
                    { star: 4, count: companionData.companion_rating.count_rating["4"] },
                    { star: 3, count: companionData.companion_rating.count_rating["3"] },
                    { star: 2, count: companionData.companion_rating.count_rating["2"] },
                    { star: 1, count: companionData.companion_rating.count_rating["1"] },
                  ]}
                  reviews={reviewsWithUser.map((review) => ({
                    id: review.id,
                    name: review.name,
                    avatar: review.avatar,
                    rating: review.rating,
                    text: review.comment,
                  }))}
                />
              ) : (
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  Belum ada ulasan yang tersimpan.
                </Text>
              )}
            </View>

          </View>
      </SecondaryLayout>

      {/* --- Footer Fixed --- */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.primaryBackground }]}>
        <GeneralButton
          variant="primary"
          style={styles.buttonAction}
          onClick={handleGoToHistory}
        >
          <View style={styles.buttonContentRow}>
            <IconConfirm width={24} height={24} color="#FFF" />
            <Text style={styles.buttonActionText}>Konfirmasi & Booking Sesi</Text>
          </View>
        </GeneralButton>
      </View>
    </View>
  );
}