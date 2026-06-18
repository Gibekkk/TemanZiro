import React, { useState, useEffect, use } from "react";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import Button from "@/views/components/OrangeButton/orangebutton";
import style from "./matchconfirm_page.module.css";
import IconCoffe from "@/assets/icon/coffe.svg";
import IconVeirifiedSafety from "@/assets/icon/verifiedsafety.svg";
import IconLocation from "@/assets/icon/location.svg";
import IconDate from "@/assets/icon/date.svg";
import IconPay from "@/assets/icon/pay.svg";
import PaymentZiro from "@/assets/image/paymentziro.svg";
import IconCopy from "@/assets/icon/copytext.svg";
import { useAuth } from "@/controllers/hooks/useAuth";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { activities } from "@/views/components/ActivityGrid/ActivityGrid";

export default function MatchConfirmationPage() {
  const { userProfile, loading: authLoading, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);

  const { bookingId, bookingData, companionData } = location.state || {};

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationText, setLocationText] = useState("Menentukan lokasi...");
  const [locationError, setLocationError] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || !bookingId || !bookingData || !companionData) {
      console.error("Data tidak lengkap, kembali ke dashboard");
      // navigate("/dashboard");
      return;
    }
    setLoading(false);
  }, [
    currentUser,
    bookingId,
    bookingData,
    companionData,
    authLoading,
    navigate,
  ]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCoords({ lat: latitude, lng: longitude });
          setLocationText(
            `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          );
        },
        (error) => {
          setLocationError("Akses lokasi ditolak / gagal.");
          setLocationText("Lokasi tidak diketahui");
        },
      );
    } else {
      setLocationError("Browser tidak mendukung Geolocation.");
      setLocationText("Lokasi tidak tersedia");
    }
  }, []);

  const formatRupiah = (angka: number = 0) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <DataScreenLayout title="Konfirmasi Companion Kamu" alignLeft>
        <div className={style.pageContainer}>
          <div className={style.profileCard}>
            <img
              src={companionData?.photoURL || ImgPlaceholder}
              alt="Companion Profile"
              className={style.profileImage}
            />
            <h2 className={style.profileName}>
              {companionData?.name_companion || "Teman Ziro"},{" "}
              {companionData?.age_companion || "Umur"}
            </h2>
            <div className={style.verifiedBadge}>
              <img src={IconVeirifiedSafety} alt="" />
              <span>VERIFIED COMPANION</span>
            </div>
          </div>

          <h3 className={style.sectionTitle}>Activity Summary</h3>
          <div className={style.summaryCard}>
            <div className={style.summaryItem}>
              <div className={style.iconWrapper}>
                <img src={IconCoffe} alt="" className={style.iconOrange1} />
              </div>
              <div className={style.itemText}>
                <h4>{bookingData?.activity_name || "Activity Name"}</h4>
                <p>{bookingData?.activity_type || "Activity Type"}</p>
              </div>
            </div>
            <hr className={style.divider} />

            <div className={style.summaryItem}>
              <div className={style.iconWrapper}>
                <img src={IconLocation} alt="" className={style.iconOrange2} />
              </div>
              <div className={style.itemText}>
                <h4>{bookingData?.location_name || "Location Name"}</h4>
                <p>{bookingData?.location_address || "Location Address"}</p>
              </div>
            </div>
            <hr className={style.divider} />

            <div className={style.summaryItem}>
              <div className={style.iconWrapper}>
                <img src={IconDate} alt="" className={style.iconOrange3} />
              </div>
              <div className={style.itemText}>
                <h4>{formatDateString(bookingData?.date || "")}</h4>
                <p>{bookingData?.time || "16:00 - 18:00"} (2 Hours)</p>
              </div>
            </div>

            <hr className={style.divider} />

            {coords ? (
              <iframe
                title="Peta Lokasi User"
                className={style.mapImage}
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
              ></iframe>
            ) : (
              // Loading state atau jika error
              <div className={`${style.mapImage} ${style.mapLoading}`}>
                <p>
                  {locationError ? "Peta tidak tersedia" : "Memuat peta..."}
                </p>
              </div>
            )}
          </div>

          <h3 className={style.sectionTitle}>Session Notes</h3>
          <div className={style.notesContainer}>
            <textarea
              className={style.notesInput}
              placeholder="Add any specific topics, goals, or preferences for Sarah..."
            ></textarea>
          </div>
          <p className={style.helperText}>
            Optional: Help {companionData?.name_companion || "Teman Ziro"}{" "}
            prepare for your session.
          </p>

          <div className={style.safetyBanner}>
            <img
              src={IconVeirifiedSafety}
              alt=""
              className={style.safetyIcon}
            />
            <div className={style.safetyText}>
              <h4>TemanZiro Safety Guaranteed</h4>
              <p>
                Your session is secured. We keep your contact details private
                until the session is confirmed. SOS support is available in-app.
              </p>
            </div>
          </div>

          <div className={style.pricingSection}>
            <div className={`${style.priceRow} ${style.totalRow}`}>
              <span>Total Amount</span>
              <span className={style.totalValue}>{formatRupiah(bookingData?.total_price || 0)}</span>
            </div>
          </div>
        </div>

        <div
          className={`${style.overlay} ${isPopupOpen ? style.overlayActive : ""}`}
          onClick={() => setIsPopupOpen(false)}
        ></div>

        <div
          className={`${style.bottomSheet} ${isPopupOpen ? style.sheetActive : ""}`}
        >
          <div className={style.sheetHandle}></div>

          <div className={style.content}>
            <img src={PaymentZiro} alt="" className={style.ziro} />
            <div className={style.desc}>
              <h3>Pembayaran</h3>
              <h4>Kode Pembayaran</h4>
              <div className={style.value}>
                <p>drftgyhjkjhgfdfghj</p>
                <img src={IconCopy} alt="" />
              </div>
              <h4 className={style.has}>Total Pembayaran</h4>
              <div className={style.value}>
                <p className={style.has}>{formatRupiah(bookingData?.total_price || 0)}</p>
              </div>
            </div>
          </div>

          <div className={style.popupActions}>
            <Button
              variant="primary"
              onClick={() => alert("Pesanan Dikonfirmasi!")}
            >
              Sudah Bayar
            </Button>
          </div>
        </div>
      </DataScreenLayout>
      <footer className={style.bottomBar}>
        <Button
          variant="primary"
          className={style.buttonskip}
          onClick={() => setIsPopupOpen(true)}
        >
          <img src={IconPay} alt="" />
          Konfirmasi Pesan & Sesi
        </Button>
        <Button variant="ghost" shadow="none" className={style.buttonskip1}>
          Kembali ke Profil Companion
        </Button>
      </footer>
    </>
  );
}
