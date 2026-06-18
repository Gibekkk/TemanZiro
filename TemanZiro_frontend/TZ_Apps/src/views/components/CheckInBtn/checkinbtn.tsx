import style from './checkinbtn.module.css';
import { useState, useEffect, useRef, useMemo } from "react";
import IconCamera from "@/assets/icon/camerawhite.svg";
import IconQR from "@/assets/icon/qrcode.svg";
import Button from "@/views/components/OrangeButton/orangebutton";

interface CheckInButtonProps {
  mode: "camera" | "qr";
  payload?: string;
  buttonText?: string;
  isDisabled?: boolean;
  targetName?: string;
  className?: string;
}

export default function CheckInButton({
  mode,
  payload = "fallback-data",
  buttonText,
  isDisabled = false,
    targetName = "user",
    className = "",
}: CheckInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const qrValue = useMemo(() => payload, [payload]);

  useEffect(() => {
    if (!isOpen || mode !== "camera") return;

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
      } catch (err) {
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
  }, [isOpen, mode]);

  const handleOpen = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* TOMBOL UTAMA */}
      <Button
        className={`${style.btnCheckIn} ${isDisabled ? style.btnDisabled : ""} ${className}`}
        onClick={handleOpen}
        disabled={isDisabled}
      >
        <img
          src={mode === "camera" ? IconCamera : IconQR}
          alt={mode === "camera" ? "Camera" : "QR Code"}
          className={style.icon}
        />
        {buttonText || (mode === "camera" ? "Scan QR" : "Tampilkan QR")}
      </Button>

      {/* MODAL POPUP (KAMERA / QR) */}
      {isOpen && (
        <div className={style.modalOverlay} onClick={handleClose}>
          <div className={style.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={style.modalClose} onClick={handleClose} type="button">
              ×
            </button>

            <h4 className={style.modalTitle}>
              {mode === "camera" ? "Scan QR Code" : "QR Check In"}
            </h4>

            {mode === "camera" ? (
              <div className={style.cameraBox}>
                {cameraError ? (
                  <p className={style.modalMessage}>{cameraError}</p>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={style.cameraPreview}
                  />
                )}
              </div>
            ) : (
              <div className={style.qrBox}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}`}
                  alt="QR Check In"
                  className={style.qrImage}
                />
                <p className={style.modalMessage}>
                  Tunjukkan QR code ini pada {targetName}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}