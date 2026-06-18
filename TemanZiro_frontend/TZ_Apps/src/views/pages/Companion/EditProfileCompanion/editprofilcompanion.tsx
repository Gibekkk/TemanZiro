import React, { useEffect, useRef, useState } from "react";
import style from "./editprofilcompanion.module.css";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import GenderToggle from "@/views/components/GenderToggle/gendertoggle";
import Button from "@/views/components/OrangeButton/orangebutton";
import IconUser from "@/assets/icon/profil.svg";
import IconDate from "@/assets/icon/date-non.svg";
import IconLocation from "@/assets/icon/location-non.svg";
import { useNavigate } from "react-router-dom";
import { companion_profile } from "@/models/types/companion";
import { db } from "@/config/firebase_config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/controllers/hooks/useAuth";
import MinatComponent from "@/views/components/CapsuleList/capsule";
import InterestSelector from "@/views/components/InterestSelector/interestselector";
import LocationComponent from "@/views/components/LocationCard/locationcard";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const profilePlaceholder: companion_profile = {
  name_companion: "TemanZiro",
  url_photoprofile_companion: ImgPlaceholder,
  gender_companion: "",
  age_companion: undefined,
  address_companion: "Alamat belum tersedia",
  city_companion: "Kota belum tersedia",
  philosophy_companion: "Tuliskan filosofi hidupmu di sini",
  preference_companion: [],
  preference_activity_companion: [],
  is_active_companion: true,
  is_online_companion: false,
  companion_rating: {
    count_rating: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    overall_rating: 0,
  },
  registered_date: "",
};

export default function EditProfileCompanionPage() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const [photoUploading, setPhotoUploading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [activityNames, setActivityNames] = useState<string[]>([]);
  const originalPreferenceRef = useRef<string[]>([]);
  const originalActivityRef = useRef<string[]>([]);
  const [ageError, setAgeError] = useState("");
  const [formData, setFormData] = useState<companion_profile>({
    name_companion: "",
    url_photoprofile_companion: "",
    gender_companion: "",
    age_companion: undefined,
    address_companion: "",
    city_companion: "",
    philosophy_companion: "",
    preference_companion: [],
    preference_activity_companion: [],
    is_active_companion: true,
    is_online_companion: false,
    companion_rating: {
      count_rating: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      overall_rating: 0,
    },
    registered_date: "",
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cityRes = await fetch("https://corsproxy.io/?https://faker.moodbites.qzz.io/cities");
        const cityData = await cityRes.json();
        setCities(cityData.cities ?? []);
      } catch (error) {
        console.error("Gagal mengambil daftar kota:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const activityRes = await fetch("https://corsproxy.io/?https://faker.moodbites.qzz.io/activities");
        const activityData = await activityRes.json();
        setActivityNames(activityData.activities ?? ["Nongkrong", "Jalan-jalan", "Belajar", "Olahraga", "Kuliner", "Hiburan"]);
      } catch (error) {
        console.error("Gagal mengambil daftar aktivitas dari API, menggunakan fallback:", error);
        // Fallback ke hardcode
        setActivityNames(["Nongkrong", "Jalan-jalan", "Belajar", "Olahraga", "Kuliner", "Hiburan"]);
      }
    };

    fetchCities();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (loading || !currentUser) {
      return;
    }

    const loadInitialData = async () => {
      const docRef = doc(db, "profile_companion", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as companion_profile;

        // Simpan original preferences di ref agar tidak berubah saat user deselect
        originalPreferenceRef.current = data.preference_companion?.length ? data.preference_companion : [];
        originalActivityRef.current = data.preference_activity_companion?.length ? data.preference_activity_companion : [];

        // Gunakan data dari Firestore. Jika field kosong, gunakan placeholder sebagai fallback.
        setFormData({
          ...data,
          name_companion: data.name_companion || currentUser.displayName || "",
          address_companion: data.address_companion || profilePlaceholder.address_companion,
          city_companion: data.city_companion || profilePlaceholder.city_companion,
          philosophy_companion: data.philosophy_companion || profilePlaceholder.philosophy_companion,
          preference_companion: data.preference_companion?.length ? data.preference_companion : profilePlaceholder.preference_companion,
          preference_activity_companion: data.preference_activity_companion?.length ? data.preference_activity_companion : profilePlaceholder.preference_activity_companion,
          url_photoprofile_companion: data.url_photoprofile_companion || profilePlaceholder.url_photoprofile_companion,
          gender_companion: data.gender_companion || profilePlaceholder.gender_companion,
          age_companion: data.age_companion ?? profilePlaceholder.age_companion,
        });
      } else {
        // Jika dokumen belum ada, populate form dengan placeholder sepenuhnya
        originalPreferenceRef.current = profilePlaceholder.preference_companion;
        originalActivityRef.current = profilePlaceholder.preference_activity_companion;

        setFormData((prev) => ({
          ...prev,
          ...profilePlaceholder,
          name_companion: currentUser.displayName || profilePlaceholder.name_companion,
        }));
      }
    };

    loadInitialData();
  }, [currentUser, loading]);

  const handleSave = async () => {
    if (!currentUser) {
      alert("Sesi login tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (photoUploading) {
      alert("Foto masih diunggah. Tunggu sebentar lalu coba simpan lagi.");
      return;
    }

    try {
      const docRef = doc(db, "profile_companion", currentUser.uid);
      await setDoc(
        docRef,
        {
          ...formData,
          registered_date: formData.registered_date || new Date().toISOString(),
        },
        { merge: true },
      );
      alert("Profil companion berhasil diperbarui!");
      navigate("/profile-companion");
    } catch (error) {
      console.error("Gagal menyimpan profil companion:", error);
      alert("Gagal menyimpan profil companion. Silakan coba lagi.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Parsing umur menjadi number jika field-nya age_companion

    let parsedValue: string | number = value;
    if (name === "age_companion") {
      const ageNum = Number(value);
      parsedValue = ageNum;

      if (ageNum <= 17 && value !== "") {
        setAgeError("Umur harus lebih dari 17 tahun.");
      } else {
        setAgeError("");
      }
    }


    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender_companion: gender }));
  };

  const handleMinatChange = (selected: string[]) => {
    setFormData((prev) => ({ ...prev, preference_companion: selected }));
  };

  const handleInterestChange = (selected: string[]) => {
    setFormData((prev) => ({ ...prev, preference_activity_companion: selected }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUploading(true);

      // --- KODE UPLOAD STORAGE BISA DIBUKA KOMENTARNYA DI SINI NANTI ---
      // const filePath = `profile_companion/${currentUser?.uid}/profile-${Date.now()}-${file.name}`;
      // const storageRef = ref(storage, filePath);
      // await uploadBytes(storageRef, file);
      // const downloadURL = await getDownloadURL(storageRef);

      // setFormData((prev) => ({ ...prev, url_photoprofile_companion: downloadURL }));

    } catch (error) {
      console.error("Gagal upload foto profil:", error);
      alert("Gagal mengunggah foto profil. Coba lagi.");
    } finally {
      setPhotoUploading(false);
      e.target.value = "";
    }
  };

  return (
    <DataScreenLayout title="Edit profil">
      {/* --- FOTO PROFIL --- */}
      <div className={style.profileSection}>
        <div className={style.imageWrapper}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handlePhotoFileChange}
          />
          <img
            src={formData.url_photoprofile_companion || ImgPlaceholder || IconUser}
            alt="Profile Avatar"
            className={style.profileImage}
          />

          <button
            className={style.editPhotoBtn}
            type="button"
            onClick={handleEditPhoto}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- FORM KONTEN --- */}
      <div className={style.formSection}>
        {/* Card: Nama Lengkap */}
        <div className={style.card}>
          <span className={style.label}>Nama Lengkap</span>
          <div className={style.inputGroup}>
            <img src={IconUser} alt="User Icon" className={style.icon} />
            <div className={style.inputWrapper}>
              <input
                type="text"
                name="name_companion"
                value={formData.name_companion}
                onChange={handleInputChange}
                className={style.input}
              />
            </div>
          </div>
        </div>

        {/* Card: Jenis Kelamin */}
        <div className={style.card1}>
          <span className={style.label}>Jenis Kelamin</span>
          <GenderToggle
            hideTitle={true}
            onGenderChange={handleGenderChange}
            value={formData.gender_companion}
          />
        </div>

        {/* Card: Umur */}
        <div className={style.card}>
          <span className={style.label}>Umur</span>
          <div className={style.inputGroup}>
            <img src={IconDate} alt="Date Icon" className={style.icon1} />
            <div className={style.inputWrapper}>
              <input
                type="number"
                name="age_companion"
                value={formData.age_companion || ""}
                onChange={handleInputChange}
                className={style.input}
              />
            </div>
          </div>
        </div>

        {/* Card: Lokasi (Alamat) */}
        <div className={style.card}>
          <span className={style.label}>Lokasi (Alamat)</span>
          <div className={style.inputGroup}>
            <img
              src={IconLocation}
              alt="Location Icon"
              className={style.icon1}
            />
            <div className={style.inputWrapper}>
              <input
                type="text"
                name="address_companion"
                value={formData.address_companion}
                onChange={handleInputChange}
                className={style.input}
                placeholder="Alamat lengkap"
              />
            </div>
          </div>
        </div>

        {/* Card: Kota dengan dropdown API */}
        <LocationComponent
          title="Kota"
          label="Pilih kota tempat tinggal"
          cities={cities}
          value={formData.city_companion}
          onValueChange={(city) => setFormData((prev) => ({ ...prev, city_companion: city }))}
        />

        {/* Card: Philosophy */}
        <div className={style.card}>
          <span className={style.label}>Companion Philosophy</span>
          <textarea
            name="philosophy_companion"
            className={style.textAreaDirect}
            value={formData.philosophy_companion}
            onChange={handleInputChange}
            placeholder="Tuliskan filosofimu di sini..."
          />
          <hr className={style.divider} />
        </div>

        <div className={style.card}>
          <MinatComponent
            className={style.hilangkanMargin}
            preference_data={originalPreferenceRef.current}
            value={formData.preference_companion}
            onMinatChange={handleMinatChange}
          />
        </div>

        <div className={style.card}>
          <InterestSelector
            className={style.hilangkanMargin}
            value={formData.preference_activity_companion}
            onChange={handleInterestChange}
            interests={activityNames}
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        className={style.saveButton}
        variant="outline"
      >
        Simpan
      </Button>
    </DataScreenLayout>
  );
}