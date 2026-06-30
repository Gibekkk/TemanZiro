import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAuth } from "@/controllers/hooks/useAuth";
import { NotificationRepository } from "@/data/repositories/NotificationRepository";
import { UserRepository } from "@/data/repositories/UserRepository";
import BellIcon from "@/assets/icon/bell.svg";
import styles from "./NotificationBell.style";

interface NotificationBellProps {
    onPress?: () => void;
}

export default function NotificationBell({ onPress }: NotificationBellProps) {
    const { currentUser } = useAuth();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isCompanion, setIsCompanion] = useState<boolean>(false);

    // useEffect(() => {
    //     if (!currentUser?.uid) {
    //         setUnreadCount(0);
    //         setIsCompanion(false);
    //         return;
    //     }

    //     const unsubscribeNotif = NotificationRepository.subscribeNotifications(
    //         currentUser.uid,
    //         (notifications) => {
    //             const unread = notifications.filter(notif => !notif.is_read).length;
    //             setUnreadCount(unread);
    //         },
    //         (error) => {
    //             console.error("Error in NotificationBell subscription:", error);
    //         }
    //     );

    //     return () => {
    //         unsubscribeNotif();
    //     };
    // }, [currentUser]);

    return (
        <TouchableOpacity
            style={styles.notifWrapper}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <BellIcon width={24} height={24} fill="none" stroke="#0f172a" strokeWidth={2} />
            {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                    <Text style={styles.badgeText}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
