import { useEffect, useRef, useState } from "react";
import style from "./temanjalan_page.module.css";
import MainLayout from "@/views/layouts/MainLayout/mainlayout";
import FeaturedCard from "@/views/components/FeaturedCard/featuredcard";
import ScheduleCard from "@/views/components/ScheduledCard/scheduledcard";
import IconArrowRight from "@/assets/icon/arrowright.svg";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase_config";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";

interface BookingScheduleData {
  id: string;
  companionId?: string;
  userId?: string;
  status: string;
  name: string;
  age: number | string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  badgeText: string;
  notes: string;
  avatar: string;
  timestamp: number;
  bookingRefPath: string;
}

interface TemanJalanLayoutProps {
  title?: string;
}

export default function TemanJalanPage({
  title = "Teman Jalan",
}: TemanJalanLayoutProps) {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

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

  const normalizeStatus = (value: unknown) =>
    typeof value === "string" ? value.toLowerCase() : "";

  const [activeTab, setActiveTab] = useState("Mencari");
  const [allSchedules, setAllSchedules] = useState<BookingScheduleData[]>([]);
  const [featuredDataList, setFeaturedDataList] = useState<BookingScheduleData[]>([]);

  const [loading, setLoading] = useState(true);

  const tabs =
    role === "booker"
      ? ["Menunggu Pembayaran", "Mencari", "Konfirmasi", "Berlangsung", "Selesai"]
      : ["Permintaan", "Terkonfirmasi", "Berlangsung", "Selesai", "Batal"];

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe: () => void;

    if (role === "companion") {
      const bookingsCompanionDocRef = doc(db, "bookings_companion", currentUser.uid);
      unsubscribe = onSnapshot(bookingsCompanionDocRef, async (docSnap) => {
        if (!docSnap.exists()) {
          setAllSchedules([]);
          setFeaturedDataList([]);
          setLoading(false);
          return;
        }

        const bookingsArray = docSnap.data()?.bookings ?? [];
        const fetchPromises = bookingsArray.map(async (bookingRef: any) => {
          try {
            const cleanPath = typeof bookingRef === "string" && bookingRef.startsWith("/")
              ? bookingRef.substring(1)
              : bookingRef;

            const bookingRefObj = typeof bookingRef === "string"
              ? doc(db, cleanPath)
              : bookingRef;

            const bookingSnap = await getDoc(bookingRefObj);
            if (!bookingSnap.exists()) return null;
            const data = bookingSnap.data() as any;
            const bookingId = bookingSnap.id;

            let userId = data?.userId;
            if (!userId) {
              if (typeof bookingRef === "string") {
                const parts = bookingRef.split("/");
                userId = parts[0] === "" ? parts[2] : parts[1];
              } else {
                userId = bookingRef.parent?.parent?.id;
              }
            }

            // Mapping Status
            let tabStatus = "Mencari";
            let badgeText = "MENCARI";

            switch (normalizeStatus(data.status)) {
              case "permintaan":
                tabStatus = "Permintaan";
                badgeText = "PERMINTAAN";
                break;
              case "konfirmasi":
              case "accepted":
                tabStatus = "Terkonfirmasi";
                badgeText = "TERKONFIRMASI";
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

            let rawTimestamp = 0;
            if (data.schedule?.start_date) {
              const rawDate = data.schedule.start_date.toDate ? data.schedule.start_date.toDate() : new Date(data.schedule.start_date);

              if (data.schedule.start_time) {
                const [hours, minutes] = data.schedule.start_time.split(":");
                rawDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
              }
              rawTimestamp = rawDate.getTime();
            }

            // Fetch User/Client Profile (since companion is logged in, they want to see user's profile)
            let clientData = {
              name: "Pengguna Ziro...",
              age: "-",
              avatar: ImgPlaceholder,
            };

            if (userId) {
              try {
                const userRef = doc(db, "profile_user", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const uData = userSnap.data();
                  clientData = {
                    name: uData.name_user || "Pengguna",
                    age: uData.age_user || "-",
                    avatar: uData.url_photoprofile_user || uData.photoURL || clientData.avatar,
                  };
                }
              } catch (err) {
                console.error("Gagal fetch user profile:", err);
              }
            }

            return {
              id: bookingId,
              status: tabStatus,
              name: clientData.name,
              age: clientData.age,
              location: locationObj,
              date: formatDate(data.schedule?.start_date),
              time: data.schedule?.start_time || "-",
              badgeText: badgeText,
              notes: data.activity_name || "Aktivitas bersama TemanZiro",
              avatar: clientData.avatar,
              timestamp: rawTimestamp,
              bookingRefPath: typeof bookingRef === "string" ? bookingRef : bookingRef.path,
              companionId: currentUser.uid,
              userId: userId,
            };
          } catch (err) {
            console.error("Error loading booking details:", err);
            return null;
          }
        });

        const resolvedSchedules = (await Promise.all(fetchPromises)).filter(Boolean);
        setAllSchedules(resolvedSchedules);

        const sortedByNearestSchedule = [...resolvedSchedules].sort((a: any, b: any) => {
          const aTime = a.timestamp && a.timestamp > 0 ? a.timestamp : Number.MAX_SAFE_INTEGER;
          const bTime = b.timestamp && b.timestamp > 0 ? b.timestamp : Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        });

        const activeFeatured = sortedByNearestSchedule
          .filter((s: any) => s.status === "Berlangsung" || s.status === "Konfirmasi" || s.status === "Mencari")
          .slice(0, 4);

        setFeaturedDataList(
          activeFeatured.length > 0
            ? activeFeatured
            : sortedByNearestSchedule,
        );
        setLoading(false);
      });
    } else {
      const bookingsRef = collection(db, "bookings", currentUser.uid, "booking");
      const q = query(bookingsRef, orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const bookingId = docSnap.id;

          let companionId = data.current_target_companion;
          console.log("Original ID from DB:", companionId);

          if (companionId) {
            if (typeof companionId === "object" && companionId.id) {
              companionId = companionId.id;
            } else if (typeof companionId === "string" && companionId.includes("/")) {
              companionId = companionId.split("/").pop();
            }
          }
          console.log("Normalized ID:", companionId);

          companionId = companionId ? String(companionId) : undefined;

          let companionData = {
            name: "Mencari Companion...",
            age: "-",
            avatar: ImgPlaceholder,
          };

          if (companionId) {
            try {
              const compRef = doc(db, "profile_companion", companionId);
              const compSnap = await getDoc(compRef);
              if (compSnap.exists()) {
                const cData = compSnap.data();
                companionData = {
                  name: cData.name_companion || "Companion",
                  age: cData.age_companion || "-",
                  avatar: cData.url_photoprofile_companion || cData.photoURL || companionData.avatar,
                };
              }
            } catch (err) {
              console.error("Gagal fetch companion:", err);
            }
          }

          // Mapping Status
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

          // Normalize location: dapat berupa string, atau object dengan {address, lat, lng}
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

          let rawTimestamp = 0;
          if (data.schedule?.start_date) {
            const rawDate = data.schedule.start_date.toDate ? data.schedule.start_date.toDate() : new Date(data.schedule.start_date);

            if (data.schedule.start_time) {
              const [hours, minutes] = data.schedule.start_time.split(":");
              rawDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            }
            rawTimestamp = rawDate.getTime();
          }

          return {
            id: bookingId,
            companionId: typeof companionId === "string" ? companionId : undefined,
            status: tabStatus,
            name: companionData.name,
            age: companionData.age,
            location: locationObj,
            date: formatDate(data.schedule?.start_date),
            time: data.schedule?.start_time || "-",
            badgeText: badgeText,
            notes: data.activity_name || "Aktivitas bersama TemanZiro",
            avatar: companionData.avatar,
            timestamp: rawTimestamp,
            bookingRefPath: `/bookings/${currentUser.uid}/booking/${bookingId}`,
          };
        });

        const resolvedSchedules = await Promise.all(fetchPromises);

        setAllSchedules(resolvedSchedules);

        const sortedByNearestSchedule = [...resolvedSchedules].sort((a, b) => {
          const aTime = a.timestamp && a.timestamp > 0 ? a.timestamp : Number.MAX_SAFE_INTEGER;
          const bTime = b.timestamp && b.timestamp > 0 ? b.timestamp : Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        });

        const activeFeatured = sortedByNearestSchedule
          .filter((s) => s.status === "Berlangsung" || s.status === "Konfirmasi" || s.status === "Mencari")
          .slice(0, 4);

        setFeaturedDataList(
          activeFeatured.length > 0
            ? activeFeatured
            : sortedByNearestSchedule,
        );
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, role]);

  const filteredSchedules = allSchedules.filter(
    (schedule) => schedule.status === activeTab
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.clientWidth;

      const currentIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(currentIndex);
    }
  };

  const handleScheduleClick = (schedule: any) => {
    const statusLower = (schedule.status || "").toLowerCase();

    if (statusLower === "konfirmasi" || statusLower === "terkonfirmasi") {
      navigate("/detail-day", {
        state: {
          bookingId: schedule.id,
          userId: schedule.userId
        },
      });
    } else if (statusLower === "berlangsung") {
      navigate("/ongoing-session", {
        state: {
          bookingId: schedule.id,
          companionId: schedule.companionId,
          requesterId: role === "companion" ? schedule.userId : currentUser?.uid,
        },
      });
    } else if (statusLower === "selesai") {
      navigate("/detail-booking-done", {
        state: { bookingId: schedule.id },
      });
    } else if (statusLower === "permintaan" || statusLower === "mencari") {
      if (role === "companion") {
        navigate("/detailpend-companion", {
          state: {
            bookingId: schedule.id,
            requesterId: schedule.userId,
          },
        });
      } else {
        navigate("/detail-booking-pend", {
          state: { bookingId: schedule.id },
        });
      }
    }
  };

  return (
    <MainLayout title={title} titleColor="var(--text-primary)" hideHeaderShadow>
      <div className={style.carouselContainer}>
        <div
          className={style.cardsWrapper}
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {loading ? (
            <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>Memuat sorotan...</p>
          ) : featuredDataList.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>Belum ada aktivitas.</p>
          ) : (
            featuredDataList.map((data) => {
              const statusLower = (data.status || "").toLowerCase();
              const canChat = statusLower === "konfirmasi" || statusLower === "terkonfirmasi" || statusLower === "berlangsung";

              return (
                <div className={style.cardSlide} key={data.id}>
                  <FeaturedCard
                    userData={data}
                    bookingId={data.id}
                    onChatClick={
                      canChat
                        ? () => navigate("/room-chat", {
                          state: {
                            companionId: role === "companion" ? undefined : data.companionId,
                            userId: role === "companion" ? data.userId : undefined,
                            companionName: data.name,
                            companionAvatar: data.avatar,
                            bookingStatus: data.status,
                            bookingRefPath: data.bookingRefPath
                          }
                        })
                        : undefined
                    }
                    isChatDisabled={!canChat}
                    isCheckInDisabled={!canChat}
                    checkInMode="camera"
                    checkInPayload={String(data.id)}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Dots */}
        {featuredDataList.length > 0 && (
          <div className={style.paginationWindow}>
            <div
              className={style.paginationTrack}
              style={{
                transform: `translateX(-${Math.max(
                  0,
                  Math.min(activeIndex - 1, featuredDataList.length - 3)
                ) * 14
                  }px)`,
              }}
            >
              {featuredDataList.map((_, index) => (
                <div
                  key={index}
                  className={`${style.dot} ${activeIndex === index ? style.dotActive : ""}`}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- BOTTOM SHEET (TABS & LIST) --- */}
      <div className={style.bottomSheet}>
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

        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>Jadwal Kamu</h2>
          <a href="/list-bookings" className={style.viewAll}>
            View all
            <img src={IconArrowRight} alt="Arrow Right" />
          </a>
        </div>

        <div className={style.scheduleListContainer}>
          {loading ? (
            <div className={style.emptyState}>Memuat jadwal...</div>
          ) : filteredSchedules.length > 0 ? (
            filteredSchedules.slice(0, 1).map((schedule) => (
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
      </div>
    </MainLayout>
  );
}