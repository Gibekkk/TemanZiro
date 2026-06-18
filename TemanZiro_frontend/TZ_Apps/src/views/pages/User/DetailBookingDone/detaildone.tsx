import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./detaildone.module.css";
import { useState, useEffect } from "react";
import IconLocation from "@/assets/icon/location.svg";
import IconDate from "@/assets/icon/date.svg";
import IconCoffe from "@/assets/icon/coffe.svg";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { doc, getDoc } from "firebase/firestore";

interface LocationState {
  bookingId: string;
  userId?: string;
  requesterId?: string;
}

interface BookingData {
  id?: string;
  status?: string;
  location?:
  | string
  | {
    address?: string;
    lat?: number;
    lng?: number;
  };
  schedule?: {
    start_time?: string;
    end_time?: string;
  };
  profile_companion?: string | { id?: string; path?: string };
  current_target_companion?: string | { id?: string; path?: string };
  total_price?: number;
  activity_name?: string;
  preference_companion?: string[];
}

interface CompanionData {
  name_companion?: string;
  url_photoprofile_companion?: string;
  companion_rating?: {
    overall_rating?: number;
  };
  preference_companion?: string[];
}

interface UserData {
  name_user?: string;
  url_photoprofile_user?: string;
}

const formatDate = (value: any) => {
  if (!value) return "-";

  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRupiah = (angka: number = 0) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const extractCompanionId = (
  value?: string | { id?: string; path?: string } | null,
) => {
  if (!value) return undefined;

  if (typeof value === "string") {
    return value.includes("/") ? value.split("/").pop() : value;
  }

  if (typeof value === "object") {
    if (value.id) return value.id;
    if (value.path) return value.path.split("/").pop();
  }

  return undefined;
};

const getDurationHoursText = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return "";
  try {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24 * 60;
    const hours = diff / 60;
    return ` (${hours} Hours)`;
  } catch (e) {
    return "";
  }
};

const getDurationText = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return "Session Fee";
  try {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24 * 60;
    const hours = diff / 60;
    return `Session Fee (${hours} jam)`;
  } catch (e) {
    return "Session Fee";
  }
};

export default function DetailDonePage() {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | undefined;
  const bookingId = state?.bookingId;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [companionData, setCompanionData] = useState<CompanionData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fallbackCoords, setFallbackCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      console.error("Booking ID tidak ditemukan di state lokasi.");
      setLoading(false);
      return;
    }

    if (!currentUser) return;

    const fetchBookingDetail = async () => {
      try {
        let targetUserId = currentUser.uid;

        if (role === "companion") {
          const passedUserId = state?.userId || state?.requesterId;
          if (passedUserId) {
            targetUserId = passedUserId;
          } else {
            const bookingsCompanionRef = doc(db, "bookings_companion", currentUser.uid);
            const bookingsCompanionSnap = await getDoc(bookingsCompanionRef);
            const bookingsArray = bookingsCompanionSnap.exists()
              ? (bookingsCompanionSnap.data()?.bookings ?? [])
              : [];

            const matchingRef = bookingsArray.find((ref: any) => ref.path.endsWith(`/${bookingId}`));
            if (matchingRef) {
              const pathParts = matchingRef.path.split("/");
              targetUserId = pathParts[1];
            }
          }
        }

        const bookingRef = doc(db, "bookings", targetUserId, "booking", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const nextBookingData = { id: bookingSnap.id, ...bookingSnap.data() } as BookingData;
          setBookingData(nextBookingData);

          // Fetch user/booker profile
          const userRef = doc(db, "profile_user", targetUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data() as UserData);
          }

          // Fetch companion profile
          const companionId =
            extractCompanionId(nextBookingData.profile_companion) ||
            extractCompanionId(nextBookingData.current_target_companion);

          if (companionId) {
            const companionRef = doc(db, "profile_companion", companionId);
            const companionSnap = await getDoc(companionRef);

            if (companionSnap.exists()) {
              setCompanionData(companionSnap.data() as CompanionData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching booking detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId, currentUser, role, state]);

  useEffect(() => {
    if (!bookingData?.location) {
      setCoords(null);
      return;
    }

    const loc = bookingData.location;
    if (typeof loc === "object" && typeof loc.lat === "number" && typeof loc.lng === "number") {
      setCoords({ lat: loc.lat, lng: loc.lng });
    }
  }, [bookingData]);

  useEffect(() => {
    if (!loading && bookingData && !bookingData.location) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setFallbackCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setGeoError("Akses lokasi ditolak / gagal.")
        );
      } else {
        setGeoError("Browser tidak mendukung Geolocation.");
      }
    }
  }, [loading, bookingData]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Memuat detail aktivitas...</p>;
  }

  if (!bookingId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Akses ditolak. Silakan kembali ke halaman utama.</p>
        <button onClick={() => navigate("/dashboard")}>Kembali</button>
      </div>
    );
  }

  let locationText = "Menentukan lokasi...";
  let finalCoords: { lat: number; lng: number } | null = coords;

  if (bookingData?.location) {
    const loc = bookingData.location;
    if (typeof loc === "object" && loc.address) {
      locationText = loc.address;
      if (typeof loc.lat === "number" && typeof loc.lng === "number") {
        finalCoords = { lat: loc.lat, lng: loc.lng };
      }
    } else if (typeof loc === "string") {
      locationText = loc;
    }
  } else if (!loading) {
    finalCoords = fallbackCoords;
    locationText = geoError ? geoError : fallbackCoords
      ? `Lat: ${fallbackCoords.lat.toFixed(4)}, Lng: ${fallbackCoords.lng.toFixed(4)}`
      : "Meminta akses lokasi...";
  }

  const displayCompanionName = companionData?.name_companion || "Companion";
  const displayAvatar = role === "companion"
    ? (userData?.url_photoprofile_user || ImgPlaceholder)
    : (companionData?.url_photoprofile_companion || ImgPlaceholder);

  const displayNotes = bookingData?.preference_companion
    ? (Array.isArray(bookingData.preference_companion)
      ? bookingData.preference_companion.join(", ")
      : bookingData.preference_companion)
    : `Tidak ada preferensi khusus untuk ${displayCompanionName}.`;

  return (
    <DataScreenLayout
      title="Info Pemesanan"
      rightProfile={currentUser?.photoURL ?? ImgPlaceholder}
      alignLeft={true}
      noShadow={true}
      contentClassName={style.customPadding}
    >
      <div className={style.headerStatus}>
        <div className={style.checkIconBox}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 className={style.statusText}>Sesi Berhasil</h2>
        <h1 className={style.priceText}>{formatRupiah(bookingData?.total_price || 0)}</h1>
      </div>
      <div className={style.cardContainer}>
        {/* --- HEADER --- */}
        <img
          src={displayAvatar}
          alt="Profile Avatar"
          className={style.overlappingAvatar}
        />

        <div className={style.cardContent}>
          <div className={style.paymentSection}>
            <div className={style.paymentRow}>
              <span className={style.paymentLabel}>
                {getDurationText(bookingData?.schedule?.start_time, bookingData?.schedule?.end_time)}
              </span>
              <span className={style.paymentValue}>
                {formatRupiah(Math.max(0, (bookingData?.total_price || 0) - 15000))}
              </span>
            </div>
            <div className={style.paymentRow}>
              <span className={style.paymentLabel}>Service Fee</span>
              {/* Ini masih  */}
              <span className={style.paymentValue}>{formatRupiah(15000)}</span>
            </div>
            <div className={`${style.paymentRow} ${style.totalRow}`}>
              <span className={style.paymentLabel}>Total Pembayaran</span>
              <span className={style.totalValue}>{formatRupiah(bookingData?.total_price || 0)}</span>
            </div>
          </div>

          <div className={style.divider}></div>

          {/* --- ACTIVITY DETAILS --- */}
          <div className={style.summaryCard}>
            <div className={style.summaryItem}>
              <div className={style.iconWrapper}>
                <img src={IconCoffe} alt="" className={style.iconOrange1} />
              </div>
              <div className={style.itemText}>
                <h4>{bookingData?.activity_name || "Aktivitas"}</h4>
                <p>Activity Type</p>
              </div>
            </div>

            <div className={style.summaryItem}>
              <div className={style.iconWrapper}>
                <img src={IconLocation} alt="" className={style.iconOrange2} />
              </div>
              <div className={style.itemText}>
                <h4>{locationText}</h4>
                <p>Location</p>
              </div>
            </div>

            <div className={style.summaryItem}>
              <div className={style.iconWrapper}>
                <img src={IconDate} alt="" className={style.iconOrange3} />
              </div>
              <div className={style.itemText}>
                <h4>{formatDate(bookingData?.schedule?.start_time)}</h4>
                <p>
                  {bookingData?.schedule?.start_time || "-"} - {bookingData?.schedule?.end_time || "-"}
                  {getDurationHoursText(bookingData?.schedule?.start_time, bookingData?.schedule?.end_time)}
                </p>
              </div>
            </div>

            {finalCoords ? (
              <iframe
                title="Peta Lokasi User"
                className={style.mapImage}
                src={`https://maps.google.com/maps?q=${finalCoords.lat},${finalCoords.lng}&z=15&output=embed`}
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
              ></iframe>
            ) : (
              // Loading state atau jika error
              <div className={`${style.mapImage} ${style.mapLoading}`}>
                <p>
                  {geoError ? "Peta tidak tersedia" : "Memuat peta..."}
                </p>
              </div>
            )}
          </div>

          <div className={style.divider1}></div>

          {/* --- SESSION NOTES --- */}
          <div className={style.notesSection}>
            <h3 className={style.notesTitle}>Session Notes</h3>
            <textarea
              className={style.notesTextarea}
              placeholder="No specific notes provided."
              readOnly={true}
              value={displayNotes}
            ></textarea>
          </div>
        </div>
      </div>
    </DataScreenLayout>
  );
}
