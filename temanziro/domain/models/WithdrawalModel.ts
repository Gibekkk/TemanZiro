import { BankName, WithdrawStatus } from "@/constants/MoneyDetails";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface Withdrawal {
    bank_name: BankName;
    withdrawal_account_number: string;
    withdrawal_amount: number;
    withdrawal_status: WithdrawStatus;
    withdrawal_decline_reason: string | null;
    withdrawal_requested_at: FirebaseFirestoreTypes.Timestamp;
    withdrawal_approved_at: FirebaseFirestoreTypes.Timestamp | null;
}