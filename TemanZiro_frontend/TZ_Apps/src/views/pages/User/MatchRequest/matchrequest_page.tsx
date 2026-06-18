import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import Button from "@/views/components/OrangeButton/orangebutton";
import style from "./matchrequest_page.module.css";
import IconCoffe from "@/assets/icon/coffe.svg";
import IconPreferences from "@/assets/icon/preferences.svg";
import IconDate from "@/assets/icon/date.svg";
import IconMinat from "@/assets/icon/minat.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "@/config/firebase_config";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import { startMatchingProcess } from "@/controllers/matching_controller";

export interface BookingData {
  activity_name: string;
  preference_companion: string[];
  location?: string;
  current_target_companion?: string;
  schedule: {
    start_date: any;
    end_date: any;
    start_time: string;
    end_time: string;
    time_mode: string;
  };
  status: string;
  createdAt: any;
  updatedAt?: any;
}

export default function MatchRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const { currentUser } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !bookingId) return;

    const bookingRef = doc(db, "bookings", currentUser.uid, "booking", bookingId);

    const unsubscribe = onSnapshot(bookingRef, 
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as BookingData;
          setBookingData(data);

          if (data.status === "accepted" || data.status === "konfirmasi") {
            navigate("/match-found", { state: { bookingId: bookingId } });
          }
          else if (data.status === "rejected") {
            console.log("Permintaan ditolak. Mencari yang lain.");

            const rejectedCompanionId = data.current_target_companion;

            await updateDoc(bookingRef, { status: "mencari" });

            try {
              const matchResult = await startMatchingProcess(bookingId, data, currentUser.uid, rejectedCompanionId ? [rejectedCompanionId] : []);

              if (!matchResult.success) {
                alert("Companion sedang sibuk. Silahkan ganti preferensi Anda.");
                navigate("/dashboard")
              }
            } catch (error) {
              console.error("Gagal melakukan rematching:", error);
            }

          }
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, bookingId, navigate]);

  // =================================================================
  // ⚠️ MOCK UX TEST: Hapus blok kode ini jika matching asli sudah jalan
  // =================================================================
  // useEffect(() => {
  //   if (!bookingId) return;

  //   // Simulasi menunggu selama 3 detik, lalu paksa pindah halaman
  //   const mockTimer = setTimeout(() => {
  //     console.log("Mock UX: Memaksa navigasi ke Match Found...");
  //     navigate("/match-found", { state: { bookingId: bookingId } });
  //   }, 3000); // 3000 ms = 3 detik

  //   // Bersihkan timer jika komponen di-unmount (mencegah memory leak)
  //   return () => clearTimeout(mockTimer);
  // }, [bookingId, navigate]);
  // =================================================================
  // ⚠️ END MOCK
  // =================================================================

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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  return (
    <DataScreenLayout title="Mencari Companion Kamu">
      <div className={style.pageContainer}>

        {/* Top Graphic Banner */}
        <div className={style.graphicBanner}>
          <div className={style.circleIcon}>
            <img src={IconCoffe} alt="" />
          </div>
          <div className={style.loadingDots}>
            <span className={style.dot}></span>
            <span className={style.dot}></span>
            <span className={style.dot}></span>
          </div>
        </div>

        {/* Text Information */}
        <div className={style.textInfo}>
          <h1 className={style.title}>Permintaan Telah Dikirim</h1>
          <p className={style.subtitle}>
            Kami sedang mencari teman yang tepat untuk aktivitas Anda. Tenang saja, kami akan segera menghubungi Anda.
          </p>
        </div>

        {/* Request Summary Card */}
        <div className={style.summaryCard}>
          <p className={style.summaryHeader}>REQUEST SUMMARY</p>

          {loading ? (
            <p style={{ textAlign: "center" }}>Memuat data...</p>
          ) : !bookingData ? (
            <p style={{ textAlign: "center" }}>Data tidak ditemukan.</p>
          ) : (
            <div className={style.summaryList}>

              {/* Activity */}
              <div className={style.summaryItem}>
                <div className={style.iconWrapper}>
                  <img src={IconMinat} alt="" />
                </div>
                <div className={style.itemDetails}>
                  <span className={style.itemLabel}>Activity</span>
                  <span className={style.itemValue}>
                    {bookingData.activity_name}
                  </span>
                </div>
              </div>

              {/* Preferences */}
              <div className={style.summaryItem}>
                <div className={style.iconWrapper}>
                  <img src={IconPreferences} alt="" />
                </div>
                <div className={style.itemDetails}>
                  <span className={style.itemLabel}>Preferences</span>
                  <div className={style.pillContainer}>
                    {bookingData.preference_companion.length > 0 ? (
                      bookingData.preference_companion.map((pref) => (
                        <span key={pref} className={style.pill}>
                          {pref}
                        </span>
                      ))
                    ) : (
                      <span className={style.itemValue}>Tidak ada preferensi</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className={style.summaryItem}>
                <div className={style.iconWrapper}>
                  <img src={IconDate} alt="" />
                </div>
                <div className={style.itemDetails}>
                  <span className={style.itemLabel}>Tanggal</span>
                  <span className={style.itemValue}>
                    {formatDate(bookingData.schedule.start_date)}
                    {" — "}
                    {formatDate(bookingData.schedule.end_date)}
                  </span>
                  <span className={style.itemValue}>
                    {bookingData.schedule.start_time} - {bookingData.schedule.end_time}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

        <Button variant="primary" className={style.buttonskip} onClick={handleBackToHome}>
          Kembali ke Home
        </Button>
        {/* <Button variant="ghost" shadow="none" className={style.buttonskip} onClick={handleCancelRequest}>
          Batalkan Permintaan
        </Button> */}
      </div>
    </DataScreenLayout>
  );
}