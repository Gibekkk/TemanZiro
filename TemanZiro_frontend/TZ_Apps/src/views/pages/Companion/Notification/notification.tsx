import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import NotificationCard from "@/views/components/NotificationCard/notifcard";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { normalizeDate } from "@/controllers/matching_controller";
import style from "./notification.module.css";

export default function NotifciationPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleNotificationClick = (notification: any) => {
    const type = notification.type;
    const content = (notification.content || "").toLowerCase();

    if (type === "pencairandana" || content.includes("pencairan")) {
      navigate("/pencairan-done");
    } else if (type === "matchrequest" || content.includes("match") || content.includes("mengajak") || content.includes("permintaan")) {
      navigate("/detailpend-companion", {
        state: {
          bookingId: notification.bookingId,
          requesterId: notification.requesterId,
        },
      });
    }
  };

  const nameParsing = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length <= 1) {
      return words[0] || "";
    }
    const firstName = words[0];
    const lastName = words[words.length - 1];
    return `${firstName} ${lastName}`;
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setNotificationsLoading(true);

    const notificationsCollectionRef = collection(db, "notification_alert", currentUser.uid, "notifications");
    const q = query(notificationsCollectionRef, orderBy("notification_datetime", "desc"));
    const unsubscribeNotifications = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const notificationPromises = snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            let cardType: "pencairandana" | "matchrequest" | "pesanan" = "pesanan";
            if (data.type === "pencairandana" || data.type === "pencairan") {
              cardType = "pencairandana";
            } else if (data.type === "match_request" || data.type === "matchrequest") {
              cardType = "matchrequest";
            }

            let userName = nameParsing(data.requester_name || "Pengguna");
            const requesterId = data.requester_id || null;

            if (!data.requester_name && requesterId) {
              try {
                const userDocRef = doc(db, "profile_user", requesterId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                  userName = nameParsing(userDocSnap.data()?.name_user || "Pengguna");
                }
              } catch (e) {
                console.error("Gagal mengambil nama pengirim request:", e);
              }
            }

            return {
              id: docSnap.id,
              type: cardType,
              content: data.notification_content || `Permintaan match baru untuk aktivitas ${data.activiy_name || ""}`,
              timestamp: normalizeDate(data.notification_datetime) || "Baru",
              status: data.status || "berhasil",
              amount: data.amount || "Rp. 0",
              activity: data.activiy_name || "Aktivitas",
              activityDate: data.schedule?.start_date ? normalizeDate(data.schedule.start_date) : "Segera",
              userName: userName,
              bookingId: data.booking_id || null,
              requesterId: requesterId,
            };
          });

          const notificationList = await Promise.all(notificationPromises);
          setNotifications(notificationList);
          setNotificationsLoading(false);
        } catch (err) {
          console.error("Gagal memproses data notifikasi:", err);
          setNotificationsLoading(false);
        }
      },
      (error) => {
        console.error("Error loading notifications:", error);
        setNotificationsLoading(false);
      }
    );
    return () => unsubscribeNotifications();
  }, [currentUser, navigate]);


  return (
    <DataScreenLayout title="Notification" alignLeft>
      {notificationsLoading ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>Loading...</div>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => {
          if (notification.type === "pencairandana") {
            return (
              <NotificationCard
                key={notification.id}
                type="pencairandana"
                status={notification.status}
                amount={notification.amount}
                date={notification.timestamp}
                onClick={() => handleNotificationClick(notification)}
              />
            );
          } else if (notification.type === "matchrequest") {
            return (
              <NotificationCard
                key={notification.id}
                type="matchrequest"
                activity={notification.activity}
                activityDate={notification.activityDate}
                userName={notification.userName}
                date={notification.timestamp}
                onClick={() => handleNotificationClick(notification)}
              />
            );
          } else {
            return (
              <NotificationCard
                key={notification.id}
                type="pesanan"
                title={notification.content}
                date={notification.timestamp}
                onClick={() => handleNotificationClick(notification)}
              />
            );
          }
        })
      ) : (
        <div className={style.emptyState}>
          Belum ada notifikasi untuk status ini.
        </div>
      )}
    </DataScreenLayout>
  );
}
