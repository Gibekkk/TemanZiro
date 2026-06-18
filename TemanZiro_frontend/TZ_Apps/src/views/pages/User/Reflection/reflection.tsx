import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./reflection.module.css";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import IconStarFilled from "@/assets/icon/starnon.svg";
import IconStarOutline from "@/assets/icon/staron.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import { useAuth } from "@/controllers/hooks/useAuth";
import { db } from "@/config/firebase_config";
import { collection, onSnapshot, orderBy, query, doc, serverTimestamp, setDoc } from "firebase/firestore";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";


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

const hasBookingReview = (data: any) => {
  return Boolean(
    data?.review ||
    data?.reviewed ||
    data?.has_review ||
    data?.review_submitted ||
    data?.review_status === "done" ||
    data?.review_status === true
  );
};

export default function ReflectionPage() {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([
    // "Safe",
    // "Heard",
  ]);
  const { currentUser, loading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passedBookingId = location.state?.bookingId;
  const [bookingToReview, setBookingToReview] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [companionData, setCompanionData] = useState<any>(null);

  // Menyimpan nilai rating bintang (Wajib diisi, default 0)
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Menyimpan input teks catatan
  const [feedback, setFeedback] = useState("");

  // Daftar pilihan yang tersedia
  const feelingOptions = [
    "Safe",
    "Inspired",
    "Heard",
    "Calm",
    "Understood",
    "Empowered",
  ];

  // --- FUNGSI KLIK PILL ---
  const toggleFeeling = (feeling: string) => {
    // Jika sudah ada di array, hapus (unselect)
    if (selectedFeelings.includes(feeling)) {
      setSelectedFeelings(selectedFeelings.filter((f) => f !== feeling));
    } else {
      // Jika belum ada, tambahkan (select)
      setSelectedFeelings([...selectedFeelings, feeling]);
    }
  };

  useEffect(() => {
    if (loading || !currentUser) return;
    if (role === "companion") {
      navigate("/companion-dashboard", { replace: true });
    }
  }, [loading, currentUser, role, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    setBookingLoading(true);
    setBookingError(null);

    if (passedBookingId) {
      const bookingRef = doc(db, "bookings", currentUser.uid, "booking", passedBookingId);
      const unsubscribe = onSnapshot(
        bookingRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBookingToReview({ id: docSnap.id, ...data });
          } else {
            setBookingError("Booking tidak ditemukan.");
          }
          setBookingLoading(false);
        },
        (error) => {
          setBookingError(error.message || "Gagal memuat booking");
          setBookingLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      const bookingsRef = collection(db, "bookings", currentUser.uid, "booking");
      const bookingsQuery = query(bookingsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        bookingsQuery,
        (snapshot) => {
          let foundBooking: any = null;

          snapshot.docs.some((docSnap) => {
            const data = docSnap.data();
            const status = String(data?.status || "").toLowerCase();

            if (status !== "completed" && status !== "selesai") {
              return false;
            }

            if (hasBookingReview(data)) {
              return false;
            }

            foundBooking = { id: docSnap.id, ...data };
            return true;
          });

          setBookingToReview(foundBooking);
          setBookingLoading(false);
        },
        (error) => {
          setBookingError(error.message || "Gagal memuat booking");
          setBookingLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [currentUser, passedBookingId]);

  useEffect(() => {
    if (!bookingToReview) {
      setCompanionData(null);
      return;
    }

    let companionId = bookingToReview.current_target_companion || bookingToReview.profile_companion;
    if (companionId && typeof companionId === "object") {
      companionId = companionId.id || companionId.path?.split("/").pop();
    }

    if (companionId) {
      const companionRef = doc(db, "profile_companion", companionId);
      const unsubscribe = onSnapshot(
        companionRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setCompanionData(docSnap.data());
          }
        },
        (error) => {
          console.error("Gagal memuat profil companion:", error);
        }
      );
      return () => unsubscribe();
    }
  }, [bookingToReview]);

  const handleSubmitReview = async () => {
    if (!currentUser || !bookingToReview) return;

    if (rating === 0) {
      alert("Silakan berikan rating (bintang) terlebih dahulu.");
      return;
    }

    try {
      setSubmitting(true);
      let companionId = bookingToReview.current_target_companion || bookingToReview.profile_companion;
      if (companionId && typeof companionId === "object") {
        companionId = companionId.id || companionId.path?.split("/").pop();
      }

      if (companionId) {
        const reflectionRef = doc(db, "profile_companion", companionId, "reflections", bookingToReview.id);
        await setDoc(reflectionRef, {
          review: {
            rating,
            feedback,
            feelings: selectedFeelings,
          },
          profile_user_ref: currentUser.uid,
          status: "done",
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      alert("Terima kasih atas masukan Anda!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
      alert("Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && role !== "booker") {
    return (
      <DataScreenLayout
        title="Sesi Refleksi"
        noShadow={true}
        contentClassName={style.customPadding}
      >
        <div className={style.bookingSummary}>
          <p className={style.bookingText}>
            Halaman ini hanya untuk Booker. Mengalihkan Anda jika ada akses Companion.
          </p>
        </div>
      </DataScreenLayout>
    );
  }

  return (
    <DataScreenLayout
      title="Sesi Refleksi"
      noShadow={true}
      contentClassName={style.customPadding}
    >
      {/* --- AVATAR & ONLINE DOT --- */}
      <div className={style.avatarContainer}>
        <div className={style.avatarWrapper}>
          <img
            src={companionData?.url_photoprofile_companion || ImgPlaceholder}
            alt={companionData?.name_companion || "Companion"}
            className={style.avatar}
          />
        </div>
        <div className={style.onlineDot}></div>
      </div>

      <h1 className={style.question}>
        How did your session with
        <br />
        {companionData?.name_companion || "Companion"} feel?
      </h1>
      <div className={style.bookingSummary}>
        {bookingLoading ? (
          <p className={style.bookingText}>Memeriksa booking terakhir yang selesai...</p>
        ) : bookingError ? (
          <p className={style.bookingText}>Terjadi kesalahan saat memuat booking: {bookingError}</p>
        ) : bookingToReview ? (
          <>
            <p className={style.bookingTitle}>Booking terakhir Anda yang selesai</p>
            <p className={style.bookingText}>
              Aktivitas: {bookingToReview.activity_name || "-"}
              <br />
              Lokasi: {typeof bookingToReview.location === "object" && bookingToReview.location
                ? (bookingToReview.location.address || "-")
                : (bookingToReview.location || "-")}
              <br />
              Tanggal: {formatDate(bookingToReview.schedule?.start_date)}
            </p>
          </>
        ) : (
          <p className={style.bookingText}>
            Tidak ditemukan booking selesai yang belum direview. Jika Anda sudah menyelesaikan sesi,
            pastikan booking tersebut belum memiliki status review di database.
          </p>
        )}
      </div>
      <p className={style.subtitle}>SELECT ALL THAT APPLY</p>

      {/* --- PILL FELLINGS MULTI-SELECT --- */}
      <div className={style.pillsContainer}>
        {feelingOptions.map((feeling) => {
          const isSelected = selectedFeelings.includes(feeling);
          return (
            <button
              key={feeling}
              onClick={() => toggleFeeling(feeling)}
              className={`${style.pill} ${isSelected ? style.pillSelected : ""}`}
            >
              {feeling}
            </button>
          );
        })}
      </div>

      {/* --- RATING BINTANG INTERAKTIF --- */}
      <div className={style.ratingSection}>
        <span className={style.ratingTitle}>
          OVERALL
          <br />
          RATING
        </span>
        <div className={style.starsContainer}>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <div
              key={starIndex}
              onClick={() => setRating(starIndex)}
              className={`${style.star} ${rating >= starIndex ? style.starFilled : ""}`}
            >
              <img
                src={rating >= starIndex ? IconStarOutline : IconStarFilled}
                alt="Star"
                width="32"
                height="32"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- FEEDBACK TEXTAREA --- */}
      <div className={style.feedbackSection}>
        <label className={style.feedbackLabel}>
          Share your experience (Optional)
        </label>
        <textarea
          className={style.feedbackTextarea}
          placeholder="Tell us more about your session..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
      </div>

      {/* --- SUBMIT BUTTON --- */}
      <Button onClick={handleSubmitReview} disabled={submitting || bookingLoading || !bookingToReview}>
        {submitting ? "Mengirim..." : "Submit Reflection"}
      </Button>
    </DataScreenLayout>
  );
}
