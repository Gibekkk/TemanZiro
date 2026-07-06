import React from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";

import { useTheme } from "@/controllers/hooks/useTheme";
import { useListChat } from "@/controllers/hooks/Common/useListChat";
import MainLayout from "@/views/layouts/MainLayout/MainLayout";
import MainLayoutCompanion from "@/views/layouts/MainLayout/MainLayoutCompanion";
import SearchBar from "@/views/components/SearchBar/SearchBar";
import InfoIcon from "@/assets/icon/info.svg";
import PlaceholderImg from "@/assets/image/img-placeholder.svg";

import styles from "./ListChatScreen.style";

interface ChatItemProps {
    name: string;
    time: string;
    previewText: string;
    avatarUrl?: string;
    isOnline?: boolean;
    onPress: () => void;
}

function ChatItem({ name, time, previewText, avatarUrl, isOnline, onPress }: ChatItemProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.avatarWrapper}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <PlaceholderImg width={48} height={48} />
                )}
                {isOnline && <View style={[styles.onlineDot, { backgroundColor: theme.colors.online }]} />}
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatInfoTop}>
                    <Text style={[styles.nameText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                        {name || "User"}
                    </Text>
                    <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                        {time}
                    </Text>
                </View>
                <Text style={[styles.previewText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {previewText || ""}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function ListChatScreen() {
    const {
        theme,
        isCompanion,
        chatLoading,
        activeTab,
        setActiveTab,
        handleFetchData,
        formatTime,
        filteredChat,
        handleChatPress,
    } = useListChat();

    const renderContent = () => (
        <>
            <SearchBar onSearch={handleFetchData} minLength={4} />

            {/* <View style={styles.tabsContainer}>
                {(["Aktif", "Riwayat"] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabButton, isActive && styles.activeTabButton]}
                            onPress={() => setActiveTab(tab)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View> */}

            <View style={[styles.tabBar, { borderBottomColor: theme.colors.textSecondary }]}>
                {(["Aktif", "Riwayat"] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)} 
                            activeOpacity={0.8}
                            style={[
                                styles.tabItem,
                                isActive && { 
                                    borderBottomColor: theme.colors.primary, 
                                    borderBottomWidth: 2 
                                }
                            ]}>
                            <Text 
                                style={[
                                    styles.tabText,
                                    { color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary }
                                ]}>
                                {tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView
                style={styles.chatList}
                contentContainerStyle={styles.chatListContent}
                showsVerticalScrollIndicator={false}
            >
                {chatLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={theme.colors.secondary} />
                        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                            Loading chats...
                        </Text>
                    </View>
                ) : filteredChat.length === 0 ? (
                    <View style={styles.centerContent}>
                        <InfoIcon width={64} height={64} style={styles.imgInfo} />
                        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                            {activeTab === "Aktif"
                                ? "Tidak ada chat aktif"
                                : "Tidak ada riwayat chat"}
                        </Text>
                    </View>
                ) : (
                    filteredChat.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            name={isCompanion ? chat.name_user : chat.name_companion}
                            time={formatTime(chat.lastchat_datetime)}
                            previewText={chat.last_chat}
                            avatarUrl={isCompanion ? chat.url_photoprofile_user : chat.url_photoprofile_companion}
                            isOnline={chat.is_online_companion}
                            onPress={() => handleChatPress(chat)}
                        />
                    ))
                )}
            </ScrollView>
        </>
    );

    if (isCompanion) {
        return (
            <MainLayoutCompanion showHeader={true} useScrollView={false} backgroundColor="#ffffff" isDashboard={false}>
                {renderContent()}
            </MainLayoutCompanion>
        );
    }

    return (
        <MainLayout showHeader={true} useScrollView={false} isDashboard={false}>
            {renderContent()}
        </MainLayout>
    );
}