import style from "./profile_page.module.css";
import MainLayout from "@/views/layouts/MainLayout/mainlayout";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import IconFemale from "@/assets/icon/femaleoff.svg";
import IconEditProfile from "@/assets/icon/useredit.svg";
import IconLogout from "@/assets/icon/logout.svg";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/config/firebase_config";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/controllers/hooks/useAuth";
import KycBanner, { KycStatus } from "@/views/components/KYCContainer/kyccard";
import VerifiedBadge from "@/views/components/VerifiedBadge/verifiedbadge";

interface MainLayoutProps {
  title?: string;
}

export default function ProfilePage({ title = "Profil" }: MainLayoutProps) {
  const { currentUser, userProfile, loading, role, isComplete } = useAuth();
  const navigate = useNavigate();
  const [liveProfile, setLiveProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (loading || !currentUser || !role) return;

    setProfileLoading(true);

    const profileRef =
      role === "companion"
        ? doc(db, "profile_companion", currentUser.uid)
        : doc(db, "profile_user", currentUser.uid);

    const unsubscribe = onSnapshot(profileRef, (snapshot) => {
      setLiveProfile(snapshot.exists() ? snapshot.data() : null);
      setProfileLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, loading, role]);

  const profileData = liveProfile ?? userProfile;
  const isLoading = loading || profileLoading;
  const profileAvatar =
    (role === "companion"
      ? profileData?.url_photoprofile_companion
      : profileData?.url_photoprofile_user) ||
    currentUser?.photoURL ||
    IMGMiniZiro;

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Gagal logout. Silakan coba lagi.");
    }
  };

  const [userKycStatus, setUserKycStatus] = useState<KycStatus>("UNVERIFIED");

  const handleKycRedirect = () => {
    // Logika untuk navigasi ke halaman form KTP atau membuka modal
    navigate("/data-screen-ktp");
  };

  return (
    <MainLayout
      title={title}
      titleColor="var(--text-primary)"
      hideHeaderShadow
      hideProfileImage
    >
      <div className={style.profileSection}>
        <div className={style.avatarWrapper}>
          <img
            src={isLoading ? IMGMiniZiro : profileAvatar}
            alt="Avatar"
            className={style.avatarImage}
            onError={(event) => {
              event.currentTarget.src = IMGMiniZiro;
            }}
          />
          <img src={IMGMiniZiro} alt="Avatar" className={style.miniZiro} />
        </div>

        {/* Kartu Info */}
        <div className={style.infoCard}>
          <div className={style.statsGrid}>
            <div className={style.statGroup}>
              <h2 className={style.userName}>
                {isLoading
                  ? "Loading..."
                  : (role === "companion"
                      ? profileData?.name_companion
                      : profileData?.name_user) ||
                    currentUser?.displayName ||
                    "TemanZiro"}
              </h2>
            </div>

            <VerifiedBadge />
          </div>

          <div className={style.statsGrid}>
            <div className={style.statGroup}>
              <span className={style.statLabel}>Jenis Kelamin</span>
              <div className={style.statValue}>
                <img src={IconFemale} alt="Gender" />
                {isLoading
                  ? "Loading..."
                  : (role === "companion"
                      ? profileData?.gender_companion
                      : profileData?.gender_user) || "Rahasia"}
              </div>
            </div>

            <div className={style.statGroup}>
              <span className={style.statLabel}>Umur</span>
              <div className={style.statValue}>
                {isLoading
                  ? "Loading..."
                  : (role === "companion"
                      ? profileData?.age_companion
                      : profileData?.age_user) || "Umur"}
              </div>
            </div>
          </div>

          <div className={style.locationGroup}>
            <span className={style.statLabel}>Lokasi</span>
            <p className={style.locationText}>
              {isLoading
                ? "Loading..."
                : role === "companion"
                  ? profileData?.address_companion || "Alamat belum tersedia"
                  : profileData?.city || "Alamat belum tersedia"}
            </p>
          </div>
        </div>
      </div>

      <KycBanner status={userKycStatus} onComplete={handleKycRedirect} />

      <div className={style.actionMenu}>
        <button className={style.actionCard} onClick={handleEditProfile}>
          <img
            src={IconEditProfile}
            alt="Edit Profil"
            className={style.actionIcon}
          />

          <span className={style.actionText}>Edit Profil</span>

          <img src={IconAngleRight} alt="" className={style.chevronIcon} />
        </button>

        <button className={style.actionCard} onClick={handleLogout}>
          <img
            src={IconLogout}
            alt="Keluar Akun"
            className={style.actionIcon}
          />

          <span className={style.actionText}>Keluar Akun</span>

          <img src={IconAngleRight} alt="" className={style.chevronIcon} />
        </button>
      </div>
    </MainLayout>
  );
}
