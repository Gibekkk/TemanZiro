import React, { useState, useEffect } from "react";
import style from "./livesession.module.css";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import IconChat from "@/assets/icon/chat-active.svg";
import IconLogout from "@/assets/icon/logoutorange.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp, collection, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase_config";

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

export default function LiveSessionPage() {
  const { currentUser, loading, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const bookingId = location.state?.bookingId;
  const companionId = location.state?.companionId;
  const requesterId = location.state?.requesterId;

  const [bookingData, setBookingData] = useState<any>(null);
  const [otherPartyData, setOtherPartyData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  const isCompanion = role === "companion";

  useEffect(() => {
    if (!bookingId || !currentUser) {
      setLoadingData(false);
      return;
    }

    const fetchLiveSessionData = async () => {
      try {
        let targetUserId = currentUser.uid;

        if (isCompanion) {
          const passedUserId = requesterId || location.state?.userId;
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

        const unsubscribeBooking = onSnapshot(bookingRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBookingData(data);

            let companionTargetId = isCompanion ? targetUserId : (data.current_target_companion || data.profile_companion);
            if (companionTargetId && typeof companionTargetId === "object") {
              companionTargetId = companionTargetId.id || companionTargetId.path?.split("/").pop();
            }

            if (companionId) {
              const profileCollection = isCompanion ? "profile_user" : "profile_companion";
              const profileRef = doc(db, profileCollection, companionTargetId);
              const profileSnap = await getDoc(profileRef);
              if (profileSnap.exists()) {
                setOtherPartyData(profileSnap.data());
              }
            }
          }
          setLoadingData(false);
        });

        return unsubscribeBooking;
      } catch (error) {
        console.error("Gagal memuat live session:", error);
        setLoadingData(false);
      }
    };

    let unsubPromise = fetchLiveSessionData();

    return () => {
      unsubPromise.then((unsub) => {
        if (unsub) unsub();
      });
    };
  }, [bookingId, currentUser, role, requesterId, location.state]);

  const [countdown, setCountdown] = useState(() => toCountdown(null));

  useEffect(() => {
    const end = parseScheduleDateTime(
      bookingData?.schedule?.end_date,
      bookingData?.schedule?.end_time,
    );

    setCountdown(toCountdown(end));

    if (!end) return;

    const timer = setInterval(() => {
      setCountdown(toCountdown(end));
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData?.schedule?.end_date, bookingData?.schedule?.end_time]);

  const handleOpenChat = () => {
    if (!currentUser || !bookingId) return;

    let companionTargetId = isCompanion ? (requesterId || location.state?.userId) : companionId;
    if (!companionTargetId && bookingData) {
      companionTargetId = isCompanion ? requesterId : (bookingData.current_target_companion || bookingData.profile_companion);
    }
    if (companionTargetId && typeof companionTargetId === "object") {
      companionTargetId = companionTargetId.id || companionTargetId.path?.split("/").pop();
    }

    const displayName = isCompanion
      ? otherPartyData?.name_user || "User"
      : otherPartyData?.name_companion || "Companion";

    const avatarUrl = isCompanion
      ? otherPartyData?.url_photoprofile_user || ImgPlaceholder
      : otherPartyData?.url_photoprofile_companion || ImgPlaceholder;

    navigate("/room-chat", {
      state: {
        bookingId,
        companionId: isCompanion ? currentUser?.uid : companionTargetId,
        targetId: companionTargetId,
        companionName: displayName,
        companionAvatar: avatarUrl,
        bookingStatus: bookingData?.status || "berlangsung",
        bookingRefPath: `/bookings/${isCompanion ? companionTargetId : currentUser?.uid}/booking/${bookingId}`,
      },
    });
  };

  const handleCheckOut = async () => {
    if (!currentUser || !bookingId) return;

    try {
      let targetUserId = currentUser.uid;
      if (isCompanion) {
        const passedUserId = requesterId || location.state?.userId;
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
      await updateDoc(bookingRef, {
        status: "selesai",
        updatedAt: serverTimestamp(),
      });

      let companionTargetId = isCompanion ? currentUser.uid : companionId;
      if (!companionTargetId && bookingData) {
        companionTargetId = bookingData.current_target_companion || bookingData.profile_companion;
      }
      if (companionTargetId && typeof companionTargetId === "object") {
        companionTargetId = companionTargetId.id || companionTargetId.path?.split("/").pop();
      }

      if (companionTargetId) {
        const reflectionDocRef = doc(db, "profile_companion", companionTargetId, "reflections", bookingId);
        await setDoc(reflectionDocRef, {
          status: "pending_review",
        }, { merge: true });
      } else {
        console.warn("Companion ID tidak ditemukan, tidak dapat memperbarui status refleksi.");
      }

      alert("Sesi berhasil diselesaikan.");
      if (isCompanion) {
        navigate("/companion-dashboard");
      } else {
        navigate("/reflection", { state: { bookingId } });
      }
    } catch (err) {
      console.error("Gagal check out:", err);
      alert("Terjadi kesalahan sistem saat check out.");
    }
  };

  if (loading || loadingData) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Memuat sesi aktif...</p>;
  }

  const displayName = isCompanion
    ? otherPartyData?.name_user || "User"
    : otherPartyData?.name_companion || "Companion";

  const avatarUrl = isCompanion
    ? otherPartyData?.url_photoprofile_user || ImgPlaceholder
    : otherPartyData?.url_photoprofile_companion || ImgPlaceholder;

  return (
    <DataScreenLayout
      title="Sesi Aktif"
      noShadow={true}
      contentClassName={style.customPadding}
    >
      <div className={style.avatarWrapper}>
        <img
          src={avatarUrl}
          alt={displayName}
          className={style.avatar}
        />
      </div>

      <h1 className={style.title}>TemanZiro Premium Session</h1>
      <p className={style.subtitle}>Connected with {displayName}</p>

      {/* --- COUNTDOWN TIMER --- */}
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
        <div className={style.timerGridDivider}>:</div>
        <div className={style.timerBox}>
          <div className={style.number}>
            <span className={style.timeNum}>{countdown.seconds}</span>
          </div>
          <span className={style.timeLabel}>DETIK</span>
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className={style.buttonContainer}>
        <Button variant="primary" onClick={handleOpenChat}>
          <img src={IconChat} alt="Chat" />
          Open Live Chat
        </Button>

        <Button variant="outline" shadow="none" onClick={handleCheckOut}>
          <img src={IconLogout} alt="Check Out" />
          Check Out Session
        </Button>
      </div>
    </DataScreenLayout>
  );
}
