import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./detailpend.module.css";
import { useState, useEffect } from "react";
import IconLocation from "@/assets/icon/location.svg";
import IconDate from "@/assets/icon/date.svg";
import IconCoffe from "@/assets/icon/coffe.svg";
import { useAuth } from "@/controllers/hooks/useAuth";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";

export default function DetailPendPage() {
  const { userProfile, loading, currentUser } = useAuth();

  const profileAvatar = (userProfile?.url_photoprofile_user) || currentUser?.photoURL || ImgPlaceholder;
  const placeholderImg = ImgPlaceholder;

  // const dummyProfileImage = "https://i.pravatar.cc/150?img=5";

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationText, setLocationText] = useState("Menentukan lokasi...");
  const [locationError, setLocationError] = useState("");

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

  return (
    <DataScreenLayout
      title="Info Pemesanan"
      rightProfile={profileAvatar}
      alignLeft={true}
      noShadow={true}
      contentClassName={style.customPadding}
    >
      <div className={style.cardContainer}>
        {/* --- HEADER --- */}
        <div className={style.headerSection}>
          <img
            src={placeholderImg}
            alt="Profile Avatar"
            className={style.avatar}
          />
          <h3 className={style.statusText}>Mencari Teman Ziro . . .</h3>
        </div>

        {/* --- PAYMENT DETAILS --- */}
        <div className={style.paymentSection}>
          <div className={`${style.paymentRow} ${style.totalRow}`}>
            <span className={style.totalValue}>Rp.70.000</span>
            <span className={style.paymentLabel}>Total Pembayaran</span>
          </div>
        </div>

        <div className={style.divider}></div>

        {/* --- ACTIVITY DETAILS --- */}
        <div className={style.summaryCard}>
          <div className={style.summaryItem}>
            <div className={style.iconWrapper}>
              <img src={IconCoffe} alt="" className={style.iconOrange1} />
            </div>
            <div className={style.itemText}>
              <h4>Cafe & Chill</h4>
              <p>Activity Type</p>
            </div>
          </div>

          <div className={style.summaryItem}>
            <div className={style.iconWrapper}>
              <img src={IconLocation} alt="" className={style.iconOrange2} />
            </div>
            <div className={style.itemText}>
              <h4>Central Park Mall</h4>
              <p>Location</p>
            </div>
          </div>

          <div className={style.summaryItem}>
            <div className={style.iconWrapper}>
              <img src={IconDate} alt="" className={style.iconOrange3} />
            </div>
            <div className={style.itemText}>
              <h4>Tomorrow, 14 Sept</h4>
              <p>16:00 - 18:00 (2 Hours)</p>
            </div>
          </div>

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
              <p>{locationError ? "Peta tidak tersedia" : "Memuat peta..."}</p>
            </div>
          )}
        </div>

        <div className={style.divider1}></div>

        {/* --- SESSION NOTES --- */}
        <div className={style.notesSection}>
          <h3 className={style.notesTitle}>Session Notes</h3>
          <textarea
            className={style.notesTextarea}
            placeholder="No specific notes provided."
            readOnly={true}
            value="Add any specific topics, goals, or preferences for Sarah..."
          ></textarea>
        </div>
      </div>
    </DataScreenLayout>
  );
}
