import { Notification } from "@/domain/models/NotificationModel";
import firestore from "@react-native-firebase/firestore";

    

export const NotificationRepository = {
    subscribeNotifications(userUid: string, callback: (notifications: Notification[]) => void, onError?: (error: any) => void): () => void {
        return firestore()
            .collection('notification_alert')
            .doc(userUid)
            .collection('notifications')
            .orderBy('notification_datetime', 'desc')
            .onSnapshot(
                async (snapshot) => {
                    if (!snapshot) {
                        callback([]);
                        return;
                    }
                    try {
                        const notifications: Notification[] = snapshot.docs.map(doc => {
                            const data = doc.data() as Notification;
                            return {
                                ...data,
                                notification_datetime: data.notification_datetime,
                                created_at: data.created_at,
                                updated_at: data.updated_at,
                            };
                        })
                        callback(notifications);
                    } catch (error) {
                        console.error("Error fetching notifications:", error);
                        onError?.(error);
                    }
                }
            )
    },

    async markAsRead(userUid: string, notificationId: string): Promise<void> {
        try {
            await firestore()
                .collection('notification_alert')
                .doc(userUid)
                .collection('notifications')
                .doc(notificationId)
                .update({ is_read: true });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    },

    async getPendingNotification(userUid: string): Promise<Notification[]> {
        try {
            const querySnapshot = await firestore()
                .collection('notification_alert')
                .doc(userUid)
                .collection('notifications')
                .where('is_read', '==', false)
                .orderBy('notification_datetime', 'desc')
                .limit(1)
                .get();
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as Notification;
                return {
                    ...data,
                    notification_datetime: data.notification_datetime,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                };
            });
        } catch (error) {
            console.error("Error fetching pending notifications:", error);
            throw error;
        }
    },

    async updateNotificationStatus(userUid: string, notificationId: string, status: string): Promise<void> {
        try {
            await firestore()
                .collection('notification_alert')
                .doc(userUid)
                .collection('notifications')
                .doc(notificationId)
                .update({ is_read: status === "true" });
        } catch (error) {
            console.error("Error updating notification status:", error);
            throw error;
        }
    },

    async updateNotificationStatusByBookingId(userUid: string, bookingId: string, status: string): Promise<void> {
        try {
            const querySnapshot = await firestore()
                .collection('notification_alert')
                .doc(userUid)
                .collection('notifications')
                .where('booking_id', '==', bookingId)
                .limit(1)
                .get();
            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                await firestore()
                    .collection('notification_alert')
                    .doc(userUid)
                    .collection('notifications')
                    .doc(docId)
                    .update({ is_read: status === "true", updated_at: firestore.FieldValue.serverTimestamp() });
            }
        } catch (error) {
            console.error("Error updating notification status:", error);
            throw error;
        }
    }
}