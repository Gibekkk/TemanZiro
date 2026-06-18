import style from "./matchfound_page.module.css";
import IconCoffe from "@/assets/icon/coffe.svg";
import IconVerified from "@/assets/icon/verified.svg";
import IconHandshake from "@/assets/icon/handshake.svg";
import IconLocation from "@/assets/icon/location.svg";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import Button from "@/views/components/OrangeButton/orangebutton";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase_config";
import { arrayUnion, doc,getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { companion_profile } from "@/models/types/companion";
import { useAuth } from "@/controllers/hooks/useAuth";
import imgPlaceholder from "@/assets/image/img-placeholder.svg";

export interface BookingData {
  activity_name: string;
  preference_companion: string[];
  location?:
    | string
    | {
        address?: string;
        lat?: number;
        lng?: number;
      };
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

export type CompanionProfileWithId = companion_profile & { id: string };

export default function MatchFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const bookingId = location.state?.bookingId;

  const [companionData, setCompanionData] = useState<CompanionProfileWithId | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAddToFriendList = async (userId: string, companionId: string) => {
    try {
      const friendListDocRef = doc(db, "friend_list", userId);
      const companionRef = doc(db, "profile_companion", companionId);

      const docSnap = await getDoc(friendListDocRef);

      if (!docSnap.exists()) {
        await setDoc(friendListDocRef, {
          friends: [companionRef],
          updatedAt: serverTimestamp()
        });
        console.log("Dokumen friend_list baru dibuat untuk user.");
      } else {
        await updateDoc(friendListDocRef, {
          friends: arrayUnion(companionRef),
          updatedAt: serverTimestamp()
        });
        console.log("Companion ditambahkan ke daftar teman.");
      }
    } catch (error) {
      console.error("Gagal update friendlist:", error);
    }
  };

  useEffect(() => {
    if (!currentUser || !bookingId) {
      console.error("User not authenticated or booking ID missing");
      setLoading(false);
      return;
    }

    const fetchMatchDetails = async () => {
      try {
        const bookingRef = doc(db, "bookings", currentUser.uid, "booking", bookingId);
        const bookingSnap = await getDoc(bookingRef);

       if (bookingSnap.exists()) {
        const bData = bookingSnap.data() as BookingData;
        setBookingData(bData);

        if (bData.current_target_companion) {
          const cId = bData.current_target_companion;
          const companionRef = doc(db, "profile_companion", cId);
          const companionSnap = await getDoc(companionRef);

          if (companionSnap.exists()) {
            setCompanionData({ id: companionSnap.id, ...companionSnap.data() } as CompanionProfileWithId);
            await handleAddToFriendList(currentUser.uid, cId);
          }
        }
       }
      } catch (error) {
        console.error("Error fetching match details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [currentUser, bookingId]);

  const handleViewProfile = () => {
    if (companionData?.id) {
      navigate("/companion-profile", { 
        state: { 
          companionId: companionData.id,
          bookingId: bookingId,
          bookingData: bookingData
       } });
    }
  };
  const handleBackToHome = () => {
    navigate("/dashboard");
  }

  if (loading) {
    return <DataScreenLayout title="Loading..."><p>Mempersiapkan data Match...</p></DataScreenLayout>;
  }

  if (!companionData || !bookingData) {
    return (
      <DataScreenLayout title="Error">
        <p>Data tidak ditemukan. Silakan kembali.</p>
        <Button variant="primary" onClick={handleBackToHome}>Kembali</Button>
      </DataScreenLayout>
    );
  }

  return (
    <DataScreenLayout title="Companion Ditemukan">
      <div className={style.profileCard}>
        <div className={style.imageContainer}>
          <div className={style.bgGradient}></div>
          <img
            src={companionData.url_photoprofile_companion || imgPlaceholder}
            alt={companionData.name_companion}
            className={style.profileImage}
          />
          <div className={style.verifiedBadge}>
            <img src={IconVerified} alt="" className={style.icon1} />
            VERIFIED COMPANION
          </div>
        </div>

        {/* Card Content */}
        <div className={style.cardBody}>
          {/* Header: Name & Match Action */}
          <div className={style.headerRow}>
            <div className={style.nameColumn}>
              <h1 className={style.name}>{companionData.name_companion}, {companionData.age_companion}</h1>
              <div className={style.matchType}>
                <img src={IconCoffe} alt="" className={style.icon3} />
                <span>{bookingData.activity_name} Match</span>
              </div>
            </div>
            <button className={style.actionButton}>
              <img src={IconHandshake} alt="" className={style.icon2} />
            </button>
          </div>

          {/* Proposed Activity Section */}
          <div className={style.section}>
            <h2 className={style.sectionTitle}>PROPOSED ACTIVITY</h2>
            <div className={style.activityBox}>
              <div className={style.iconWrapper}>
                <img src={IconLocation} alt="" className={style.icon4} />
              </div>
              <div className={style.activityDetails}>
                <p className={style.activityName}>{bookingData.activity_name}</p>
                <p className={style.activityLocation}>
                  {typeof bookingData.location === "object"
                    ? bookingData.location?.address
                    : bookingData.location}
                </p>
              </div>
            </div>
          </div>

          {/* Key Vibes Section */}
          <div className={style.section}>
            <h2 className={style.sectionTitle}>KEY VIBES</h2>
            <div className={style.vibesContainer}>
              {companionData.preference_companion?.length > 0 ? (
                companionData.preference_companion.slice(0, 3).map((vibe: string, index: number) => (
                  <div key={index} className={style.vibePill}>{vibe}</div>
                ))
              ) : (
                <div className={style.vibePill}>No vibes available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Button variant="primary" className={style.buttonskip} onClick={handleViewProfile}>
        Lihat Profil
      </Button>
      <Button variant="ghost" shadow="none" className={style.buttonskip1} onClick={handleBackToHome}>
        Kembali ke home
      </Button>
    </DataScreenLayout>
  );
}
