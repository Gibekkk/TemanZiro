import { ACTIVITY_TYPE } from "@/constants/BookingDetails";

export interface Notification {
    activity_name: typeof ACTIVITY_TYPE[number]["value"];
    booking_id: string;
    notification_datetime: FirebaseFirestoreTypes.Timestamp;
    requester_id: string;
    booking_status: typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
    notification_type: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
    created_at: FirebaseFirestoreTypes.Timestamp;
}