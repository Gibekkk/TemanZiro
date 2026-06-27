import firestore from '@react-native-firebase/firestore';
import { TopUps } from '@/domain/models/TopUpModel';
import { Withdrawal } from '@/domain/models/WithdrawalModel';
import { TOPUP_STATUS, WITHDRAW_STATUS } from '@/constants/MoneyDetails';

export const TransactionRepository = {
    async createTopUpRequest(userUid: string, amount:number): Promise<string> {
        try {
            const docRef = await firestore()
                .collection('users')
                .doc(userUid)
                .collection('requests')
                .add({
                    amount: amount,
                    topup_status: TOPUP_STATUS.MENUNGGU,
                    created_at: firestore.FieldValue.serverTimestamp()
                });
            return docRef.id;
        } catch (error) {
            console.error('Error creating top-up request:', error);
            throw error;
        }
    },

    subscribeTopUpRequests(userUid: string, callback: (requests: TopUps[]) => void, onError?: (error: any) => void): () => void {
        return firestore()
            .collection('top_ups')
            .doc(userUid)
            .collection('requests')
            .orderBy('created_at', 'desc')
            .limit(1)
            .onSnapshot(
                (snapshot) => {
                    if (!snapshot) {
                        callback([]);
                        return;
                    }
                    const requests: TopUps[] = snapshot.docs.map((docSnap) => {
                        const data = docSnap.data();
                        return {
                            amount: data.amount,
                            decline_reason: data.decline_reason || null,
                            topup_status: data.topup_status,
                            created_at: data.created_at,
                        };
                    });
                    callback(requests);
                },
                (error) => {
                    console.error('Error subscribing to top-up requests:', error);
                    if (onError) onError(error);
                }
            )
    },

    async getTopUpRequests(userUid: string): Promise<TopUps[]> {
        try {
            const snapshot = await firestore()
                .collection('top_ups')
                .doc(userUid)
                .collection('requests')
                .orderBy('created_at', 'desc')
                .limit(10)
                .get();

            return snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    amount: data.amount,
                    decline_reason: data.decline_reason || null,
                    topup_status: data.topup_status,
                    created_at: data.created_at,
                };
            });
        } catch (error) {
            console.error('Error fetching top-up requests:', error);
            throw error;
        }
    },

    async createWithdrawalRequest(userUid: string, bankName: string, accountNumber: string, amount: number): Promise<string> {
        try {
            const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

            const docRef = await firestore()
                .collection('withdrawals')
                .doc(userUid)
                .collection('requests')
                .add({
                    bankName: bankName,
                    withdrawal_account_number: accountNumber,
                    withdrawal_amount: parsedAmount,
                    withdrawal_status: WITHDRAW_STATUS.MENUNGGU,
                    created_at: firestore.FieldValue.serverTimestamp()
                });
            return docRef.id;
        } catch (error) {
            console.error('Error creating withdrawal request:', error);
            throw error;
        }
    },

    subscribeWithdrawalRequests(userUid: string, callback: (requests: Withdrawal[]) => void, onError?: (error: any) => void): () => void {
        return firestore()
            .collection('withdrawals')
            .doc(userUid)
            .collection('requests')
            .onSnapshot(
                (snapshot) => {
                    if (!snapshot) {
                        callback([]);
                        return;
                    }
                    const requests: Withdrawal[] = snapshot.docs.map((docSnap) => {
                        const data = docSnap.data();
                        return {
                            bank_name: data.bankName,
                            withdrawal_account_number: data.withdrawal_account_number,
                            withdrawal_amount: data.withdrawal_amount,
                            withdrawal_status: data.withdrawal_status,
                            withdrawal_decline_reason: data.withdrawal_decline_reason || null,
                            withdrawal_requested_at: data.created_at,
                            withdrawal_approved_at: data.withdrawal_approved_at || null,
                        };
                    });
                    callback(requests);
                },
                (error) => {
                    console.error('Error subscribing to withdrawal requests:', error);
                    if (onError) onError(error);
                }
            )
    },

    async getWithdrawalRequests(userUid: string): Promise<Withdrawal[]> {
        try {
            const snapshot = await firestore()
                .collection('withdrawals')
                .doc(userUid)
                .collection('requests')
                .orderBy('created_at', 'desc')
                .limit(10)
                .get();
            return snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    bank_name: data.bankName,
                    withdrawal_account_number: data.withdrawal_account_number,
                    withdrawal_amount: data.withdrawal_amount,
                    withdrawal_status: data.withdrawal_status,
                    withdrawal_decline_reason: data.withdrawal_decline_reason || null,
                    withdrawal_requested_at: data.created_at,
                    withdrawal_approved_at: data.withdrawal_approved_at || null,
                };
            });
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
            throw error;
        }
    }
}