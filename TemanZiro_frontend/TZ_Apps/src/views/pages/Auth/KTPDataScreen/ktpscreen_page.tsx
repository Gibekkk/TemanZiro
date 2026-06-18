import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./ktpscreen_page.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import ProgressBar from "@/views/components/ProgressBar/progressbar";
import UploadIMG from "@/views/components/UploadDataImg/uploaddataimg";
import LogoLogin1 from "@/assets/icon/logo-login1.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase_config";
import { doc, getDoc } from "firebase/firestore";

export default function DataScreenKTPPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, role, isComplete } = useAuth();
  const userId = currentUser?.uid ?? location.state?.uid ?? "";
  const onboardingState = (location.state ?? {}) as Record<string, unknown>;

  const [urlKTP, setUrlKTP] = useState<string | null>(null);

  const handleSkip = () => {
    navigate("/data-screen-selfie-ktp", {
      state: onboardingState,
    });
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
          const ktpUrl = ktpData.url_ktp_user || null;
          console.log("Retrieved KTP URL from user_details:", ktpUrl);
          setUrlKTP(ktpUrl);
        } else {
          console.log("No user_details document found for UID:", currentUser.uid);
        }
      } catch (error) {
        console.error("Error fetching KTP URL:", error);
      }
    }

    if (currentUser && !isComplete) {
      checkKtpUrl();
    }
  }, [currentUser, isComplete, navigate]);

  return (
    <DataScreenLayout title="Buat Akun">
      <ProgressBar title="Siapkan KTP Anda" currentStep={2} totalSteps={4} />
      <h2 className={style.title}>Ambil Foto KTP</h2>
      <h4 className={style.subtitle}>
        Bergabunglah dengan komunitas TemanZiro. Ceritakan sedikit tentang
        dirimu agar orang lain tahu bahwa itu kamu.
      </h4>

      <UploadIMG
        textButton="Ambil Foto KTP"
        icon={LogoLogin1}
        userId={userId}
        folder="ktp"
        navigateTo="/data-screen-selfie-ktp"
        uploadedUrlKey="url_ktp_user"
        nextState={onboardingState}
        currentUrl={urlKTP}
        onUploadSuccess={() => setUrlKTP(null)}
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
