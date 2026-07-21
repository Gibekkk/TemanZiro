import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/controllers/hooks/useTheme";

import styles from "./RatingReview.style";

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

interface RatingReviewProps {
  overallRating: string;
  ratingDistribution: { star: number; count: number }[];
  reviews: Review[];
}

export default function RatingReviewSection({
  overallRating,
  ratingDistribution,
  reviews,
}: RatingReviewProps) {
  const { theme } = useTheme();
  const maxRatingCount = Math.max(...ratingDistribution.map((r) => r.count), 1);

  return (
    <View style={styles.content}>
      
      {/* --- RATING HEADER --- */}
      <View style={styles.ratingHeader}>
        <Text style={[styles.overallRating, { color: theme.colors.textPrimary }]}>
          {overallRating}
        </Text>

        <View style={styles.ratingBars}>
          {[...ratingDistribution]
            .sort((a, b) => b.star - a.star)
            .map((item) => (
              <View key={item.star} style={styles.ratingRow}>
                <Text style={[styles.ratingStarText, { color: theme.colors.textPrimary }]}>
                  {item.star}
                </Text>
                <View style={[styles.barTrack, { backgroundColor: theme.colors.secondaryBackground }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: theme.colors.primary,
                        width: `${(item.count / maxRatingCount) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.ratingCountText, { color: theme.colors.textPrimary }]}>
                  {item.count}
                </Text>
              </View>
            ))}
        </View>
      </View>

      {/* --- REVIEW CARDS --- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewScrollContainer}
      >
        {reviews.map((review) => (
          <View
            key={review.id}
            style={[
              styles.reviewCard,
              {
                backgroundColor: theme.colors.primaryBackground,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <Image
                  source={{ uri: review.avatar }}
                  style={styles.reviewerAvatar}
                />
                <Text style={[styles.reviewerName, { color: theme.colors.textPrimary }]}>
                  {review.name}
                </Text>
              </View>
              
              <View style={styles.reviewStar}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="#EAB308">
                  <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </Svg>
                <Text style={[styles.reviewStarText, { color: theme.colors.textPrimary }]}>
                  {review.rating.toFixed(1)}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>
              {review.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}