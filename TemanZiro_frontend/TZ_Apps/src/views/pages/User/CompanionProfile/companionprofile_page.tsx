import { useEffect, useState } from "react";
import style from "./companionprofile_page.module.css";
import IconVerified from "@/assets/icon/verified1.svg";
import IconUserCheck from "@/assets/icon/usercheck.svg";
import IconStarOrange from "@/assets/icon/starorange.svg";
import back from "@/assets/icon/back.svg";
import Tag from "@/views/components/Capsule/tag";
import IconConfirm from "@/assets/icon/confirm.svg";
import ActivityCard, {
  ActivityType,
} from "@/views/components/ActivityCard/activitycard";
import Button from "@/views/components/OrangeButton/orangebutton";
import { doc, onSnapshot, Timestamp, collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { useLocation, useNavigate } from "react-router-dom";
import imgPlaceholder from "@/assets/image/img-placeholder.svg";
import RatingReviewSection from "@/views/components/RatingReview/ratingreview";
import { companion_review } from "@/models/types/companion";

interface CompanionProfileData {
  name_companion?: string;
  url_photoprofile_companion?: string;
  age_companion?: number;
  gender_companion?: string;
  address_companion?: string;
  philosophy_companion?: string;
  preference_companion?: string[];
  preference_activity_companion?: string[];
  is_verified_companion?: boolean;
  is_active_companion?: boolean;
  total_session?: number;
  rating_companion?: number;
  createdAt?: Timestamp | Date | string | null;
  companion_rating?: {
    count_rating: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
    overall_rating: number;
  };
}

interface ViewCompanionLayoutProps {
  title: string;
}

export default function CompanionProfilePage({
  title,
}: ViewCompanionLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const companionId = (location.state as { companionId?: string } | null)?.companionId;

  const [companionData, setCompanionData] = useState<CompanionProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsWithUser, setReviewsWithUser] = useState<any[]>([]);

  useEffect(() => {
    if (!companionId) return;

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "profile_companion", companionId, "reflections");
        const querySnapshot = await getDocs(reviewsRef);
        const reviewsData: any[] = [];
        querySnapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() });
        });

        const reviewsWithUserData = await Promise.all(
          reviewsData.map(async (review: any) => {
            const userRef = review.profile_user_ref || review.review?.profile_user_ref;
            let name = "Unknown User";
            let avatar = imgPlaceholder;

            if (userRef) {
              const userDocRef = doc(db, "profile_user", userRef);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                name = userData?.name_user || "Unknown User";
                avatar = userData?.url_photoprofile_user || imgPlaceholder;
              }
            }

            // Parse rating
            let ratingValue = 5;
            if (review.review?.rating !== undefined) {
              ratingValue = Number(review.review.rating);
            } else if (review.rating !== undefined) {
              if (typeof review.rating === "boolean") {
                ratingValue = review.rating ? 5 : 1;
              } else {
                ratingValue = Number(review.rating);
              }
            }

            // Parse comment
            const commentValue = review.review?.feedback || review.comment || "Tidak ada komentar";

            return {
              ...review,
              name,
              avatar,
              rating: ratingValue,
              comment: commentValue,
            };
          })
        );
        setReviewsWithUser(reviewsWithUserData);
      } catch (error) {
        console.error("Gagal mengambil ulasan companion:", error);
      }
    };

    fetchReviews();
  }, [companionId]);

  useEffect(() => {
    if (!companionId) {
      setLoading(false);
      return;
    }

    const companionRef = doc(db, "profile_companion", companionId);
    const unsubscribe = onSnapshot(
      companionRef,
      (snapshot) => {
        setCompanionData(snapshot.exists() ? (snapshot.data() as CompanionProfileData) : null);
        setLoading(false);
      },
      (error) => {
        console.error("Gagal mengambil companion profile:", error);
        setCompanionData(null);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [companionId]);

  const handleBack = () => navigate(-1);
  // const handleConfirmBookingAndSession = () => {
  //   navigate("/match-confirmation", { 
  //     state: { 
  //       companionId, 
  //       bookingId: location.state?.bookingId,
  //       bookingData: location.state?.bookingData
  //      } });
  // }

  const handleGoToHistory = () => {
    navigate("/friends-page");
  }

  const formatMemberSince = (value: CompanionProfileData["createdAt"]) => {
    if (!value) return "-";

    const date =
      value instanceof Timestamp
        ? value.toDate()
        : value instanceof Date
          ? value
          : new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.getFullYear().toString();
  };

  const companionName = companionData?.name_companion ?? "Companion";
  const companionAge = companionData?.age_companion ?? "-";
  const companionRating = companionData?.rating_companion ?? 0;
  const companionAvatar = companionData?.url_photoprofile_companion ?? imgPlaceholder;
  const companionTags = companionData?.preference_companion ?? [];
  const companionActivities = companionData?.preference_activity_companion ?? [];
  const totalSessions = companionData?.total_session ?? 0;
  const memberSince = formatMemberSince(companionData?.createdAt);

  return (
    <div className={style.screen}>
      <header>
        <button type="button" onClick={handleBack} className={style.backButton}>
          <img src={back} alt="" />
        </button>
        <h4 className={style.title}>{title}</h4>
      </header>

      <div className={style.contentScreen}>
        <div className={style.pageContainer}>

          {/* ── Hero section ─────────────────────────────────────────────── */}
          <div className={style.heroSection}>
            <img
              src={companionAvatar || imgPlaceholder}
              alt={companionName}
              className={style.heroImage}
            />
            <div className={style.heroOverlay}></div>

            <div className={style.statsBadge}>
              <img src={IconUserCheck} alt="" width={20} />
              <span>{totalSessions}</span>
            </div>

            <div className={style.profileInfo}>
              <div className={style.nameRow}>
                <h1 className={style.name}>{companionName}, {companionAge}</h1>
                {(companionData?.is_verified_companion ?? false) && <img src={IconVerified} alt="" width={24} />}
                <div className={style.ratingHero}>
                  <img src={IconStarOrange} alt="" width={24} />
                  <span>{companionRating.toFixed(1)}</span>
                </div>
              </div>

              <div className={style.tagsContainer}>
                {companionTags.length > 0 ? (
                  companionTags.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)
                ) : (
                  <Tag>Belum ada preferensi</Tag>
                )}
              </div>
            </div>
          </div>

          {/* ── Content sections ─────────────────────────────────────────── */}
          <div className={style.contentSection}>

            {/* Companion philosophy */}
            <div className={style.section}>
              <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>Filosofi Companion</h2>
                <span className={style.memberDate}>Anggota sejak {memberSince}</span>
              </div>
              <div className={style.line} />
              <p className={style.description}>
                {companionData?.philosophy_companion || "Belum ada filosofi companion."}
              </p>
            </div>

            {/* Preferred activities — from preference_activity_companion */}
            <div className={style.section}>
              <h2 className={style.sectionTitle}>Tertarik dengan Kegiatan</h2>
              <div className={style.line}></div>
              <div className={style.activityGrid}>
                <div className={style.activityGrid}>
                  {companionActivities.length > 0 ? (
                    companionActivities.map((activityType) => (
                      <ActivityCard key={activityType} type={activityType as ActivityType} />
                    ))
                  ) : (
                    <p className={style.description}>Belum ada kegiatan yang dipilih.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className={style.section}>
              <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>Apa kata orang lain</h2>
              </div>
              <div className={style.line} />

              {reviewsWithUser.length > 0 ? (
                <RatingReviewSection
                  overallRating={companionData?.companion_rating?.overall_rating?.toString() || "0"}
                  ratingDistribution={[
                    { star: 5, count: companionData?.companion_rating?.count_rating["5"] || 0 },
                    { star: 4, count: companionData?.companion_rating?.count_rating["4"] || 0 },
                    { star: 3, count: companionData?.companion_rating?.count_rating["3"] || 0 },
                    { star: 2, count: companionData?.companion_rating?.count_rating["2"] || 0 },
                    { star: 1, count: companionData?.companion_rating?.count_rating["1"] || 0 },
                  ]}
                  reviews={reviewsWithUser.map((review, index) => ({
                    id: `REV-${index}`,
                    name: review.name,
                    avatar: review.avatar,
                    rating: review.rating,
                    text: review.comment,
                  }))}
                />
              ) : (
                <p className={style.description}>Belum ada ulasan yang tersimpan.</p>
              )}
            </div>

          </div>
        </div>
      </div>
      <footer className={style.bottomBar}>
        <Button variant="primary" className={style.buttonskip} disabled={loading || !companionData} onClick={handleGoToHistory}>
          <img src={IconConfirm} alt="" />
          Pergi ke Riwayat
        </Button>
        {/* <Button variant="ghost" shadow="none" className={style.buttonskip1} onClick={handleBack}>
          Kembali ke Pencarian
        </Button> */}
      </footer>
    </div>
  );
}