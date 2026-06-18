import style from "./ongoingsession.module.css";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import IconPlus from "@/assets/icon/plus.svg";
import IconMinus from "@/assets/icon/minus.svg";
import IconLocation from "@/assets/icon/tagloc.svg";
import IconSOS from "@/assets/icon/silent.svg";
import IconEye from "@/assets/icon/eye.svg";
import Button from "@/views/components/OrangeButton/orangebutton";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "@/config/firebase_config";
import { doc, onSnapshot } from "firebase/firestore";
import ImgPlaceholder from "@/assets/image/img-placeholder.svg";
import { updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import ActivityText, {
  type ActivityType,
} from "@/views/components/IconName/iconame";

export default function OnGoingSessionPage() {
  const { currentUser, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const bookingId = location.state?.bookingId;
  const companionId = location.state?.companionId;
  const requesterId = location.state?.requesterId;

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [companionLocation, setCompanionLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [meetingPoint, setMeetingPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activityType, setActivityType] = useState<ActivityType>("nongkrong");

  const [companionName, setCompanionName] = useState("Companion");
  const [companionAvatar, setCompanionAvatar] = useState(ImgPlaceholder);
  const [userAvatar, setUserAvatar] = useState(ImgPlaceholder);

  const [mapZoom, setMapZoom] = useState(16);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleViewDetails = () => {
    navigate("/live-session", {
      state: {
        bookingId,
        companionId,
        requesterId,
      },
    });
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const normalizeActivityType = (value: unknown): ActivityType => {
    if (typeof value !== "string") {
      return "nongkrong";
    }

    const normalized = value.toLowerCase().replace(/\s+/g, "");

    if (normalized.includes("jalan")) return "jalan";
    if (normalized.includes("belajar")) return "belajar";
    if (normalized.includes("nonton")) return "nonton";
    if (normalized.includes("kuliner") || normalized.includes("makan"))
      return "kuliner";
    if (normalized.includes("olahraga") || normalized.includes("sport"))
      return "olahraga";

    return "nongkrong";
  };

  useEffect(() => {
    if (!currentUser || !bookingId) return;

    const targetUserId = role === "companion" ? requesterId : currentUser.uid;
    if (!targetUserId) return;

    const bookingRef = doc(db, "bookings", targetUserId, "booking", bookingId);

    const unsubscribeBooking = onSnapshot(bookingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setActivityType(normalizeActivityType(data.activity_name));

        const locationData = data.location;

        if (
          locationData &&
          typeof locationData === "object" &&
          locationData.lat
        ) {
          setMeetingPoint({
            lat: locationData.lat,
            lng: locationData.lng,
          });
        } else if (typeof locationData === "string") {
          setMeetingPoint({ lat: -7.284545, lng: 112.631589 }); // Koordinat default sementara
        } else {
          setMeetingPoint({ lat: -7.284545, lng: 112.631589 }); // Koordinat default sementara
        }
      }
    });

    return () => unsubscribeBooking();
  }, [currentUser, bookingId, role, requesterId]);

  useEffect(() => {
    if (!companionId) return;

    const statusRef = doc(db, "online_status", companionId);
    const unsubscribe = onSnapshot(statusRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.current_location) {
          setCompanionLocation(data.current_location);
        }
      }
    });

    return () => unsubscribe();
  }, [companionId]);

  useEffect(() => {
    if (!currentUser) return;

    let lastSavedLocation = { lat: 0, lng: 0 };

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newCoords);

        const distanceMoved = calculateDistance(
          lastSavedLocation.lat,
          lastSavedLocation.lng,
          newCoords.lat,
          newCoords.lng,
        );

        if (distanceMoved > 10 || lastSavedLocation.lat === 0) {
          try {
            const statusRef = doc(db, "online_status", currentUser.uid);
            await updateDoc(statusRef, {
              current_location: newCoords,
              last_seen: serverTimestamp(),
            });
            lastSavedLocation = newCoords;
          } catch (err) {
            console.error("Gagal update lokasi:", err);
          }
        }
      },
      (error) => console.error("Akses lokasi error:", error),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const userProfileRef = doc(db, "profile_user", currentUser.uid);
    const unsubscribeUserProfile = onSnapshot(userProfileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserAvatar(data.url_photoprofile_user || ImgPlaceholder);
      }
    });

    return () => unsubscribeUserProfile();
  }, [currentUser]);

  useEffect(() => {
    if (!companionId && !requesterId) return;

    let targetRef;

    if (role === "companion" && requesterId) {
      targetRef = doc(db, "profile_user", requesterId);
    } else if (companionId) {
      targetRef = doc(db, "profile_companion", companionId);
    }

    if (!targetRef) return;

    const unsubscribeProfile = onSnapshot(targetRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (role === "companion") {
          setCompanionName(data.name_user || "User");
          setCompanionAvatar(data.url_photoprofile_user || ImgPlaceholder);
        } else {
          setCompanionName(data.name_companion || "Companion");
          setCompanionAvatar(data.url_photoprofile_companion || ImgPlaceholder);
        }
      }
    });

    return () => unsubscribeProfile();
  }, [role, companionId, requesterId]);

  return (
    <DataScreenLayout
      title="Sesi Aktif"
      noShadow={true}
      contentClassName={style.customPadding}
    >
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <div className={style.mapContainer}>
          <Map
            zoom={mapZoom}
            onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
            center={mapCenter || meetingPoint}
            onCenterChanged={(e) => setMapCenter(e.detail.center)}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
          >
            {/* Marker: Companion */}
            {companionLocation && (
              <AdvancedMarker position={companionLocation}>
                <div className={style.markerWrapper}>
                  <img
                    src={companionAvatar}
                    alt="Companion"
                    className={style.avatarImage}
                  />
                  <span className={style.labelTiara}>COMPANION</span>
                </div>
              </AdvancedMarker>
            )}

            {/* Marker: You */}
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div className={style.markerWrapper}>
                  <img
                    src={userAvatar}
                    alt="You"
                    className={style.avatarImage}
                  />
                  <span className={style.labelYou}>YOU</span>
                </div>
              </AdvancedMarker>
            )}

            {/* Marker: Meeting Point (Titik Temu) */}
            <AdvancedMarker position={meetingPoint}>
              <div className={style.meetingPoint}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="3"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </AdvancedMarker>
          </Map>
        </div>
      </APIProvider>

      {/* 2. TOMBOL KONTROL PETA (Tetap gunakan UI milikmu) */}
      <div className={style.mapControls}>
        <button
          className={style.controlBtn}
          onClick={() => setMapZoom((prev) => Math.min(prev + 1, 22))}
        >
          <img src={IconPlus} alt="Plus" />
        </button>
        <button
          className={style.controlBtn}
          onClick={() => setMapZoom((prev) => Math.max(prev - 1, 1))}
        >
          <img src={IconMinus} alt="Minus" />
        </button>
        <button
          className={`${style.controlBtn} ${style.controlBtnLocation}`}
          onClick={() => {
            if (userLocation) {
              setMapCenter(userLocation);
              setMapZoom(18);
            } else {
              alert("Lokasi kamu belum ditemukan. Pastikan GPS menyala.");
            }
          }}
        >
          <img src={IconLocation} alt="Location" />
        </button>
      </div>

      {/* 3. BOTTOM CARD (Tetap sama) */}
      <div className={style.bottomCard}>
        <div className={style.statusRow}>
          <div className={style.safetyIndicator}>
            <div className={style.dotGreen}></div>
            <span className={style.safetyText}>SAFETY STATUS: SECURE</span>
          </div>
          <span className={style.tagActive}>Active</span>
        </div>

        <div className={style.infoRow}>
          <div>
            <h2 className={style.titleMain}>Sesi sedang berlangsung</h2>
            <p className={style.subtitle}>
              <ActivityText type={activityType} /> with{" "}
              {companionName || "Companion"}
            </p>
          </div>
          <div className={style.timeContainer}>
            <p className={style.timeLabel}>ELAPSED TIME</p>
            <p className={style.timeValue}>45:12</p>
          </div>
        </div>

        <div className={style.progressBar}>
          <progress value={45} max={100} className={style.htmlProgress} />
        </div>

        <Button
          className={style.btnDetails}
          shadow="none"
          variant="primary"
          onClick={handleViewDetails}
        >
          <img src={IconEye} alt="View Details" />
          View Details
        </Button>

        <button className={style.btnSOS}>
          <img src={IconSOS} alt="SOS" />
          Silent SOS
        </button>
      </div>
    </DataScreenLayout>
  );
}
