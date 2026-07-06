import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import styles from './ChatScreen.style';
import ChatLayout from '@/views/layouts/ChatLayout/ChatLayout';
import { useChat } from '@/controllers/hooks/Common/useChat';
import BookingStatusInChat, { BookingStatusType } from '@/views/components/UI/BookingStatusInChat/BookingStatusInChat';

export default function ChatScreen() {
    const {
        messages,
        loading,
        companionName,
        companionAvatar,
        bookingStatus,
        isCompanion,
        sendMessage,
        formatMessageTime,
    } = useChat();

    const userRole = isCompanion ? 'companion' : 'user';

    const renderMessageItem = ({ item }: { item: any }) => {
        if (item.isSystem) {
            return (
                <BookingStatusInChat status={item.status as BookingStatusType} role={userRole} />
            );
        }

        const isMyMessage = isCompanion ? !item.sender_is_user : item.sender_is_user;
        const formattedTime = formatMessageTime(item.created_at);

        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
                <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
                    <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
                        {item.chat}
                    </Text>
                </View>
                {formattedTime ? (
                    <Text style={[styles.timeText, isMyMessage ? styles.myTimeText : styles.otherTimeText]}>
                        {formattedTime}
                    </Text>
                ) : null}
            </View>
        );
    };

    return (
        <ChatLayout
            selfName={companionName}
            selfProfileImage={companionAvatar}
            bookingData={bookingStatus}
            presenceStatus="Online"
            userRole={userRole}
            onSend={sendMessage}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#e96100" />
                </View>
            ) : (
                <FlatList
                    data={[...messages].reverse()}
                    keyExtractor={(item) => item.id || `msg_${Date.now()}_${Math.random()}`}
                    renderItem={renderMessageItem}
                    inverted
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ChatLayout>
    );
}