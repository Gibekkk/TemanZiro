import firestore from '@react-native-firebase/firestore';
import { CompanionBookingCount } from '@/domain/models/CompanionModel';

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
                    .where('status', '==', 'selesai')
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
    }
}