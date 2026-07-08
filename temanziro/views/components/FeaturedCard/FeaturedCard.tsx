import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './FeaturedCard.style';
import { BookingData } from '@/controllers/hooks/Common/useTemanJalan';
import CheckInButton from '@/views/components/CheckInButton/CheckInButton';

import IconLocation from '@/assets/icon/location-primary.svg';
import IconDate from '@/assets/icon/date-primary.svg';
import IconTime from '@/assets/icon/time-primary.svg';
import IconChatOn from '@/assets/icon/chatorange.svg';
import IconChatOff from '@/assets/icon/chat.svg';
import IMGMiniZiro from '@/assets/image/img-placeholder.svg';

interface FeaturedCardProps {
    item: BookingData;
    theme: any;
    role: string;
    handleChatPress: (item: BookingData) => void;
}

export default function FeaturedCard({ item, theme, role, handleChatPress }: FeaturedCardProps) {
    const statusLower = (item.status || '').toLowerCase();
    const canChat = statusLower === 'konfirmasi' || statusLower === 'terkonfirmasi' || statusLower === 'berlangsung';

    const badgeBgColor = statusLower === 'berlangsung'
        ? theme.colors.online
        : theme.colors.secondary;

    return (
        <View style={[styles.cardSlide, { backgroundColor: theme.colors.primaryBackground, borderColor: theme.colors.border }]}>
            {/* Header */}
            <View style={styles.cardHeader}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: theme.colors.primary }]} />
                ) : (
                    <View style={[styles.avatar, { borderColor: theme.colors.primary, backgroundColor: theme.colors.secondaryBackground, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]}>
                        <IMGMiniZiro width={40} height={40} />
                    </View>
                )}
                <View style={styles.headerInfo}>
                    <Text style={[styles.name, { color: theme.colors.primary }]} numberOfLines={1}>
                        {item.name}, {item.age}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: badgeBgColor }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
            </View>

            {/* Details */}
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <IconDate width={14} height={14} fill={theme.colors.primaryBackground} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconTime width={14} height={14} fill={theme.colors.primaryBackground} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconLocation width={14} height={14} fill={theme.colors.primaryBackground} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                        {item.location}
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.cardActions}>
                {/* Chat Button */}
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        {
                            borderColor: canChat ? theme.colors.secondary : theme.colors.border,
                            backgroundColor: 'transparent'
                        }
                    ]}
                    disabled={!canChat}
                    onPress={() => handleChatPress(item)}
                >
                    {canChat ? (
                        <IconChatOn width={16} height={16} />
                    ) : (
                        <IconChatOff width={16} height={16} fill={theme.colors.textSecondary} />
                    )}
                    <Text style={[styles.buttonText, { color: canChat ? theme.colors.secondary : theme.colors.textSecondary }]}>
                        Chat
                    </Text>
                </TouchableOpacity>
                {/* Check In / QR Code Action */}
                <CheckInButton
                    role={role}
                    bookingId={item.id}
                    disabled={!canChat}
                    onSuccess={(bookingId) => {
                        console.log("Check-in successful for booking:", bookingId);
                    }}
                />
            </View>
        </View>
    );
}
