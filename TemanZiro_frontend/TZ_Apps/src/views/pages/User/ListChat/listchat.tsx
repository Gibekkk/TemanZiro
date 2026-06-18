import { useState, useEffect } from "react";
import style from "./listchat_page.module.css";
import ChatItem from "@/views/components/ChatItem/chatitem";
import MainLayout from "@/views/layouts/MainLayout/mainlayout";
import SearchBar from "@/views/components/SearchBar/searchbar";
import { useAuth } from "@/controllers/hooks/useAuth";
import IconInfo from "@/assets/icon/info.svg";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "@/config/firebase_config";
import { useNavigate } from "react-router-dom";

type BookingStatus = "mencari" | "konfirmasi" | "berlangsung" | "selesai";

interface ViewCompanionLayoutProps {
  title?: string;
}

export default function ListChatPage({
  title = "Pesan",
}: ViewCompanionLayoutProps) {
  const [activeTab, setActiveTab] = useState<"Aktif" | "Riwayat">("Aktif");
  const [chatLoading, setChatLoading] = useState(true);
  const [chatList, setChatList] = useState<any[]>([]);

  const { currentUser, role } = useAuth();
  const isCompanion = role === "companion";
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setChatLoading(true);

    const chatListRef = isCompanion
      ? collection(db, "chat_companion", currentUser.uid, "id_user")
      : collection(db, "chat", currentUser.uid, "companion_id");
    
      let statusUnsubscribes: (() => void)[] = [];
    const unsubscribeChatList = onSnapshot(chatListRef, async (snapshot) => {
      statusUnsubscribes.forEach((unsub) => unsub());
      statusUnsubscribes = [];

      console.log("[ListChat] onSnapshot received, docs:", snapshot.docs.length);

      if (snapshot.empty) {
        console.log("[ListChat] snapshot empty");
        setChatList([]);
        setChatLoading(false);
        return;
      }

      const bookingStatusMap = new Map<string, BookingStatus>();
      const priority: Record<string, number> = {
        berlangsung: 3,
        konfirmasi: 2,
        selesai: 1,
      };

      if (isCompanion) {
        const bookingCompanionRef = doc(
          db,
          "bookings_companion",
          currentUser.uid,
        );
        const bookingCompanionSnap = await getDoc(bookingCompanionRef);
        const bookingsArray = bookingCompanionSnap.exists()
          ? (bookingCompanionSnap.data()?.bookings ?? [])
          : [];

        const bookingPromises = bookingsArray.map(async (bookingRef: any) => {
          if (!bookingRef) return null;
          const bookingSnap = await getDoc(bookingRef);
          if (!bookingSnap.exists()) return null;

          const bookingData = bookingSnap.data() as any;
          const userRef = bookingData.profile_user;
          const userId = userRef?.id || bookingRef.parent?.parent?.id;
          const status = String(bookingData.status || "").toLowerCase();
          // const status = bookingData.status as string;

          if (!userId) return null;
          if (
            !["mencari", "konfirmasi", "berlangsung", "selesai", "Mencari", "Konfirmasi", "Berlangsung", "Selesai", "MENCARI", "KONFIRMASI", "BERLANGSUNG", "SELESAI"].includes(
              status,
            )
          )
            return null;

          return { userId, status };
        });

        const resolvedBookings = await Promise.all(bookingPromises);

        resolvedBookings.forEach((item) => {
          if (!item) return;
          const { userId, status } = item;
          const existing = bookingStatusMap.get(userId);
          const existingPriority = existing ? (priority[existing] ?? 0) : 0;
          const newPriority = priority[status] ?? 0;

          if (newPriority > existingPriority) {
            bookingStatusMap.set(userId, status as BookingStatus);
          }
        });
        console.log("[ListChat] bookingStatusMap (companion) entries:", Array.from(bookingStatusMap.entries()));
      } else {
        const bookingRef = collection(
          db,
          "bookings",
          currentUser.uid,
          "booking",
        );
        const bookingSnap = await getDocs(bookingRef);

        bookingSnap.docs.forEach((bookingDoc) => {
          const data = bookingDoc.data();

          // Try multiple fields where companion id may be stored
          const candidateFields = [
            data.current_target_companion,
            data.profile_companion,
            data.profile_companion_ref,
            data.companion,
          ];

          let companionId: string | undefined = undefined;

          for (const field of candidateFields) {
            if (!field) continue;
            if (typeof field === "object" && field.id) {
              companionId = field.id;
              break;
            }
            if (typeof field === "string") {
              companionId = field.includes("/") ? field.split("/").pop() : field;
              break;
            }
          }

          let rawStatus = String(data.status || "").toLowerCase();
          let status = rawStatus;
          if (rawStatus === "accepted") status = "konfirmasi";
          if (rawStatus === "ongoing") status = "berlangsung";
          if (rawStatus === "completed") status = "selesai";
          if (rawStatus === "waiting_approval" || rawStatus === "pending_companion") status = "mencari";

          if (!companionId) return;
          if (!["mencari", "konfirmasi", "berlangsung", "selesai"].includes(status)) return;

          const existing = bookingStatusMap.get(companionId);
          const existingPriority = existing ? (priority[existing] ?? 0) : 0;
          const newPriority = priority[status] ?? 0;

          if (newPriority > existingPriority) {
            bookingStatusMap.set(companionId, status as BookingStatus);
          }
        });
        console.log("[ListChat] bookingStatusMap (user) entries:", Array.from(bookingStatusMap.entries()));
      }

      const chatMap = new Map<string, any>();

      snapshot.docs.forEach((chatDoc) => {
        const participantId = chatDoc.id;
        const bookingStatus = bookingStatusMap.get(participantId);

        console.log("[ListChat] processing participantId:", participantId, "bookingStatus:", bookingStatus);

        if (!bookingStatus) return;

        const profileRef = isCompanion
          ? doc(db, "profile_user", participantId)
          : doc(db, "profile_companion", participantId);
        const statusRef = doc(db, "online_status", participantId);

        const unsubStatus = onSnapshot(statusRef, async (statusSnap) => {
          const isOnline = statusSnap.data()?.is_online ?? false;
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as any;
            const baseData = isCompanion
              ? {
                  name_user: profileData.name_user,
                  url_photoprofile_user: profileData.url_photoprofile_user,
                }
              : {
                  name_companion: profileData.name_companion,
                  url_photoprofile_companion:
                    profileData.url_photoprofile_companion,
                };

            chatMap.set(participantId, {
              ...baseData,
              id: participantId,
              is_online_companion: isOnline,
              booking_status: bookingStatus,
              ...chatDoc.data(),
            });
            console.log("[ListChat] chatMap.set ->", participantId, "mapSize:", chatMap.size);
          } else {
            chatMap.delete(participantId);
          }

          const listArr = Array.from(chatMap.values());
          console.log("[ListChat] updating chatList length:", listArr.length);
          setChatList(listArr);
          setChatLoading(false);
        });

        statusUnsubscribes.push(unsubStatus);
      });

      if (statusUnsubscribes.length === 0) {
        setChatList([]);
        setChatLoading(false);
      }

      return () => {
        unsubscribeChatList();
        statusUnsubscribes.forEach((unsub) => unsub());
      };
    });

    return () => unsubscribeChatList();
  }, [currentUser, isCompanion, navigate]);

  // Filter berdasarkan tab
  const filteredChat = chatList.filter((chat) => {
    if (activeTab === "Aktif") {
      return (
        chat.booking_status === "konfirmasi" ||
        chat.booking_status === "berlangsung"
      );
    }
    if (activeTab === "Riwayat") {
      return chat.booking_status === "selesai";
    }
    return false;
  });

  const SearchBarComponent = <SearchBar placeholder="Cari Percakapan" />;

  return (
    <MainLayout
      title={title}
      titleColor="var(--text-primary)"
      searchBar={SearchBarComponent}
    >
      <div className={style.tabsContainer}>
        {(["Aktif", "Riwayat"] as const).map((tab) => (
          <button
            key={tab}
            className={`${style.tabButton} ${activeTab === tab ? style.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={style.chatList}>
        {chatLoading ? (
          <p style={{ textAlign: "center" }}>Loading chats...</p>
        ) : filteredChat.length === 0 ? (
          <div className={style.content}>
            <img src={IconInfo} alt="" className={style.imgInfo} />
            <p
              style={{
                textAlign: "center",
                margin: "10px 0 100px",
                color: "var(--text-secondary)",
                fontWeight: "bold"
              }}
            >
              {activeTab === "Aktif"
                ? "Tidak ada chat aktif"
                : "Tidak ada riwayat chat"}
            </p>
          </div>
        ) : (
          filteredChat.map((chat) => (
            <ChatItem
              key={chat.id}
              name={isCompanion ? chat.name_user : chat.name_companion}
              time={
                chat.lastchat_datetime?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) || "Unknown"
              }
              previewText={chat.last_chat}
              avatarUrl={
                isCompanion
                  ? chat.url_photoprofile_user
                  : chat.url_photoprofile_companion
              }
              isOnline={chat.is_online_companion}
              navigateToChat={() =>
                navigate("/room-chat", {
                  state: {
                    companionId: chat.id,
                    companionName: isCompanion
                      ? chat.name_user
                      : chat.name_companion,
                    companionAvatar: isCompanion
                      ? chat.url_photoprofile_user
                      : chat.url_photoprofile_companion,
                    bookingStatus: chat.booking_status,
                    lastChat: chat.last_chat,
                  },
                })
              }
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}
