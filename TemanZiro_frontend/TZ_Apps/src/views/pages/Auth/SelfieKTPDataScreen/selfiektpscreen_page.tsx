import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./selfiektpscreen_page.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import ProgressBar from "@/views/components/ProgressBar/progressbar";
import UploadIMG from "@/views/components/UploadDataImg/uploaddataimg";
import Logologin1 from "@/assets/icon/fotoselfie.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase_config";
import { doc, getDoc } from "firebase/firestore";

export default function DataScreenSelfieKTPPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, isComplete, userProfile } = useAuth();
  const userId = currentUser?.uid ?? location.state?.uid ?? "";
  const onboardingState = (location.state ?? {}) as Record<string, unknown>;
  const [urlSelfieKTP, setUrlSelfieKTP] = useState<string | null>(null);

  const isExistingUser = !!userProfile;

  const profilePath = role === "companion" ? "/profile_companion" : "/profile";

  const dataScreenPath = role === "companion" ? "/companion-data-screen" : "/user-data-screen";

  const handleSkip = () => {
    // Pastikan kita mengambil role dari onboardingState
    // const role = onboardingState?.role;

    if (isExistingUser) {
      navigate(profilePath);
    } else {
      navigate(dataScreenPath, {
        state: onboardingState,
      });
    }
  };

  useEffect(() => {
    if (currentUser && isComplete) {
      navigate(role === "companion" ? "/companion-dashboard" : "/dashboard");
      return;
    }
  }, [currentUser, role, isComplete, navigate]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    };

    const checkKtpUrl = async () => {
      try {
        const userProfileRef = doc(db, "user_details", currentUser.uid);
        const docSnap = await getDoc(userProfileRef);
        if (docSnap.exists()) {
          const ktpData = docSnap.data();
          const ktpUrl = ktpData.url_selfiektp_user || null;
          console.log("Retrieved Selfie KTP URL from user_details:", ktpUrl);
          setUrlSelfieKTP(ktpUrl);
        } else {
          console.log("No user_details document found for UID:", currentUser.uid);
        }
      } catch (error) {
        console.error("Error fetching Selfie KTP URL:", error);
      }
    }

    if (currentUser && !isComplete) {
      checkKtpUrl();
    }
  }, [currentUser, isComplete, navigate]);

  return (
    <DataScreenLayout title="Buat Akun">
      <ProgressBar title="Siapkan Foto Selfie KTP Anda" currentStep={3} totalSteps={4} />
      <h2 className={style.title}>Ambil Selfie KTP</h2>
      <h4 className={style.subtitle}>
        Bergabunglah dengan komunitas TemanZiro. Ceritakan sedikit tentang
        dirimu agar orang lain tahu bahwa itu kamu.
      </h4>

      <UploadIMG
        textButton="Ambil Selfie KTP"
        icon={Logologin1}
        userId={userId}
        folder="selfie_ktp"
        navigateTo={isExistingUser ? profilePath : dataScreenPath}
        uploadedUrlKey="url_selfiektp_user"
        nextState={onboardingState}
        currentUrl={urlSelfieKTP}
        onUploadSuccess={() => setUrlSelfieKTP(null)}
      />

      <Button variant="primary" shadow="none" className={style.buttonskip} onClick={handleSkip}>
        Lewati dulu
      </Button>
      <p className={style.footerScreen}>
        Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan
        Privasi kami.
      </p>
    </DataScreenLayout>
  );
}
