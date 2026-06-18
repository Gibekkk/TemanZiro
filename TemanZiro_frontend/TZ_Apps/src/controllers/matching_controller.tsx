import { db } from "@/config/firebase_config";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, Timestamp, getDoc, addDoc } from "firebase/firestore";

type ScheduleValue = string | Date | Timestamp | null | undefined;

interface BookingSchedule {
  start_date?: ScheduleValue;
  end_date?: ScheduleValue;
  start_time?: string | null;
  end_time?: string | null;
}

interface BookingRecord {
  status?: string;
  schedule?: BookingSchedule;
}

export const normalizeDate = (value: ScheduleValue) => {
  if (!value) return null;

  if (value instanceof Timestamp) {
    return value.toDate().toISOString().slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return null;
};

const normalizeTime = (value: string | null | undefined) => value ?? null;

export const startMatchingProcess = async (
  bookingId: string,
  bookingData: any,
  userId: string,
  excludedIds: string[] = []
) => {
  try {
    const companionRef = collection(db, "profile_companion");
    const [minAge, maxAge] = bookingData.age_range_companion;
    let q;
    if (bookingData.gender_companion && bookingData.gender_companion !== "Tidak Memilih") {
      q = query(
        companionRef,
        where("gender_companion", "==", bookingData.gender_companion),
        where("preference_activity_companion", "array-contains", bookingData.activity_name),
        where("age_companion", ">=", minAge),
        where("age_companion", "<=", maxAge),
      );
    } else {
      q = query(
        companionRef,
        where("preference_activity_companion", "array-contains", bookingData.activity_name),
        where("age_companion", ">=", minAge),
        where("age_companion", "<=", maxAge),
      );
    }

    const querySnapshot = await getDocs(q);
    const candidates: any[] = [];

    for (const docSnap of querySnapshot.docs) {
      const companionId = docSnap.id;
      const companion = docSnap.data();

      if (excludedIds.includes(companionId) || companionId === userId) continue;

      // Ini untuk lokasi

      // const bookingLocationStr = typeof bookingData.location === "string"
      //   ? bookingData.location
      //   : bookingData.location?.address || "";

      // if (companion.city_companion && !bookingLocationStr.toLowerCase().includes(companion.city_companion.toLowerCase())) {
      //   continue;
      // }

      // ini kalau mau aktifkan kasih cocok preferensi juga

      // const matchesCompanionPreference =
      //   !bookingData.preference_companion ||
      //   bookingData.preference_companion.length === 0 ||
      //   bookingData.preference_companion.some(
      //     (pref: string) => companion.preference_companion?.includes(pref)
      //   );
      // if (!matchesCompanionPreference) continue;

      // const hasCommonInterest = bookingData.preference_companion.some(
      //   (pref: string) => companion.interests?.includes(pref)
      // );
      // if (!hasCommonInterest) continue;

      const isBusy = await checkConflict(companionId, bookingData.schedule);
      if (isBusy) continue;

      candidates.push({ id: companionId, ...companion });
    }

    if (candidates.length > 0) {
      const targetCompanion = candidates[0];
      await sendRequestToCompanion(bookingId, userId, targetCompanion.id, bookingData);
      return { success: true, targetId: targetCompanion.id };
    }

    return { success: false, message: "No companions found" };
  } catch (error) {
    console.error("Matching Logic Error:", error);
    throw error;
  }
};

const checkConflict = async (companionId: string, newSchedule: any) => {
  const companionBookingRef = collection(db, "booking_companion", companionId, "bookings");
  // const q = query(companionBookingRef, where("status", "==", "accepted"));
  const snap = await getDocs(companionBookingRef);

  if (snap.empty) return false;

  for (const docSnapshot of snap.docs) {
    const data = docSnapshot.data();

    const bookingRef = data.booking_ref;

    if (bookingRef) {
      const actualBookingSnap = await getDoc(bookingRef);
      const bookingData = actualBookingSnap.data() as BookingRecord | undefined;

      if (bookingData?.status === "konfirmasi" && bookingData.schedule) {
        const existingStartDate = normalizeDate(bookingData.schedule.start_date);
        const existingEndDate = normalizeDate(bookingData.schedule.end_date);
        const newStartDate = normalizeDate(newSchedule.start_date);
        const newEndDate = normalizeDate(newSchedule.end_date);

        const existingStartTime = normalizeTime(bookingData.schedule.start_time) ?? "00:00";
        const existingEndTime = normalizeTime(bookingData.schedule.end_time) ?? "23:59";
        const newStartTime = normalizeTime(newSchedule.start_time) ?? "00:00";
        const newEndTime = normalizeTime(newSchedule.end_time) ?? "23:59";

        const dateOverlap =
          existingStartDate !== null &&
          existingEndDate !== null &&
          newStartDate !== null &&
          newEndDate !== null &&
          existingStartDate <= newEndDate &&
          existingEndDate >= newStartDate;

        const timeOverlap = existingStartTime < newEndTime && existingEndTime > newStartTime;

        if (dateOverlap && timeOverlap) {
          return true;
        }
      }
    }
  }
  return false;
};

const sendRequestToCompanion = async (bookingId: string, userId: string, companionId: string, bookingData: any) => {
  // Update status booking user
  const userBookingRef = doc(db, "bookings", userId, "booking", bookingId);
  await updateDoc(userBookingRef, {
    current_target_companion: companionId,
    status: "waiting_approval",
    updatedAt: serverTimestamp()
  });

  // Kirim notifikasi/request ke companion target
  // const companionRequestRef = doc(db, "notification_alert", companionId, "requests", bookingId);
  const companionRequestRef = collection(db, "notification_alert", companionId, "notifications");
  await addDoc(companionRequestRef, {
    booking_id: bookingId,
    requester_id: userId,
    status: "pending",
    type: "match_request",
    notification_datetime: serverTimestamp(),
    activiy_name: bookingData.activity_name,
    // notification_content: `Anda menerima permintaan match dari ${userId} untuk ${bookingData.activity_name} pada ${normalizeDate(bookingData.schedule.start_date)}`
  });

};