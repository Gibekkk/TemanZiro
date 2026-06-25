import { Bookings } from "@/domain/models/BookingModel";
import { create } from 'zustand';

interface BookingStore {
    draftBooking: Bookings | null;
    setDraftBooking: (data: Bookings) => void;
    clearDraftBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    draftBooking: null,
    setDraftBooking: (data: Bookings) => set({ draftBooking: data }),
    clearDraftBooking: () => set({ draftBooking: null }),
}));