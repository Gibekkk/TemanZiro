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
    date?: string;
    photos?: string[];
}

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const { theme } = useTheme();

    const getInitials = (name: string) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const hasAvatar = !!(review.avatar && review.avatar.startsWith("http"));
    const isLightTheme = theme.colors.primaryBackground === '#f8f7f5';
    const cardBg = isLightTheme ? '#ffffff' : '#1e293b';
    const cardBorder = isLightTheme ? 'rgba(234, 234, 234, 0.8)' : 'rgba(255, 255, 255, 0.1)';

    return (
        <View style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.reviewHeader}>
                <View style={styles.headerLeft}>
                    {hasAvatar ? (
                        <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                    ) : (
                        <View style={[styles.reviewerAvatar, styles.initialsAvatar]}>
                            <Text style={styles.initialsText}>{getInitials(review.name)}</Text>
                        </View>
                    )}
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
                {review.date && (
                    <Text style={[styles.reviewDate, { color: theme.colors.textSecondary }]}>
                        {review.date}
                    </Text>
                )}
            </View>
            
            <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>
                {review.text}
            </Text>

            {review.photos && review.photos.length > 0 && (
                <View style={styles.photosRow}>
                    {review.photos.map((photoUrl, index) => (
                        <Image key={index} source={{ uri: photoUrl }} style={styles.reviewPhoto} />
                    ))}
                </View>
            )}
        </View>
    );
}

