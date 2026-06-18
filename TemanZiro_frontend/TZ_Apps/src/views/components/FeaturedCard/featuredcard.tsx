import { useEffect, useMemo, useRef, useState } from "react";
import style from "./featuredcard.module.css";
import IconLocation from "@/assets/icon/location-primary.svg";
import IconDate from "@/assets/icon/date-primary.svg";
import IconTime from "@/assets/icon/time-primary.svg";
import IconChat from "@/assets/icon/chat-active.svg";
import IconCamera from "@/assets/icon/camera.svg";
import IconQR from "@/assets/icon/qrcode.svg";
import IMGMiniZiro from '@/assets/image/mini-ziro.svg';
import { useNavigate } from "react-router-dom";

export interface FeaturedUserData {
  id?: string | number;
  name: string;
  age: number | string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  notes: string;
  avatar: string;
  status?: string;

}

interface FeaturedCardProps {
  userData: FeaturedUserData;
  onChatClick?: () => void;
  showViewProfileButton?: boolean;
  isChatDisabled?: boolean;
  isCheckInDisabled?: boolean;
  checkInMode?: "camera" | "qr";
  checkInPayload?: string;
  bookingId?: string | number;
}

export default function FeaturedCard({
  userData,
  onChatClick,
  isChatDisabled = false,
  isCheckInDisabled = false,
  checkInMode = "camera",
  checkInPayload,
  bookingId,
}: FeaturedCardProps) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  const qrValue = useMemo(
    () => checkInPayload || String(userData.id ?? userData.name),
    [checkInPayload, userData.id, userData.name],
  );


  const handleCardClick = () => {
    if (userData.status === "Batal" || userData.status === "Dibatalkan" || userData.status === "Menunggu Pembayaran" || userData.status === "Mencari") return;
    navigate('/detail-day', {
      state: {
        bookingId: bookingId || userData.id,
        userId: (userData as any).userId
      }
    });
  };

  useEffect(() => {
    if (!isCheckInOpen || checkInMode !== "camera") return;

    let isMounted = true;

    const startCamera = async () => {
      try {
        setCameraError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError("Kamera tidak dapat diakses di perangkat ini.");
      }
    };

    void startCamera();

    return () => {
      isMounted = false;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isCheckInOpen, checkInMode]);

  const handleCheckInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isCheckInDisabled) return;
    setIsCheckInOpen(true);
  };

  const handleCloseCheckIn = () => {
    setIsCheckInOpen(false);
  };

  return (
    <div className={style.featuredCard} onClick={handleCardClick}>
      {/* PROFILE HEADER */}
      <div className={style.profileHeader}>
        <div className={style.avatarContainer}>
          {userData.status === "online" &&
            <div className={style.onlineDot}></div>
          }
          <img
            src={userData.avatar || IMGMiniZiro}
            alt={userData.name ?? 'User avatar'}
            className={style.avatarImage}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMGMiniZiro; }}
          />
        </div>

        <div className={style.profileInfo}>
          <h3 className={style.profileName}>
            {userData.name}, {userData.age}
          </h3>

          <div className={style.infoRow}>
            <img src={IconLocation} alt="Location" className={style.icon} />
            {userData.location.address}
          </div>

          <div className={style.infoRow}>
            <img src={IconDate} alt="Date" className={style.icon} />
            {userData.date}
          </div>

          <div className={style.infoRow}>
            <img src={IconTime} alt="Time" className={style.icon} />
            {userData.time}
          </div>
        </div>
      </div>

      {/* CATATAN PERTEMUAN */}
      <div className={style.notesSection}>
        <h4 className={style.notesLabel}>Catatan Pertemuan</h4>
        <div className={style.notesBox}>{userData.notes}</div>
      </div>


      {/* ACTION BUTTONS */}
      <div className={style.actionButtons}>

        <button
          className={`${style.btnChat} ${isChatDisabled ? style.btnDisabled : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onChatClick) onChatClick();
          }}
          disabled={isChatDisabled}
          aria-label="Chat"
        >
          <img src={IconChat} alt="Chat" className={style.icon1} />
          Chat
        </button>

        <button
          className={`${style.btnCheckIn} ${isCheckInDisabled ? style.btnDisabled : ""}`}
          onClick={handleCheckInClick}
          disabled={isCheckInDisabled}
          aria-label={checkInMode === "camera" ? "Check In" : "QR Code"}
        >
          <img
            src={checkInMode === "camera" ? IconCamera : IconQR}
            alt={checkInMode === "camera" ? "Camera" : "QR Code"}
            className={style.icon1}
          />
          {checkInMode === "camera" ? "Check In" : "QR Code"}
        </button>
      </div>

      {isCheckInOpen && (
        <div className={style.modalOverlay} onClick={handleCloseCheckIn}>
          <div className={style.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={style.modalClose} onClick={handleCloseCheckIn} type="button">
              ×
            </button>

            <h4 className={style.modalTitle}>
              {checkInMode === "camera" ? "Buka Kamera" : "QR Check In"}
            </h4>

            {checkInMode === "camera" ? (
              <div className={style.cameraBox}>
                {cameraError ? (
                  <p className={style.modalMessage}>{cameraError}</p>
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted className={style.cameraPreview} />
                )}
              </div>
            ) : (
              <div className={style.qrBox}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}`}
                  alt="QR Check In"
                  className={style.qrImage}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMGMiniZiro; }}
                />
                <p className={style.modalMessage}>Tunjukkan QR ini kepada user untuk check in.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
