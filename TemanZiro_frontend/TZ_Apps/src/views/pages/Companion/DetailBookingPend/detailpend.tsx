import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./detailpend.module.css";
import { useState, useEffect } from "react";
import IconLocation from "@/assets/icon/location.svg";
import IconDate from "@/assets/icon/date.svg";
import IconCoffe from "@/assets/icon/coffe.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import { useAuth } from "@/controllers/hooks/useAuth";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { doc, collection, getDoc, query, where, getDocs, limit, serverTimestamp, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { activities } from "@/views/components/ActivityGrid/ActivityGrid";

interface BookingDataRequest {
  activity_name: string;
  location: any;
  total_price: number;
  preference_companion: string;
  schedule: {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
  };
  status: string;
}

interface UserDetail {
  name_user: string;
  url_photoprofile_user: string;
}

export default function DetailPendCompanionPage() {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ini nanti kalau ada notification (jadi dia pass bookingId lewat state)
  const passedState = location.state as { bookingId?: string; requesterId?: string } | null;

  const [activeBookingId, setActiveBookingId] = useState<string | null>(passedState?.bookingId || null);
  const [activeRequesterId, setActiveRequesterId] = useState<string | null>(passedState?.requesterId || null);

  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingDataRequest | null>(null);
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationText, setLocationText] = useState("Menentukan lokasi...");
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCoords({ lat: latitude, lng: longitude });
          setLocationText(
            `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          );
        },
        (error) => {
          setLocationError("Akses lokasi ditolak / gagal.");
          setLocationText("Lokasi tidak diketahui");
        }
      );
    } else {
      setLocationError("Browser tidak mendukung Geolocation.");
      setLocationText("Lokasi tidak tersedia");
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchDetailRequest = async () => {
      try {
        setLoading(true);

        let targetBookingId = activeBookingId;
        let targetRequesterId = activeRequesterId;

        if (!targetBookingId || !targetRequesterId) {
          console.log("Mencari pesanan otomatis di notifikasi...");
          const notifRef = collection(db, "notification_alert", currentUser.uid, "notifications");

          const q = query(notifRef, where("status", "==", "pending"), limit(1));
          const notifSnap = await getDocs(q);

          if (!notifSnap.empty) {
            const notifData = notifSnap.docs[0].data();
            targetBookingId = notifData.booking_id;
            targetRequesterId = notifData.requester_id;

            setActiveBookingId(targetBookingId);
            setActiveRequesterId(targetRequesterId);
          } else {
            alert("Tidak ada permintaan baru saat ini.");
            navigate("/companion-dashboard");
            return;
          }
        }

        if (targetBookingId && targetRequesterId) {
          const bookingRef = doc(db, "bookings", targetRequesterId, "booking", targetBookingId);
          const bookingSnap = await getDoc(bookingRef);

          const userRef = doc(db, "profile_user", targetRequesterId);
          const userSnap = await getDoc(userRef);

          if (bookingSnap.exists()) {
            setBookingData(bookingSnap.data() as BookingDataRequest);
          }
          if (userSnap.exists()) {
            setUserData(userSnap.data() as UserDetail);
          }
        }

      } catch (error) {
        console.error("Gagal mengambil detail request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailRequest();
  }, [currentUser, navigate]);

  const handleAction = async (actionStatus: "accepted" | "rejected") => {
    if (!currentUser || !activeBookingId || !activeRequesterId) return;

    try {
      setActionLoading(true);

      const dbStatus = actionStatus === "accepted" ? "konfirmasi" : "rejected";

      const bookingRef = doc(db, "bookings", activeRequesterId, "booking", activeBookingId);

      await updateDoc(bookingRef, {
        status: dbStatus,
        updatedAt: serverTimestamp(),
      });

      // Update notification status di notification_alert
      const notifRef = collection(db, "notification_alert", currentUser.uid, "notifications");
      const q = query(notifRef, where("booking_id", "==", activeBookingId), limit(1));
      const notifSnap = await getDocs(q);

      if (!notifSnap.empty) {
        const notifDocRef = doc(db, "notification_alert", currentUser.uid, "notifications", notifSnap.docs[0].id);
        await updateDoc(notifDocRef, {
          status: dbStatus,
          updatedAt: serverTimestamp(),
        });
      }

      // Simpan ke bookings_companion jika status accepted
      if (actionStatus === "accepted") {
        const bookingsCompanionRef = doc(db, "bookings_companion", currentUser.uid);
        await setDoc(bookingsCompanionRef, {
          bookings: arrayUnion(bookingRef)
        }, { merge: true });
      }

      alert(`Permintaan berhasil di-${actionStatus === "accepted" ? "terima" : "tolak"}.`);

      if (actionStatus === "accepted") {
        navigate("/friends-page");
      } else {
        navigate("/companion-dashboard");
      }
    } catch (error) {
      console.error(`Gagal melakukan aksi ${actionStatus}:`, error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatRupiah = (angka: number = 0) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const profileImage = userData?.url_photoprofile_user || IMGMiniZiro;

  if (loading) {
    return <DataScreenLayout title="Memuat Data..."><p style={{ textAlign: "center", marginTop: "50px" }}>Mengambil detail pesanan...</p></DataScreenLayout>;
  }



  // const [isPopupOpen, setIsPopupOpen] = useState(false);

  const matchedActivity = activities.find(
    (act) => act.title.toLowerCase() === bookingData?.activity_name?.toLowerCase()
  );

  const displayActivityText = matchedActivity?.vibes || bookingData?.activity_name || "Aktivitas";

  return (
    <DataScreenLayout
      title="Info Pencarian"
      rightProfile={userProfile?.url_photoprofile_companion || IMGMiniZiro}
      alignLeft={true}
      noShadow={true}
      contentClassName={style.customPadding}
    >
      <div className={style.cardContainer}>
        {/* --- HEADER --- */}
        <div className={style.headerSection}>
          <img
            src={profileImage}
            alt="Profile Avatar"
            className={style.avatar}
          />
          <h3 className={style.statusText}>+ {formatRupiah(bookingData?.total_price)}</h3>
          <h5 className={style.statusText}>Ekspektasi Pendapatan dari {userData?.name_user || "User"}</h5>
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
              <h4>
                {typeof bookingData?.location === "object" && bookingData.location
                  ? (bookingData.location.address || "Belum ditentukan")
                  : (bookingData?.location || "Belum ditentukan")}
              </h4>
              <p>Location</p>
            </div>
          </div>

          <div className={style.summaryItem}>
            <div className={style.iconWrapper}>
              <img src={IconDate} alt="" className={style.iconOrange3} />
            </div>
            <div className={style.itemText}>
              <h4>{formatDateString(bookingData?.schedule?.start_date || "")}</h4>
              <p>{bookingData?.schedule?.start_time} - {bookingData?.schedule?.end_time}</p>
            </div>
          </div>
        </div>

        <div className={style.divider1}></div>



        {/* {coords ? (
            <iframe
              title="Peta Lokasi User"
              className={style.mapImage}
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
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
        </div> */}

        <div className={style.divider1}></div>

        {/* --- SESSION NOTES --- */}
        <div className={style.notesSection}>
          <h3 className={style.notesTitle}>Session Notes</h3>
          <textarea
            className={style.notesTextarea}
            readOnly={true}
            value={Array.isArray(bookingData?.preference_companion)
              ? bookingData!.preference_companion.join(", ")
              : bookingData?.preference_companion || "Tidak ada preferensi khusus."}
          ></textarea>
        </div>

        <div className={style.divider}></div>

        <div className={style.actionMenu1}>
          <Button onClick={() => handleAction("accepted")} disabled={actionLoading}>
            {actionLoading ? "Memproses..." : "Terima"}
          </Button>
          <Button variant="outline" shadow="none" onClick={() => handleAction("rejected")} disabled={actionLoading}>
            Tolak
          </Button>
        </div>
      </div>
    </DataScreenLayout>
  );
}
