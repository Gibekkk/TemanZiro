import React, { useState } from "react";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import styles from "./ReviewCompanion.style"
import { useTheme } from "@/controllers/hooks/useTheme";
import ReviewCard from "@/views/components/ReviewCard/ReviewCard";
import { useCompanionProfile } from "@/controllers/hooks/Companion/useCompanionProfile";
import IconStarActive from "@/assets/icon/staryellow.svg";
import IconStarInactive from "@/assets/icon/starnon.svg";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const FILTERS = [
    { key: "semua", label: "Semua" },
    { key: "terbaru", label: "Terbaru" },
    { key: "dengan_foto", label: "Dengan Foto" },
    { key: "rating_5", label: "Rating 5" },
];

export default function ReviewCompanion() {
    const { theme } = useTheme();
    const { rating, totalReviews, ratingDistribution, reviews } = useCompanionProfile();
    const [selectedFilter, setSelectedFilter] = useState("semua");

    const isLightTheme = theme.colors.primaryBackground === '#f8f7f5';
    const cardBg = isLightTheme ? '#ffffff' : '#1e293b';
    const cardBorder = isLightTheme ? 'rgba(234, 234, 234, 0.8)' : 'rgba(255, 255, 255, 0.1)';

    // Filter Reviews based on selected option
    const filteredReviews = reviews.filter((review) => {
        if (selectedFilter === "semua") return true;
        if (selectedFilter === "terbaru") return true; // Chronological mock data
        if (selectedFilter === "dengan_foto") return !!(review.photos && review.photos.length > 0);
        if (selectedFilter === "rating_5") return review.rating === 5;
        return true;
    });

    return(
        <SecondaryLayout title="Ulasan Saya" alignLeft={true}>
            <View style={styles.sectionContainer}>
                {/* Overall Rating & Breakdown Row */}
                <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <View style={styles.ratingSummaryRow}>
                        <View style={styles.overallRatingContainer}>
                            <Text style={[styles.overallRatingText, { color: theme.colors.textPrimary }]}>
                                {rating?.overall_rating?.toFixed(1) || "0.0"}
                            </Text>
                            <View style={styles.starsRow}>
                                {Array.from({ length: 5 }).map((_, i) => {
                                    // Render 4 filled stars and 1 hollow/inactive star for a 4.8 rating.
                                    const isFilled = i < Math.floor(rating?.overall_rating || 0);
                                    const StarIcon = isFilled ? IconStarActive : IconStarInactive;
                                    return <StarIcon key={i} width={16} height={16} />;
                                })}
                            </View>
                            <Text style={[styles.totalReviewsText, { color: theme.colors.textSecondary }]}>
                                {totalReviews} Nilai
                            </Text>
                        </View>

                        {/* Breakdown Bars */}
                        <View style={styles.breakdownContainer}>
                            {ratingDistribution.map((dist) => {
                                const percentage = (dist.count / totalReviews) * 100;
                                return (
                                    <View key={dist.star} style={styles.breakdownRow}>
                                        <Text style={[styles.starNumberText, { color: theme.colors.textPrimary }]}>
                                            {dist.star}
                                        </Text>
                                        <View style={[styles.barBackground, { backgroundColor: isLightTheme ? '#ede7df' : '#334155' }]}>
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
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Filter Bar */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScrollView}
                    contentContainerStyle={styles.filterContainer}
                >
                    {FILTERS.map((filter) => {
                        const isActive = selectedFilter === filter.key;
                        const activeBg = theme.colors.tertiaryBackground; // #fcece3
                        const inactiveBg = isLightTheme ? '#efeae4' : '#334155';
                        const activeTextColor = theme.colors.secondary; // #e96100
                        const inactiveTextColor = theme.colors.textSecondary;

                        return (
                            <TouchableOpacity
                                key={filter.key}
                                onPress={() => setSelectedFilter(filter.key)}
                                style={[
                                    styles.filterPill,
                                    { backgroundColor: isActive ? activeBg : inactiveBg }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        {
                                            color: isActive ? activeTextColor : inactiveTextColor,
                                            fontWeight: isActive ? "bold" : "normal"
                                        }
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Section Subtitle */}
                <Text style={[styles.sectionSubtitle, { color: theme.colors.textPrimary }]}>
                    Semua Komentar
                </Text>

                {/* Review Cards List */}
                <View style={styles.reviewList}>
                    {filteredReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </View>
            </View>
        </SecondaryLayout>
    )
}