import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./companiondatascreen_page.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import ProgressBar from "@/views/components/ProgressBar/progressbar";
import LocationComponent from "@/views/components/LocationCard/locationcard";
import MinatComponent from "@/views/components/CapsuleList/capsule";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { useAuth } from "@/controllers/hooks/useAuth";
import TimeSelector from "@/views/components/TimeSelector/timeselector";
import InterestSelector from "@/views/components/InterestSelector/interestselector";
import TimeSelection from "@/views/components/TimePicker/timepicker";
import { useEffect, useState } from "react";

export default function CompanionDataScreenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, role, isComplete } = useAuth();

  const [cities, setCities] = useState<string[]>([]);
  const [preferenceNames, setPreferenceNames] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [pendingNewPreferences, setPendingNewPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityError, setCityError] = useState("");

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const cityRes = await fetch("https://corsproxy.io/?https://faker.moodbites.qzz.io/cities");
        const cityData = await cityRes.json();
        setCities(cityData.cities ?? []);
        console.log("Data kota berhasil diambil:", cityData.cities);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, []);

  useEffect(() => {
    if (currentUser && isComplete) {
      navigate(role === "companion" ? "/companion-dashboard" : "/dashboard");
      return;
    }
  }, [currentUser, role, isComplete, navigate]);

  useEffect(() => {
    const fetchPreferenceData = async () => {
      try {
        const prefDocRef = doc(db, "preference_list", "list");
        const prefSnap = await getDoc(prefDocRef);
        if (prefSnap.exists()) {
          setPreferenceNames(prefSnap.data().preference_names ?? []);
        }
        console.log("Data preference berhasil diambil:", prefSnap.data());
      } catch (error) {
        console.error("Gagal mengambil data preference:", error);
      }
    };

    fetchPreferenceData();
  }, []);

  const handleCityChange = (val: string) => {
    setSelectedCity(val);
    setCityError("");
  };

  const handleSkip = async () => {
    try {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error("Current user UID is required to save profile data.");
      }

      const companionProfileData = {
        name_companion: location.state?.name_user ?? currentUser?.displayName ?? "",
        url_photoprofile_companion:
          location.state?.url_photoprofile_user || currentUser?.photoURL || "",
        is_active_companion: false,
        total_balance_companion: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const userDocRef = doc(db, "profile_companion", uid);
      await setDoc(userDocRef, companionProfileData, { merge: true });

      const userDetailsRef = doc(db, "user_details", uid);
      await setDoc(
        userDetailsRef,
        {
          role: location.state?.role ?? "companion",
          url_ktp_user: location.state?.url_ktp_user || "",
          url_selfiektp_user: location.state?.url_selfiektp_user || "",
          preferences: selectedPreferences,
          is_complete:
            location.state?.url_ktp_user &&
              location.state?.url_selfiektp_user &&
              location.state?.name_user
              ? true
              : false,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log("Data minimal berhasil disimpan dengan ID:", currentUser?.uid);
      navigate("/companion-dashboard");
    } catch (error) {
      console.error("Error during skip:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  const handleSubmit = async () => {
    // if (!selectedCity || !cities.includes(selectedCity)) {
    //   setCityError(
    //     !selectedCity
    //       ? "Kota tidak boleh kosong."
    //       : "Kota tidak valid. Pilih kota dari daftar yang tersedia."
    //   );
    //   return;
    // }

    try {
      if (pendingNewPreferences.length > 0) {
        const prefDocRef = doc(db, "preference_list", "list");
        await updateDoc(prefDocRef, {
          preference_names: arrayUnion(...pendingNewPreferences),
        });
      }

      // ✅ Struktur profile companion tanpa duplikasi user_details
      const companionProfileData = {
        name_companion: location.state?.name_user ?? currentUser?.displayName ?? "",
        url_photoprofile_companion:
          location.state?.url_photoprofile_user || currentUser?.photoURL || "",
        address_companion: selectedCity,
        is_active_companion: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error("Current user UID is required to save profile data.");
      }

      const userDocRef = doc(db, "profile_companion", uid);
      await setDoc(userDocRef, companionProfileData, { merge: true });

      const userDetailsRef = doc(db, "user_details", uid);
      await setDoc(
        userDetailsRef,
        {
          role: location.state?.role ?? "companion",
          url_ktp_user: location.state?.url_ktp_user || "",
          url_selfiektp_user: location.state?.url_selfiektp_user || "",
          preferences: selectedPreferences,
          is_complete:
            location.state?.url_ktp_user &&
              location.state?.url_selfiektp_user &&
              location.state?.name_user
              ? true
              : false,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/companion-dashboard");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Gagal menyimpan data registrasi. Silakan coba lagi.");
    }
  };

  return (
    <>
      <DataScreenLayout title="Buat Akun">
        <ProgressBar
          title="Ceritain Tentang Kamu"
          currentStep={4}
          totalSteps={4}
        />
        <h4 className={style.subtitle1}>
          Hampir sampai! Bantu kami menyesuaikan pengalaman Anda.
        </h4>
        <h2 className={style.title}>Ceritain Kesukaanmu</h2>
        <h4 className={style.subtitle}>
          Kasih tahu vibe-mu biar TemanZiro bisa rekomendasiin aktivitas dan
          grup yang pas buat kamu!
        </h4>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <LocationComponent
              title="Kotamu"
              label="Dimana kamu tinggal?"
              cities={cities}
              value={selectedCity}
              onValueChange={handleCityChange}
            />
            {cityError && (
              <p style={{ color: "#ff6b6b", fontSize: "12px", margin: "-30px 0 16px 0" }}>
                {cityError}
              </p>
            )}
            <MinatComponent
              preference_data={preferenceNames}
              onMinatChange={setSelectedPreferences}
              onNewPreferencesChange={setPendingNewPreferences}
              showAddButton={true}
              value={selectedPreferences}
            />
            <InterestSelector />
            <TimeSelector />
            <TimeSelection />
          </>
        )}

        <div className={style.container}>
          <Button
            variant="primary"
            className={style.button}
            onClick={handleSubmit}
          >
            Mulai
          </Button>
          <Button
            variant="ghost"
            shadow="none"
            className={style.buttonskip}
            onClick={handleSkip}
          >
            Lewati
          </Button>
        </div>
      </DataScreenLayout>
    </>
  );
}