import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface OnlineStatus {
    is_online: boolean;
    last_seen: FirebaseFirestoreTypes.Timestamp | null;
}