import { useEffect, useState } from "react";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import RoleCard from "@/views/components/RoleCard/rolecard";
import style from "./rolescreen_page.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";

import IconRole1 from "@/assets/icon/role1.svg";
import IconRole2 from "@/assets/icon/role2.svg";
import ImgRoleBooker from "@/assets/icon/roleuser.svg";
import ImgRoleCompanion from "@/assets/icon/rolecompanion.svg";
import ProgressBar from "@/views/components/ProgressBar/progressbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase_config";

export default function DataScreenRolePage() {
  const [selectedRole, setSelectedRole] = useState("booker");
  const navigate = useNavigate();
  const { currentUser, role, isComplete } = useAuth();

  const handleNavigation = async () => {
    if (!currentUser) {
      return;
    }

    const userDetailsRef = doc(db, "user_details", currentUser.uid);
    const userDetailsData = {
      role: selectedRole,
      url_ktp_user: "",
      url_selfiektp_user: "",
      is_complete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(userDetailsRef, userDetailsData, { merge: true });
    } catch (error) {
      console.error("Error creating user_details:", error);
    }

    navigate("/data-screen-ktp", {
      state: {
        role: selectedRole,
        uid: currentUser.uid,
        name_user: currentUser.displayName,
        url_photoprofile_user: currentUser.photoURL,
      },
    });
  };

  const roles = [
    {
      id: "booker",
      title: "Saya ingin mencari companion",
      description:
        "Temukan penduduk lokal ramah untuk menemani aktivitas atau sekadar berbagi obrolan bermakna.",
      roleName: "PERAN BOOKER",
      image: ImgRoleBooker,
      icon: IconRole1,
    },
    {
      id: "companion",
      title: "Saya ingin menjadi companion",
      description:
        "Jadilah teman perjalanan bagi orang lain dan dapatkan penghasilan tambahan dari waktu luang Anda.",
      roleName: "PERAN COMPANION",
      image: ImgRoleCompanion,
      icon: IconRole2,
    },
  ];

  useEffect(() => {
    if (currentUser) {
      if (isComplete) {
        navigate(role === "companion" ? "/companion-dashboard" : "/dashboard");
        return;
      }
      if (role) {
        navigate("/data-screen-ktp");
        return;
      }
    }
  }, [currentUser, role, isComplete, navigate]);

  return (
    <DataScreenLayout title="TemanZiro" alignLeft>
      <ProgressBar title="Pilih Peran Anda" currentStep={1} totalSteps={4} />
      <h2 className={style.title}>
        Bagaimana Anda ingin menggunakan TemanZiro?
      </h2>
      <h4 className={style.subtitle}>
        Pilih peran untuk menyesuaikan pengalaman Anda.
      </h4>

      {roles.map((role) => (
        <RoleCard
          key={role.id}
          {...role}
          isActive={selectedRole === role.id}
          onSelect={() => setSelectedRole(role.id)}
        />
      ))}

      <div className={style.actionContainer}>
        <Button
          variant="primary"
          onClick={handleNavigation}
          className={style.fullWidthBtn}
        >
          Lanjutkan sebagai {selectedRole === "booker" ? "Booker" : "Companion"}
        </Button>

        <p className={style.footerdesc}>
          Dengan memilih peran ini, Anda setuju dengan syarat dan ketentuan yang
          berlaku.
        </p>
      </div>
    </DataScreenLayout>
  );
}
