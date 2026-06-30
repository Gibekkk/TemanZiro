import React from "react";
import { View, Image, Text } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import IconStarActive from "@/assets/icon/staryellow.svg";
import IconStarInactive from "@/assets/icon/starnon.svg";
import styles from "./ReviewCard.style";

interface Review {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    text: string;
}

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const { theme } = useTheme();

    return (
        <View style={[styles.reviewCard, { backgroundColor: theme.colors.tertiaryBackground }]}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: theme.colors.textPrimary }]}>
                        {review.name}
                    </Text>
                    <View style={styles.reviewStarsRow}>
                        {Array.from({ length: 5 }).map((_, i) => {
                            const IconStar = i < review.rating ? IconStarActive : IconStarInactive;
                            return <IconStar key={i} width={12} height={12} />;
                        })}
                    </View>
                </View>
            </View>
            <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>
                {review.text}
            </Text>
        </View>
    );
}
