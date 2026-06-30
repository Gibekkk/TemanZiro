import React from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import styles from "./FriendList.style";
import { useTheme } from "@/controllers/hooks/useTheme";
import PlaceholderImg from "@/assets/image/img-placeholder.svg";

export interface FriendItem {
    friendUid: string;
    name: string;
    photoUrl: string | typeof PlaceholderImg;
    isOnline: boolean;
}

interface FriendListProps {
    friendsData: FriendItem[];
    isLoading: boolean;
}

export default function FriendList({ friendsData, isLoading }: FriendListProps) {
    const { theme } = useTheme();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.secondary} size="small" />
                <Text style={styles.infoText}>Memuat daftar teman...</Text>
            </View>
        );
    }
    if (friendsData.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.infoText}>Belum ada teman aktif</Text>
            </View>
        );
    }
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            {friendsData.map((friend, index) => (
                <View key={index} style={styles.friendItem}>
                    <View style={styles.avatarWrapper}>
                        {friend.photoUrl !== PlaceholderImg ? (
                            <Image source={{ uri: friend.photoUrl as string }} style={styles.friendAvatar} />
                        ) : (
                            <PlaceholderImg width={40} height={40} />
                        )}
                        {friend.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <Text style={styles.friendName} numberOfLines={1}>
                        {friend.name}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}