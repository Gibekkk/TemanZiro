import nongkrongImg from "@/assets/images/nongkrong.jpg";
import olahragaImg from "@/assets/images/olahraga.jpg";
import belajarImg from "@/assets/images/belajar.jpg";
import jalanImg from "@/assets/images/jalan.jpg";
import hiburanImg from "@/assets/images/hiburan.jpg";
import kulinerImg from "@/assets/images/kuliner.jpg";

export const ACTIVITY_TYPE = [
  { id: "1", title: "Nongkrong", value: "nongkrong", vibes: "Cafe & Chill", image: nongkrongImg },
  { id: "2", title: "Olahraga", value: "olahraga", vibes: "Sports & Active", image: olahragaImg },
  { id: "3", title: "Belajar", value: "belajar", vibes: "Study & Work", image: belajarImg },
  { id: "4", title: "Jalan-jalan", value: "jalan-jalan", vibes: "Explore & Travel", image: jalanImg },
  { id: "5", title: "Hiburan", value: "hiburan", vibes: "Film & Events", image: hiburanImg },
  { id: "6", title: "Kuliner", value: "kuliner", vibes: "Food & Dining", image: kulinerImg },
] as const;

export const TIME_MODE = {
  STANDARD: "standard",
  FULL_DAY: "full_day",
} as const;

export const BOOKING_STATUS = {
  MENUNGGU_PEMBAYARAN: "menunggu_pembayaran",
  MENCARI: "mencari",
  KONFIRMASI: "konfirmasi",
  BERLANGSUNG: "berlangsung",
  SELESAI: "selesai",
  PERMINTAAN: "permintaan",
  BATAL: "batal",
} as const;

export type TimeMode = typeof TIME_MODE[keyof typeof TIME_MODE];
export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
export type ActivityType = typeof ACTIVITY_TYPE[number]["value"];

export const ACTIVITY_TYPE_VALUES = ACTIVITY_TYPE.map((activity) => activity.value);

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS);