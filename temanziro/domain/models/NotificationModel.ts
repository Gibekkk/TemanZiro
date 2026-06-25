import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { ActivityType, BookingStatus } from "@/constants/BookingDetails";
import { NotificationType } from "@/constants/Notification";

export interface Notification {
    activity_name: ActivityType;
    booking_id: string;
    notification_datetime: FirebaseFirestoreTypes.Timestamp;
    requester_id: string;
    booking_status: BookingStatus;
    notification_type: NotificationType;
    is_read: boolean;
    created_at: FirebaseFirestoreTypes.Timestamp;
    updated_at: FirebaseFirestoreTypes.Timestamp;
}