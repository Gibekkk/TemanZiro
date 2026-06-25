import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { TopUpStatus } from "@/constants/MoneyDetails";

export interface TopUps {
    amount: number;
    decline_reason: string | null;
    topup_status: TopUpStatus;
    created_at: FirebaseFirestoreTypes.Timestamp;
}