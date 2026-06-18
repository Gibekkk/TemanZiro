import style from "./dashboard.module.css";
import { act, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { companion_profile } from "@/models/types/companion";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import FriendList from "@/views/components/FriendList/FriendList";
import ImgZiroBronze from "@/assets/image/Level/ziro-bronze.svg";
import ImgZiroSilver from "@/assets/image/Level/ziro-silver.svg";
import ImgZiroGold from "@/assets/image/Level/ziro-gold.svg";
import ImgZiroPlatinum from "@/assets/image/Level/ziro-platinum.svg";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import Badge from "@/views/components/Badge/badge";
import IconTotalMatch from "@/assets/icon/totalmatch.svg";
import IconIncome from "@/assets/icon/pendapatan.svg";
import IconLocation from "@/assets/icon/location-non.svg";
import ScheduleCard from "@/views/components/ScheduledCard/scheduledcard";
import { normalizeDate } from "@/controllers/matching_controller";
import MoneyButton from "@/views/components/MoneyButton/moneybutton";

export default function CompanionDashboard() {

  const [isActive, setIsActive] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  const { currentUser, userProfile, loading, role } = useAuth();
  const [onlineFriends, setOnlineFriends] = useState<companion_profile[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const navigate = useNavigate();

  const displayName = role === "companion" ? userProfile?.name_companion : userProfile?.name_user;
  const address = role === "companion" ? userProfile?.address_companion : userProfile?.address_user;

  let userTier = "bronze";
  let currentProgress = totalSessions;
  let maxProgress = 25;

  if (totalSessions < 25) {
    userTier = "bronze";
    maxProgress = 25;
  } else if (totalSessions < 100) {
    userTier = "silver";
    maxProgress = 100;
  } else if (totalSessions < 250) {
    userTier = "gold";
    maxProgress = 250;
  } else {
    userTier = "platinum";
    maxProgress = totalSessions;
  }

  const mascotSrc =
    userTier === "silver" ? ImgZiroSilver :
      userTier === "gold" ? ImgZiroGold :
        userTier === "platinum" ? ImgZiroPlatinum :
          ImgZiroBronze;

  const handleNotificationTap = () => {
    navigate("/notification");
  }

  const handleTapProfile = () => {
    navigate("/profile-companion");
  }


  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setFriendsLoading(true);

    const bookingCompanionDocRef = doc(db, "bookings_companion", currentUser.uid);

    const unsubscribeBookingCompanion = onSnapshot(
      bookingCompanionDocRef,
      async (docSnap) => {
        const activeChats: companion_profile[] = [];

        if (!docSnap.exists()) {
          setOnlineFriends([]);
          setFriendsLoading(false);
          return;
        }

        const bookingsArray = docSnap.data()?.bookings ?? [];
        setTotalBookings(bookingsArray.length);
        if (!Array.isArray(bookingsArray) || bookingsArray.length === 0) {
          setOnlineFriends([]);
          setFriendsLoading(false);
          return;
        }

        const bookingPromises = bookingsArray.map(async (bookingItem: any) => {
          const bookingRef = bookingItem;
          if (!bookingRef) return null;

          try {
            const bookingSnap = await getDoc(bookingRef);
            if (!bookingSnap.exists()) return null;

            const bookingData = bookingSnap.data() as any;
            const status = (bookingData.status || "").toString().toLowerCase();
            if (status !== "konfirmasi" && status !== "berlangsung") return null;

            // Check if today's date is within the booking schedule
            const today = Timestamp.now().toDate().toISOString().slice(0, 10);
            const startDate = normalizeDate(bookingData.schedule?.start_date);
            const endDate = normalizeDate(bookingData.schedule?.end_date);
            if (!startDate || !endDate || today < startDate || today > endDate) return null;

            const userId = bookingRef.parent.parent?.id;
            if (!userId) return null;

            const userProfileRef = doc(db, "profile_user", userId);
            const userProfileSnap = await getDoc(userProfileRef);
            if (!userProfileSnap.exists()) return null;

            const statusRef = doc(db, "online_status", userId);
            const statusSnap = await getDoc(statusRef);
            const isOnline = statusSnap.exists() ? Boolean(statusSnap.data()?.is_online) : false;

            const profileData = userProfileSnap.data() as any;
            return {
              ...profileData,
              name_companion: profileData.name_user || "Pengguna",
              url_photoprofile_companion: profileData.url_photoprofile_user || IMGMiniZiro,
              is_online_companion: isOnline,
            } as companion_profile;
          } catch (error) {
            console.error("Error loading active booking chat:", error);
            return null;
          }
        });

        const resolvedChats = await Promise.all(bookingPromises);
        resolvedChats.forEach((chat) => {
          if (chat) activeChats.push(chat);
        });

        setOnlineFriends(activeChats);
        setFriendsLoading(false);

        // Process filtered schedules for today's activities
        const todaySchedules: any[] = [];
        const schedulePromises = bookingsArray.map(async (bookingItem: any) => {
          const bookingRef = bookingItem;
          if (!bookingRef) return null;

          try {
            const bookingSnap = await getDoc(bookingRef);
            if (!bookingSnap.exists()) return null;

            const bookingData = bookingSnap.data() as any;

            // Check if today's date is within the booking schedule
            const today = Timestamp.now().toDate().toISOString().slice(0, 10);
            const startDate = normalizeDate(bookingData.schedule?.start_date);
            const endDate = normalizeDate(bookingData.schedule?.end_date);
            if (!startDate || !endDate || today < startDate || today > endDate) return null;

            const userId = bookingRef.parent.parent?.id;
            if (!userId) return null;

            const userProfileRef = doc(db, "profile_user", userId);
            const userProfileSnap = await getDoc(userProfileRef);
            if (!userProfileSnap.exists()) return null;

            const profileData = userProfileSnap.data() as any;

            const status = (bookingData.status || "").toString().toLowerCase();
            const badgeText = status === "konfirmasi" ? "KONFIRMASI" : status === "berlangsung" ? "BERLANGSUNG" : "UNKNOWN";

            return {
              id: bookingRef.id,
              status: status,
              badgeText: badgeText,
              name: profileData.name_user || "Pengguna",
              age: profileData.age_user || 0,
              location: bookingData.location || "Unknown Location",
              date: startDate, // or format as needed
              time: bookingData.schedule?.start_time || "00:00",
              avatar: profileData.url_photoprofile_user || IMGMiniZiro,
            };
          } catch (error) {
            console.error("Error loading schedule:", error);
            return null;
          }
        });

        const resolvedSchedules = await Promise.all(schedulePromises);
        resolvedSchedules.forEach((schedule) => {
          if (schedule) todaySchedules.push(schedule);
        });

        setFilteredSchedules(todaySchedules);
      },
      (error) => {
        console.error("Error loading companion bookings:", error);
        setOnlineFriends([]);
        setFriendsLoading(false);
      }
    );

    return () => unsubscribeBookingCompanion();
  }, [currentUser, totalBookings, navigate]);

  useEffect(() => {
    if (!currentUser) {
      setNotificationCount(0);
      return;
    }

    const notificationCollectionRef = collection(
      db,
      "notification_alert",
      currentUser.uid,
      "notifications",
    );

    const unsubscribeNotifications = onSnapshot(
      notificationCollectionRef,
      (snapshot) => {
        setNotificationCount(snapshot.size);
      },
      (error) => {
        console.error("Error loading notifications:", error);
        setNotificationCount(0);
      }
    );

    return () => unsubscribeNotifications();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setTotalSessions(0);
      return;
    }

    const reflectionsCollectionRef = collection(
      db,
      "profile_companion",
      currentUser.uid,
      "reflections"
    );

    const unsubscribeReflections = onSnapshot(
      reflectionsCollectionRef,
      (snapshot) => {
        setTotalSessions(snapshot.size);
      },
      (error) => {
        console.error("Error loading reflections:", error);
        setTotalSessions(0);
      }
    );

    return () => unsubscribeReflections();
  }, [currentUser]);

  useEffect(() => {
    const fetchOnlineStatus = async () => {
      if (!currentUser) return;

      try {
        const statusRef = doc(db, "profile_companion", currentUser.uid);
        const statusSnap = await getDoc(statusRef);

        if (statusSnap.exists()) {
          setIsActive(statusSnap.data().is_active_companion ?? false);
        }
      } catch (error) {
        console.error("Gagal mengambil status awal:", error);
      }
    };

    fetchOnlineStatus();
  }, [currentUser]);

  const handleToggleActive = async () => {
    if (!currentUser) return;
    const newState = !isActive;
    setIsActive(newState);

    try {
      const statusDocRef = doc(db, "profile_companion", currentUser.uid);
      await setDoc(statusDocRef, { is_active_companion: newState, updateAt: serverTimestamp() }, { merge: true });
      console.log("Status kompas berhasil diperbarui:", newState);
    } catch (error) {
      console.error("Error updating status kompas:", error);
      setIsActive((prev) => !prev);
    }
  };


  return (
    <div className={style.container}>
      {/* --- HEADER --- */}
      <header className={style.header}>
        <div className={style.logoContainer}>
          <h1 className={style.logo}>TemanZiro</h1>
          <p className={style.companionLogo}>Companion</p>
        </div>
        <div className={style.headerActions}>
          <MoneyButton />
          <div className={style.notifWrapper} onClick={handleNotificationTap}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notificationCount > 0 && <span className={style.notifBadge}>{notificationCount}</span>}
          </div>
          <img
            src={loading ? IMGMiniZiro : (userProfile?.url_photoprofile_companion || IMGMiniZiro)}
            alt={displayName || "Profile"}
            className={style.profileAvatar}
            onClick={handleTapProfile}
            onError={(event) => {
              event.currentTarget.src = IMGMiniZiro;
            }}
          />
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className={style.heroSection}>
        <img src={mascotSrc} alt="Mascot" className={style.mascot} />

        <div className={style.heroInfo}>
          <h2 className={style.greeting}>Hi, {loading ? "Loading..." : displayName || "Teman Ziro"}</h2>
          <div className={style.location}>
            <img src={IconLocation} alt="" />
            {loading ? "Loading..." : address || "Makassar, Sulawesi Selatan"}
          </div>

          <div className={style.statusToggleCard}>
            <span className={style.statusLabel}>Status</span>
            <label className={style.switch}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={handleToggleActive}
              />
              <span className={style.slider}></span>
            </label>
            <span className={style.statusActiveText}>
              {isActive ? "Active" : "Offline"}
            </span>
          </div>
        </div>
      </section>

      {/* --- MAIN WHITE CARD --- */}
      <main className={style.mainCard}>
        {/* TIER REWARD */}
        <Badge
          tier={userTier}
          currentProgress={currentProgress}
          maxProgress={maxProgress}
        />

        {/* STATS GRID */}
        <div className={style.statsGrid}>
          <div className={style.statBox}>
            <div className={style.statIconWrapper}>
              <img src={IconTotalMatch} alt="" className={style.IconIMG} />
            </div>
            <div>
              <p className={style.statLabel}>Total Sesi</p>
              <p className={style.statValue}>{totalBookings} Pertemuan</p>
            </div>
          </div>

          <div className={style.statBox}>
            <div className={style.statIconWrapper}>
              <img src={IconIncome} alt="" className={style.IconIMG} />
            </div>
            <div>
              <p className={style.statLabel}>Pendapatan</p>
              <p className={style.statValue}>Rp. 12.000</p>
            </div>
          </div>
        </div>

        {/* CHAT BERLANGSUNG */}
        <h2 className={style.sectionTitle}>
          <span className={style.textOrange}>Chat </span>
          <span className={style.textDark}>Berlangsung</span>
        </h2>
        <div className={style.chatScroll}>
          <FriendList friendsData={onlineFriends} isLoading={friendsLoading} />
        </div>

        {/* KEGIATAN HARI INI */}
        <h2 className={style.sectionTitle}>
          <span className={style.textOrange}>Kegiatan </span>
          <span className={style.textDark}>Hari ini</span>
        </h2>
        <div className={style.activityList}>
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
              />
            ))
          ) : (
            <div className={style.emptyState}>
              Belum ada jadwal untuk status ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
