import UserProfile from "@/views/components/UserProfile/UserProfile";
import "./dashboard.css";
import mascotImg from "@/assets/image/main-ziro.svg";
import FriendList from "@/views/components/FriendList/FriendList";
import mapIcon from "@/assets/icon/map-pin.svg";
import ActivityGrid from "@/views/components/ActivityGrid/ActivityGrid";

import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { companion_profile } from "@/models/types/companion";

import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MoneyButton from "@/views/components/MoneyButton/moneybutton";

export default function DashboardUser() {
  const { currentUser, userProfile, loading, role } = useAuth();
  // const [onlineFriends, setOnlineFriends] = useState<companion_profile[]>([]);
  // const [friendsLoading, setFriendsLoading] = useState(true);
  const navigate = useNavigate();


  const displayName = role === "companion" ? userProfile?.name_companion : userProfile?.name_user;
  const address = role === "companion" ? userProfile?.address_companion : userProfile?.address_user;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // setFriendsLoading(true);

    // const friendListDocRef = doc(db, "friend_list", currentUser.uid);
    // const statusUnsubscribes: (() => void)[] = [];

    // const unsubscribeFriendList = onSnapshot(friendListDocRef, async (docSnap) => {
    //   statusUnsubscribes.forEach((unsub) => unsub());
    //   statusUnsubscribes.length = 0;

      // if (!docSnap.exists()) {
      //   setOnlineFriends([]);
      //   setFriendsLoading(false);
      //   console.log("Tidak ada dokumen friend_list untuk user ini.");
      //   return;
      // }

      // const friendRefs = (docSnap.data().friends as any[]) || [];

      // if (friendRefs.length === 0) {
      //   setOnlineFriends([]);
      //   setFriendsLoading(false);
      //   console.log("Tidak ada teman untuk user ini.");
      //   return;
      // }

    //   const friendsMap = new Map<string, any>();
    //   const profilePromises = friendRefs.map(async (compRef) => {
    //     const profileSnap = await getDoc(compRef);
    //     if (profileSnap.exists()) {
    //       friendsMap.set(compRef.id, {
    //         id: compRef.id,
    //         ...profileSnap.data()!,
    //         is_online_companion: false, 
    //       });
    //       console.log(`Data companion ${compRef.id} berhasil diambil.`);
    //     } else {
    //       console.log(`Data companion ${compRef.id} tidak ditemukan.`);
    //     }
    //   });

    // await Promise.all(profilePromises);

    // setOnlineFriends(Array.from(friendsMap.values()));
    // setFriendsLoading(false);

    //   friendRefs.forEach((compRef) => {
    //     const companionId = compRef.id;
    //     const statusRef = doc(db, "online_status", companionId);

    //     const unsubStatus = onSnapshot(statusRef, (statusSnap) => {
    //       if (friendsMap.has(companionId)) {
    //         const isOnline = statusSnap.exists() ? statusSnap.data().is_online : false;
            
    //         const existingData = friendsMap.get(companionId);
    //         friendsMap.set(companionId, {
    //           ...existingData,
    //           is_online_companion: isOnline,
    //         });
    //         setOnlineFriends(Array.from(friendsMap.values()));
    //       }
    //     });

    //     statusUnsubscribes.push(unsubStatus);
    //   });
    // });

    return () => {
      // unsubscribeFriendList();
      // statusUnsubscribes.forEach((unsub) => unsub());
    };
  }, [currentUser, navigate]);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="header-wrapper">
        <div className="header-top">
          <h1 className="brand-title">Teman<span>Ziro</span></h1>
          <div className="user-profile-wrapper">
            <MoneyButton />
            <UserProfile />
          </div>
        </div>

        <div className="header-body">
          <div className="mascot-image">
            <img src={mascotImg} alt="Mascot" />
          </div>
          
          <div className="text-header-wrapper">
            <h1 className="text-header">Hi, {loading ? "Loading..." : displayName || "Teman Ziro"}!</h1>
            <div className="location">
              <img src={mapIcon} alt="Map Icon" />
              <p className="text-subheader">{loading ? "Loading..." : address || "Lokasi belum tersedia"}</p>
            </div>
            <div className="box-header">
              <div className="text-box-wrap">
                <p className="text-header">Ayo seru-seruan bareng <span>TemanZiro!</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Online Companion */}
      {/* {onlineFriends.length > 0 && (
        <div className="body-wrapper">
          <h1 className="text-body">
            Your  <span className="highlight">friend</span>
          </h1>
          <div className="body-component">
            <FriendList friendsData={onlineFriends} isLoading={friendsLoading} />
          </div>
        </div>
      )} */}

      {/* Activities */}
      <div className="body-wrapper1">
        <h1 className="text-body">
          Pilih  <span className="highlight">aktivitas</span> hari ini, yuk!
        </h1>
        <div className="body-component">
          <ActivityGrid />
        </div>
      </div>

    </div>
  )
}