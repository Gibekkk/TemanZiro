import firestore from '@react-native-firebase/firestore';
import { CompanionBookingCount, CompanionProfile } from '@/domain/models/CompanionModel';
import { UserProfile } from '@/domain/models/UserModels';

export const CompanionRepository = {
    async getCompanionBookingCount(companionUid: string): Promise<CompanionBookingCount | null> {
        try {
            const cacheRef = firestore().collection('booking_count').doc(companionUid);
            const cacheSnap = await cacheRef.get();

            let needSync = true;
            let currentCount: number = 0;

            if (cacheSnap.exists()) {
                const data = cacheSnap.data() as CompanionBookingCount;
                currentCount = data.booking_count || 0;

                const lastSyncDate = data.last_synced?.toDate();
                const now = new Date();

                if (
                    lastSyncDate &&
                    lastSyncDate.getMonth() === now.getMonth() &&
                    lastSyncDate.getFullYear() === now.getFullYear()
                ) {
                    needSync = false;
                }
            }
            if (needSync) {
                const bookingsSnap = await firestore()
                    .collection('bookings')
                    .where('companion_uid', '==', companionUid)
                    .where('booking_status', '==', 'selesai')
                    .count()
                    .get();
                currentCount = bookingsSnap.data().count;

                await cacheRef.set({
                    booking_count: currentCount,
                    last_synced: firestore.FieldValue.serverTimestamp()
                }, { merge: true });

                const updatedSnap = await cacheRef.get();
                return updatedSnap.exists() ? (updatedSnap.data() as CompanionBookingCount) : null;
            } else {
                return cacheSnap.data() as CompanionBookingCount;
            }
        } catch (error) {
            console.error("Error fetching or syncing booking count:", error);
            throw error;
        }
    },

    async getCompanionProfile(uid: string): Promise<CompanionProfile | null> {
        try {
            const docSnap = await firestore().collection("profile_companion").doc(uid).get();
            if (!docSnap.exists) {
                return null;
            }
            return docSnap.data() as CompanionProfile;
        } catch (error) {
            console.error("Error fetching companion profile:", error);
            throw error;
        }
    },

    subscribeCompanionProfile(uid: string, callback: (profile: CompanionProfile | null) => void): () => void {
        return firestore().collection("profile_companion").doc(uid).onSnapshot((docSnap) => {
            if (!docSnap.exists) {
                callback(null);
            } else {
                callback(docSnap.data() as CompanionProfile);
            }
        },
            (error) => {
                console.error("Error subscribing to companion profile:", error);
            }
        );
    },

    async updateCompanionProfile(uid: string, data: Partial<CompanionProfile>): Promise<void> {
        try {
            await firestore().collection("profile_companion").doc(uid).set({
                ...data,
                updated_at: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error updating companion profile:", error);
            throw error;
        }
    },
}