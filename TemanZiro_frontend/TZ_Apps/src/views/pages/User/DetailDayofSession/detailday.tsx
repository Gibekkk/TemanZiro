import { useState, useEffect } from "react";
import style from "./detailday.module.css";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import IconLocation from "@/assets/icon/location.svg";
import IconChat from "@/assets/icon/chatorange.svg";
import IconStar from "@/assets/icon/starreview.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import CheckInAction from "@/views/components/CheckInBtn/checkinaction";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { doc, getDoc } from "firebase/firestore";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";

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
    start_date?: string;
    start_time?: string;
  };
  profile_companion?: string | { id?: string; path?: string };
  current_target_companion?: string | { id?: string; path?: string };
}

interface CompanionData {
  name_companion?: string;
  url_photoprofile_companion?: string;
  companion_rating?: {
    overall_rating?: number;
  };
  preference_companion?: string[];
}

const parseScheduleDateTime = (date?: string, time?: string) => {
  if (!date) return null;

  const normalizedTime = time && time.length >= 5 ? `${time}:00` : "00:00:00";
  const result = new Date(`${date}T${normalizedTime}`);

  return Number.isNaN(result.getTime()) ? null : result;
};

const toCountdown = (target: Date | null) => {
  if (!target) return { hours: "00", minutes: "00", seconds: "00" };

  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
  };
};

const formatStatus = (status?: string) => {
  if (!status) return "-";
  const cleaned = status.replace(/[_-]/g, " ");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const formatStartTime = (time?: string) => time ? `Starts at ${time}` : "Waktu belum ditentukan";

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

export default function DetailDayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  const state = location.state as LocationState | undefined;
  const bookingId = state?.bookingId;

  const [ bookingData, setBookingData ] = useState<BookingData | null>(null);
  const [companionData, setCompanionData] = useState<CompanionData | null>(null);
  const [loading, setLoading] = useState(true);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fallbackCoords, setFallbackCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState("");

  const resolvedCompanionId =
    extractCompanionId(bookingData?.profile_companion) ||
    extractCompanionId(bookingData?.current_target_companion);

  const handleOpenChat = () => {
    if (!currentUser || !bookingId || !resolvedCompanionId) {
      alert("Room chat belum bisa dibuka. Companion belum tersedia.");
      return;
    }

    navigate("/room-chat", {
      state: {
        bookingId,
        companionId: resolvedCompanionId,
        targetId: resolvedCompanionId,
        companionName: companionData?.name_companion || "Companion",
        companionAvatar: companionData?.url_photoprofile_companion || ImgPlaceholder,
        bookingStatus: formatStatus(bookingData?.status),
        bookingRefPath: `/bookings/${currentUser.uid}/booking/${bookingId}`,
      },
    });
  }

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
            // Fallback: Cari di bookings_companion milik companion
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

  const [countdown, setCountdown] = useState(() => toCountdown(null));

  useEffect(() => {
    const start = parseScheduleDateTime(
      bookingData?.schedule?.start_date,
      bookingData?.schedule?.start_time,
    );

    setCountdown(toCountdown(start));

    if (!start) return;

    const timer = setInterval(() => {
      setCountdown(toCountdown(start));
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData?.schedule?.start_date, bookingData?.schedule?.start_time]);

  const isToday =
    Boolean(bookingData?.schedule?.start_date) &&
    bookingData?.schedule?.start_date === new Date().toISOString().slice(0, 10);

  const displayCompanionName = companionData?.name_companion || "Companion belum dipilih";
  const displayCompanionAvatar = companionData?.url_photoprofile_companion || ImgPlaceholder;
  const displayCompanionRating =
    companionData?.companion_rating?.overall_rating !== undefined
      ? companionData.companion_rating.overall_rating.toFixed(1)
      : "-";
  const displayCompanionTag =
    companionData?.preference_companion?.[0]?.toUpperCase() || "-";
  const locationError = geoError;

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

  return (
    <DataScreenLayout title="Sesi Mendatang" noShadow={true} contentClassName={style.customPadding}>
      <div className={style.timerSection}>
        <h4 className={style.sectionTitle}>MULAI DARI</h4>
        <div className={style.timerGrid}>
          <div className={style.timerBox}>
            <div className={style.number}>
              <span className={style.timeNum}>{countdown.hours}</span>
            </div>
            <span className={style.timeLabel}>JAM</span>
          </div>
          <div className={style.timerBox}>
            <div className={style.number}>
              <span className={style.timeNum}>{countdown.minutes}</span>
            </div>
            <span className={style.timeLabel}>MENIT</span>
          </div>
          <div className={style.timerBox}>
            <div className={style.number}>
              <span className={style.timeNum}>{countdown.seconds}</span>
            </div>
            <span className={style.timeLabel}>DETIK</span>
          </div>
        </div>
      </div>

      {/* --- SESSION STATUS CARD --- */}
      <div className={style.card}>
        <div className={style.cardHeaderRow}>
          <span className={style.cardLabel}>STATUS SESI</span>
          <span className={style.tagToday}>{isToday ? "Hari ini" : "Terjadwal"}</span>
        </div>

        <div className={style.statusRow}>
          <div className={style.dotGreen}></div>
          <h3 className={style.statusText}>{formatStatus(bookingData?.status)}</h3>
        </div>

        <div className={style.divider}></div>

        <div className={style.locationRow}>
          <div className={style.iconBox}>
            {/* Ganti SVG dengan: <img src={IconLocation} alt="Location" width="20" height="20" /> */}
            <img src={IconLocation} alt="Location" width="20" height="20" />
          </div>
          <div className={style.locationInfo}>
            <span className={style.cardLabel}>LOKASI MEETUP</span>
            <h4 className={style.locationTitle}>
              {locationText}
            </h4>
            <p className={style.locationSubtitle}>{formatStartTime(bookingData?.schedule?.start_time)}</p>
          </div>
        </div>
      </div>

      {/* --- COMPANION CARD --- */}
      <div className={style.card}>
        <div className={style.companionRow}>
          <img
            src={displayCompanionAvatar}
            alt={displayCompanionName}
            className={style.avatar}
          />
          <div className={style.companionInfo}>
            <span className={style.cardLabel}>YOUR COMPANION</span>
            <h4 className={style.companionName}>{displayCompanionName}</h4>

            <div className={style.tagsRow}>
              <span className={style.tagListener}>{displayCompanionTag}</span>
              <div className={style.ratingRow}>
                {/* Ganti SVG dengan: <img src={IconStar} alt="Star" width="12" height="12" /> */}
                <img src={IconStar} alt="Star" width="12" height="12" />
                {displayCompanionRating}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className={style.actionArea}>
        <CheckInAction 
          bookingId={bookingId} 
        />
      </div>

      <Button variant="outline" shadow="none" onClick={handleOpenChat}>
        <img src={IconChat} alt="Chat" className={style.btnIcon} />
        Open Chat
      </Button>

      {/* --- MAP SECTION --- */}
      <div className={style.mapWrapper}>
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
              <p>{locationError ? "Peta tidak tersedia" : "Memuat peta..."}</p>
            </div>
          )}
      </div>
    </DataScreenLayout>
  );
}
