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
}