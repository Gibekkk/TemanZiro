import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./listbookings.module.css";
import ScheduleCard from "@/views/components/ScheduledCard/scheduledcard";
import { useState, useEffect } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import imgPlaceholder from "@/assets/image/img-placeholder.svg";
import { db } from "@/config/firebase_config";
import { collection, getDoc, onSnapshot, orderBy, query, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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

export default function ListBookingsPage() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("Mencari");
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = ["Menunggu Pembayaran", "Mencari", "Konfirmasi", "Berlangsung", "Selesai"];

  const normalizeStatus = (value: unknown) =>
    typeof value === "string" ? value.toLowerCase() : "";

  useEffect(() => {
    if (!currentUser) return;

    const bookingsRef = collection(db, "bookings", currentUser.uid, "booking");
    const q = query(bookingsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchPromises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const bookingId = docSnap.id;

        let companionId = data.current_target_companion;
        if (companionId) {
          if (typeof companionId === "object" && companionId.id) {
            companionId = companionId.id;
          } else if (typeof companionId === "string" && companionId.includes("/")) {
            companionId = companionId.split("/").pop();
          }
        }
        companionId = companionId ? String(companionId) : undefined;

        let companionData = {
          name_companion: "Mencari Companion...",
          age_companion: "-",
          url_photo_companion: imgPlaceholder,
        };

        if (companionId) {
          try {
            const compRef = doc(db, "profile_companion", companionId);
            const compSnap = await getDoc(compRef);
            if (compSnap.exists()) {
              const cData = compSnap.data();
              companionData = {
                name_companion: cData.name_companion || "Companion",
                age_companion: cData.age_companion || "-",
                url_photo_companion: cData.url_photoprofile_companion || cData.photoURL || companionData.url_photo_companion,
              };
            }
          } catch (error) {
            console.error("Error fetching companion data:", error);
          }
        }

        // Normalize location
        const rawLocation = data.location;
        let locationObj = { address: "Belum ditentukan", lat: 0, lng: 0 };

        if (rawLocation) {
          if (typeof rawLocation === "string") {
            locationObj = { address: rawLocation, lat: 0, lng: 0 };
          } else if (typeof rawLocation === "object") {
            locationObj = {
              address: rawLocation.address || rawLocation.formatted_address || "Belum ditentukan",
              lat: rawLocation.lat ?? 0,
              lng: rawLocation.lng ?? 0,
            };
          }
        }

        let tabStatus = "Mencari";
        let badgeText = "MENCARI";

        switch (normalizeStatus(data.status)) {
          case "menunggu_pembayaran":
            tabStatus = "Menunggu Pembayaran";
            badgeText = "MENUNGGU PEMBAYARAN";
            break;
          case "mencari":
          case "waiting_approval":
          case "pending_companion":
            tabStatus = "Mencari";
            badgeText = "MENCARI";
            break;
          case "konfirmasi":
          case "accepted":
            tabStatus = "Konfirmasi";
            badgeText = "DIKONFIRMASI";
            break;
          case "berlangsung":
          case "ongoing":
            tabStatus = "Berlangsung";
            badgeText = "SEKARANG";
            break;
          case "selesai":
          case "completed":
            tabStatus = "Selesai";
            badgeText = "SELESAI";
            break;
          case "batal":
          case "canceled":
          case "rejected":
            tabStatus = "Batal";
            badgeText = "DIBATALKAN";
            break;
          default:
            tabStatus = "Mencari";
            badgeText = "MENCARI";
        }
        return {
          id: bookingId,
          companionId: companionId,
          status: tabStatus,
          name: companionData.name_companion,
          age: companionData.age_companion,
          location: locationObj,
          date: formatDate(data.schedule?.start_date),
          time: data.schedule?.start_time || "-",
          badgeText: badgeText,
          avatar: companionData.url_photo_companion,
        };
      });
      const resolvedSchedules = await Promise.all(fetchPromises);
      setAllSchedules(resolvedSchedules);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const filteredSchedules = allSchedules.filter(
    (schedule) => schedule.status === activeTab
  );

  const handleScheduleClick = (schedule: any) => {
    const statusLower = (schedule.status || "").toLowerCase();

    if (statusLower === "konfirmasi" || statusLower === "terkonfirmasi") {
      navigate("/detail-day", {
        state: {
          bookingId: schedule.id,
          userId: currentUser?.uid,
        },
      });
    } else if (statusLower === "berlangsung") {
      navigate("/ongoing-session", {
        state: {
          bookingId: schedule.id,
          companionId: schedule.companionId,
          requesterId: currentUser?.uid,
        },
      });
    } else if (statusLower === "selesai") {
      navigate("/detail-booking-done", {
        state: { bookingId: schedule.id },
      });
    } else if (statusLower === "permintaan" || statusLower === "mencari") {
      navigate("/detail-booking-pend", {
        state: { bookingId: schedule.id },
      });
    }
  };

  const myTabs = (
    <div className={style.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${style.tab} ${activeTab === tab ? style.tabActive : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
  return (
    <DataScreenLayout
      title="Pemesanan"
      alignLeft
      rightProfile={userProfile?.url_photoprofile_user || imgPlaceholder}
      tabsComponent={myTabs}
      contentClassName={style.customPadding}
    >
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>Jadwal Kamu</h2>
      </div>

      <div className={style.scheduleListContainer}>
        {loading ? (
          <div className={style.emptyState}>Memuat jadwal...</div>
        ) : filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onClick={() => handleScheduleClick(schedule)}
            />
          ))
        ) : (
          <div className={style.emptyState}>
            Belum ada jadwal untuk status "{activeTab}".
          </div>
        )}
      </div>
    </DataScreenLayout>
  );
}
