import { Bookings } from "@/domain/models/BookingModel";
import firestore from "@react-native-firebase/firestore";

export const BookingRepository = {
    async getBookingDetails(bookingId: string): Promise<Bookings | null> {
        try {
            const docSnap = await firestore().collection("bookings").doc(bookingId).get();
            if (!docSnap.exists) {
                return null;
            }
            return docSnap.data() as Bookings;
        } catch (error) {
            console.error("Error fetching booking details:", error);
            throw error;
        }
    },

    subscribeBookingDetails(bookingId: string, callback: (details: Bookings | null) => void): () => void {
        return firestore().collection("bookings").doc(bookingId).onSnapshot((docSnap) => {
            if (!docSnap.exists) {
                callback(null);
            } else {
                callback(docSnap.data() as Bookings);
            }
        },
        (error) => {
            console.error("Error subscribing to booking details:", error);
            }
        );
    },

    async updateBookingDetails(bookingId: string, data: Partial<Bookings>): Promise<void> {
        try {
            await firestore().collection("bookings").doc(bookingId).set({
                ...data,
                updated_at: firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error updating booking details:", error);
            throw error;
        }
    },

    async markBookingAsCompleted(bookingId: string, companionUid: string): Promise<void> {
        try {
            const db = firestore();
            const batch = db.batch();

            const bookingRef = db.collection('bookings').doc(bookingId);
            batch.update(bookingRef, { booking_status: 'selesai' });

            const cacheRef = db.collection('booking_count').doc(companionUid);
            batch.set(cacheRef, {
                booking_count: firestore.FieldValue.increment(1),
                last_synced: firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            await batch.commit();
        } catch (error) {
            console.error("Error completing booking and updating cache:", error);
            throw error;
        }
    },

    async getTodayBookings(companionUid: string): Promise<Bookings[]> {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const querySnap = await firestore()
                .collection("bookings")
                .where("companion_uid", "==", companionUid) 
                .where("booking_status", "==", "konfirmasi")
                .where("schedule.start_date", ">=", firestore.Timestamp.fromDate(startOfDay))
                .where("schedule.start_date", "<=", firestore.Timestamp.fromDate(endOfDay))
                .orderBy("schedule.start_date", "asc")
                .get();
            return querySnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as unknown as Bookings));
        } catch (error) {
            console.error("Error fetching today's bookings:", error);
            throw error;
        }
    }
}