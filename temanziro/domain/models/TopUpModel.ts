import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { TOPUP_STATUS } from "@/constants/MoneyDetails";

export interface TopUps {
    amount: number;
    decline_reason: string | null;
    topup_status: typeof TOPUP_STATUS[keyof typeof TOPUP_STATUS];
    created_at: FirebaseFirestoreTypes.Timestamp;
}