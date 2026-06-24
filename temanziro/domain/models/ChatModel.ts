import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface ChatMessage {
    id?: string;
    chat: string;
    reference_booking: FirebaseFirestoreTypes.DocumentReference;
    sender_is_user: boolean;
    created_at: FirebaseFirestoreTypes.Timestamp;
}

export interface ChatRoomMeta {
    id?: string;
    last_chat: string;
    lastchat_datetime: FirebaseFirestoreTypes.Timestamp;
}