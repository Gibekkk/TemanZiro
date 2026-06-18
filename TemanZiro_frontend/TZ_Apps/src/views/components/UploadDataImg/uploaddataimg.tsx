import style from "./uploaddataimg.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import IconLabel from "@/views/components/IconLabel/iconlabel";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase_config";

interface UploadIMGProps {
  textButton: string;
  icon: string;
  userId: string;
  folder: string;
  navigateTo: string;
  uploadedUrlKey: string;
  nextState?: Record<string, unknown>;
  onUploadComplete?: (downloadURL: string, file: File) => void;
  currentUrl?: string | null;
  onUploadSuccess?: () => void;
}

export const uploadToStorage = async (file: File, userId: string, folder: string) => {
  try {
    const fileRef = ref(storage, `${folder}/${userId}/${Date.now()}/${file.name}`);

    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default function UploadIMG({
  textButton,
  icon,
  userId,
  folder,
  navigateTo,
  uploadedUrlKey,
  nextState,
  onUploadComplete,
  currentUrl,
  onUploadSuccess,
}: UploadIMGProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) {
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const downloadURL = await uploadToStorage(file, userId, folder);
      onUploadComplete?.(downloadURL, file);
      onUploadSuccess?.();
      navigate(navigateTo, {
        state: {
          ...(nextState ?? {}),
          [uploadedUrlKey]: downloadURL,
        },
      });
    } catch (error) {
      console.error("Error handling selected file:", error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className={style.containerImg}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
        capture="user"
      />
      <IconLabel icon={currentUrl || icon} label="none" color="#cc5500" />
      <div className={style.content}>
        <h3 className={style.title}>Verifikasi Identitas Dasar</h3>
        <p className={style.subtitle}>
          Dengan verifikasi selfie singkat, TemanZiro tetap aman dan ramah untuk
          semua.
        </p>
      </div>
      <Button
        variant="primary"
        shadow="none"
        className={style.button}
        onClick={handleButtonClick}
        disabled={isUploading || !userId}
      >
        {isUploading ? "Mengunggah..." : textButton}
      </Button>
      <p className={style.footerContainer}>TERENKRIPSI & AMAN</p>
    </div>
  );
}