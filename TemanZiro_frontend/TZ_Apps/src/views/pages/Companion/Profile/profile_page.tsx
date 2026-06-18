import style from "./profile_page.module.css";
import MainLayout from "@/views/layouts/MainLayout/mainlayout";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import IconFemale from "@/assets/icon/femaleoff.svg";
import IconEditProfile from "@/assets/icon/useredit.svg";
import IconLogout from "@/assets/icon/logout.svg";
import IconAngleRight from "@/assets/icon/angle-right-non.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "@/config/firebase_config";
import { signOut } from "firebase/auth";
import { useAuth } from "@/controllers/hooks/useAuth";
import PhilosophyCard from "@/views/components/PhilosophyCard/philosophy";
import ActivityCard, {
  ActivityType,
} from "@/views/components/ActivityCard/activitycard";
import RatingReviewSection from "@/views/components/RatingReview/ratingreview";
import { db } from "@/config/firebase_config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { companion_review } from "@/models/types/companion";
import KycBanner, { KycStatus } from "@/views/components/KYCContainer/kyccard";
import VerifiedBadge from "@/views/components/VerifiedBadge/verifiedbadge";

interface ProfilCompanionProps {
  title?: string;
}

export default function ProfileCompanionPage({
  title = "Profil",
}: ProfilCompanionProps) {
  const { currentUser, userProfile, loading, role } = useAuth();
  const navigate = useNavigate();
  const [reviewsWithUser, setReviewsWithUser] = useState<any[]>([]);

  const handleEditProfile = () => {
    navigate("/edit-profile-companion");
  };

  useEffect(() => {
    if (!currentUser) return;

    const fetchReviews = async () => {
      const reviewsRef = collection(
        db,
        "profile_companion",
        currentUser.uid,
        "reviews",
      );
      const querySnapshot = await getDocs(reviewsRef);
      const reviewsData: companion_review[] = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push(doc.data() as companion_review);
      });

      // Fetch user data for each review
      const reviewsWithUserData = await Promise.all(
        reviewsData.map(async (review) => {
          const userDocRef = doc(db, "profile_user", review.profile_user_ref);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.exists() ? userDocSnap.data() : null;
          return {
            ...review,
            name: userData?.name_user || "Unknown User",
            avatar: userData?.url_photoprofile_user || IMGMiniZiro,
          };
        }),
      );
      setReviewsWithUser(reviewsWithUserData);
    };

    fetchReviews();
  }, [currentUser]);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Gagal logout. Silakan coba lagi.");
    }
  };

  const photoUrl =
    (role === "companion"
      ? userProfile?.url_photoprofile_companion
      : userProfile?.url_photoprofile_user) || IMGMiniZiro;

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
          <img src={photoUrl} alt="Avatar" className={style.avatarImage} />
          <img src={IMGMiniZiro} alt="Avatar" className={style.miniZiro} />
        </div>

        {/* Kartu Info */}
        <div className={style.infoCard}>
          <div className={style.statsGrid}>
            <div className={style.statGroup}>
              <h2 className={style.userName}>
                {loading
                  ? "Loading..."
                  : userProfile?.name_companion ||
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
                {loading
                  ? "Loading..."
                  : userProfile?.gender_companion || "Rahasia"}
              </div>
            </div>

            <div className={style.statGroup}>
              <span className={style.statLabel}>Umur</span>
              <div className={style.statValue}>
                {loading ? "Loading..." : userProfile?.age_companion || "-"}
              </div>
            </div>
          </div>

          <div className={style.locationGroup}>
            <span className={style.statLabel}>Lokasi</span>
            <p className={style.locationText}>
              {loading
                ? "Loading..."
                : userProfile?.address_companion || "Alamat belum tersedia"}
            </p>
          </div>
        </div>
      </div>

      <div className={style.profileSection}>
        <div className={style.infoCard}>
          <PhilosophyCard
            philosophy={userProfile?.philosophy_companion || ""}
          />
        </div>
      </div>

      <div className={style.profileSection1}>
        <h3 className={style.title}>Tertarik dengan Aktivitas</h3>
        <div className={style.activityGrid}>
          {(
            (userProfile?.preference_activity_companion as ActivityType[]) || []
          ).map((activityType) => (
            <ActivityCard key={activityType} type={activityType} />
          ))}
        </div>
      </div>

      <div className={style.profileSection1}>
        <h3 className={style.title1}>Nilai & Komen</h3>
        <div className={style.content}>
          <RatingReviewSection
            overallRating={
              userProfile?.companion_rating?.overall_rating.toString() || "0"
            }
            ratingDistribution={[
              {
                star: 5,
                count: userProfile?.companion_rating?.count_rating["5"] || 0,
              },
              {
                star: 4,
                count: userProfile?.companion_rating?.count_rating["4"] || 0,
              },
              {
                star: 3,
                count: userProfile?.companion_rating?.count_rating["3"] || 0,
              },
              {
                star: 2,
                count: userProfile?.companion_rating?.count_rating["2"] || 0,
              },
              {
                star: 1,
                count: userProfile?.companion_rating?.count_rating["1"] || 0,
              },
            ]}
            reviews={reviewsWithUser.map((review, index) => ({
              id: `REV-${index}`,
              name: review.name,
              avatar: review.avatar,
              rating: review.rating ? 5 : 1, // Assuming true is 5, false is 1
              text: review.comment,
            }))}
          />
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
