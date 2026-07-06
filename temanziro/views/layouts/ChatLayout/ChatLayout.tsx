import React from 'react';
import { useRouter } from "expo-router";
import BackIcon from "@/assets/icon/back.svg";

import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from "./ChatLayout.style";
import ChatInputBar from '@/views/components/ChatInputBar/ChatInputBar';
import { useTheme } from '@/controllers/hooks/useTheme';

interface ChatLayoutProps {
    children: React.ReactNode;
    selfProfileImage?: string;
    otherProfileImage?: string;
    bookingData?: string;
    presenceStatus?: string;
    selfName?: string;
    userRole?: 'user' | 'companion';
    onSend?: (text: string) => void;
}

export default function ChatLayout({
    children,
    selfProfileImage,
    bookingData,
    presenceStatus,
    selfName,
    userRole = 'user',
    onSend
}: ChatLayoutProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isOnline = presenceStatus?.toLowerCase() === 'online';

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            keyboardVerticalOffset={0}
        >
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => handleBack()} activeOpacity={0.7}>
                    <BackIcon width={15} height={15} />
                </TouchableOpacity>

                {selfProfileImage ? (
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: selfProfileImage }} style={styles.selfProfileImage} />
                        {isOnline && <View style={[styles.onlineDot, { backgroundColor: theme.colors.online }]} />}
                    </View>
                ) : (
                    <View style={styles.avatarWrapper}>
                        <View style={[styles.selfProfileImage, styles.placeholderProfileImage]}>
                            <Text style={styles.placeholderInitial}>
                                {selfName ? selfName.charAt(0).toUpperCase() : '?'}
                            </Text>
                        </View>
                        {isOnline && <View style={[styles.onlineDot, { backgroundColor: theme.colors.online }]} />}
                    </View>
                )}

                <View style={styles.selfInfo}>
                    <Text style={styles.selfName} numberOfLines={1}>{selfName}</Text>
                    <Text style={styles.onlineStatus}>
                        {presenceStatus}
                    </Text>
                </View>
            </View>

            

            <View style={styles.contentContainer}>
                {children}
            </View>

            <View style={{ paddingBottom: insets.bottom, backgroundColor: '#FFFFFF' }}>
                <ChatInputBar onSend={onSend} />
            </View>
        </KeyboardAvoidingView>
    )
}