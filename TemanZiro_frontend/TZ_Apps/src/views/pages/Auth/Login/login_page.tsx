import OnboardingLayout from "@/views/layouts/OnboardingLayout/onboardinglayout";
import LoginContent from "@/views/components/LoginContent/logincontent";
import IconLabel from "@/views/components/IconLabel/iconlabel";
import imgSS1 from "@/assets/image/loginziro1.svg";
import imgSS2 from "@/assets/image/loginziro2.svg";
import LogoLogin1 from "@/assets/icon/logo-login1.svg";
import LogoLogin2 from "@/assets/icon/logo-login2.svg";
import LogoLogin3 from "@/assets/icon/logo-login3.svg";
import styles from "./login_page.module.css";

import { db,auth } from "@/config/firebase_config";
import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/controllers/hooks/useAuth";

export default function LoginRegistPage() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const redirectByRegistrationStatus = async (uid: string, name?: string | null) => {
    const userDetailsRef = doc(db, "user_details", uid);
    const userDetailsSnap = await getDoc(userDetailsRef);

    if (userDetailsSnap.exists()) {
      const details = userDetailsSnap.data();
      const role = details.role;

      if (role === "admin") {
        await auth.signOut();
        alert("Akun admin tidak diperbolehkan masuk ke aplikasi ini.");
        return;
      }

      const profileRef = doc(db, role === "companion" ? "profile_companion" : "profile_user", uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        navigate(role === "companion" ? "/companion-dashboard" : "/dashboard", { replace: true });
        return;
      }

      navigate("/data-screen-ktp", {
        state: {
          uid,
          role,
          name_user: name,
          url_ktp_user: details.url_ktp_user,
          url_selfiektp_user: details.url_selfiektp_user,
        },
        replace: true,
      });
      return;
    }

    navigate("/data-screen-role", {
      state: {
        uid,
        name_user: name,
      },
      replace: true,
    });
  };

  useEffect(() => {
    if (loading || !currentUser) {
      return;
    }

    redirectByRegistrationStatus(currentUser.uid, currentUser.displayName);
  }, [currentUser, loading]);
  
  const signUpWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await redirectByRegistrationStatus(user.uid, user.displayName);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  }

  const handleNext = () => {
    console.log("Pindah ke halaman login/register");
    signUpWithGoogle();
  };

  return (
    <OnboardingLayout>
      <LoginContent
        image1={imgSS2}
        image2={imgSS1}
        title={
          <>
            Selamat Datang di{" "}
            <span className={styles.textHighlight}>TemanZiro</span>
          </>
        }
        description={
          <>
            Temukan teman untuk kegiatan positif di dunia nyata. Tempat{" "}
            bersosialisasi yang
            <span className={styles.textHighlight}> aman </span> untuk{" "}
            <span className={styles.textHighlight}>nongkrong </span> dan{" "}
            <span className={styles.textHighlight}>belajar</span>.
          </>
        }
        buttonText="Mulai Sekarang"
        onButtonClick={handleNext}
      />
      <div className={styles.logoContainers}>
        <IconLabel icon={LogoLogin1} label="Terverifikasi" color="" />
        <IconLabel icon={LogoLogin2} label="Sosial" color="" />
        <IconLabel icon={LogoLogin3} label="Belajar" color="" />
      </div>
    </OnboardingLayout>
  );
}
