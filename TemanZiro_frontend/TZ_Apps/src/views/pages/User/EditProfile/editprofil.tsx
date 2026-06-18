import React, { useEffect, useRef, useState } from "react";
import style from "./editprofil.module.css";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import GenderToggle from "@/views/components/GenderToggle/gendertoggle";
import Button from "@/views/components/OrangeButton/orangebutton";
import IconUser from "@/assets/icon/profil.svg";
import IconDate from "@/assets/icon/date-non.svg";
import IconLocation from "@/assets/icon/location-non.svg";
import IconSearch from "@/assets/icon/search-non.svg";
import { useNavigate } from "react-router-dom";
import { user_profile } from "@/models/types/users";
import { db, storage } from "@/config/firebase_config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "@/controllers/hooks/useAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading } = useAuth();
  const initialProfileRef = useRef<user_profile | null>(null);

  const [photoUploading, setPhotoUploading] = useState(false);
  const [formData, setFormData] = useState<user_profile>({
    name_user: "",
    url_photoprofile_user: "",
    gender_user: "",
    age_user: undefined,
    city: "",
    createAt: undefined,
    updateAt: undefined,
  });

  const getEditableSnapshot = (data: user_profile | null | undefined) => ({
    name_user: data?.name_user ?? "",
    url_photoprofile_user: data?.url_photoprofile_user ?? "",
    gender_user: data?.gender_user ?? "",
    age_user: data?.age_user ?? undefined,
    city: data?.city ?? "",
  });

  useEffect(() => {
    if (loading || !currentUser) return;

    const loadInitialData = async () => {
      const docRef = doc(db, "profile_user", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as user_profile;
        const loadedProfile: user_profile = {
          name_user: data.name_user ?? currentUser.displayName ?? "",
          url_photoprofile_user: data.url_photoprofile_user ?? "",
          gender_user: data.gender_user ?? "",
          age_user: data.age_user,
          city: data.city ?? "",
          createAt: data.createAt,
          updateAt: data.updateAt,
        };

        setFormData(loadedProfile);
        initialProfileRef.current = loadedProfile;
      } else {
        const loadedProfile: user_profile = {
          name_user: currentUser.displayName ?? "",
          url_photoprofile_user: currentUser.photoURL ?? "",
          gender_user: "",
          age_user: undefined,
          city: userProfile.city ?? "",
        };

        setFormData(loadedProfile);
        initialProfileRef.current = loadedProfile;
      }
    };

    loadInitialData();
  }, [currentUser, loading, userProfile]);

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
      const currentSnapshot = getEditableSnapshot(formData);
      const initialSnapshot = getEditableSnapshot(initialProfileRef.current);

      if (JSON.stringify(currentSnapshot) === JSON.stringify(initialSnapshot)) {
        alert("Tidak ada perubahan profil.");
        navigate("/profile");
        return;
      }

      const docRef = doc(db, "profile_user", currentUser.uid);
      
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== undefined)
      );

      await setDoc(docRef, {
        ...cleanedFormData,
        updatedAt: serverTimestamp(),
        uid: currentUser.uid
      }, { merge: true });

      initialProfileRef.current = formData;
      
      alert("Profil berhasil diperbarui!");
      navigate("/profile");
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      alert("Gagal menyimpan profil.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age_user" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender_user: gender }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setPhotoUploading(true);

      const filePath = `profile_user/${currentUser.uid}/profile-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      setFormData((prev: any) => ({ ...prev, url_photoprofile_user: downloadURL }));
      
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
            src={formData.url_photoprofile_user || ImgPlaceholder}
            alt="Profile Avatar"
            className={style.profileImage}
          />
  
          <button className={style.editPhotoBtn} type="button" onClick={handleEditPhoto}>
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
                name="name_user"
                value={formData.name_user}
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
            value={formData.gender_user}
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
                name="age_user"
                value={formData.age_user ?? ""}
                onChange={handleInputChange}
                className={style.input}
              />
            </div>
          </div>
        </div>

        {/* Card: Lokasi */}
        <div className={style.card}>
          <span className={style.label}>Lokasi</span>
          <div className={style.inputGroup}>
            <img
              src={IconLocation}
              alt="Location Icon"
              className={style.icon1}
            />
            <div className={style.inputWrapper}>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={style.input}
              />
              <img src={IconSearch} alt="Search Icon" className={style.icon} />
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleSave} className={style.saveButton} variant="outline">
        Simpan
      </Button>
    </DataScreenLayout>
  );
}
