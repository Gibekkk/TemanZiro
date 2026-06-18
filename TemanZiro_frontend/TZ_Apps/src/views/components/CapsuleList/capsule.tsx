import React, { useState } from "react";
import style from "./capsule.module.css";
import MinatIcon from "@/assets/icon/minat.svg";

interface MinatProps {
  value?: string[];
  onMinatChange?: (selected: string[]) => void;
  onNewPreferencesChange?: (newPrefs: string[]) => void;
  showAddButton?: boolean;
  preference_data?: string[];
  className?: string;
}

const DEFAULT_VALUE: string[] = [];
const DEFAULT_PREF_DATA: string[] = [];

export default function MinatComponent({
  value = DEFAULT_VALUE,
  onMinatChange,
  onNewPreferencesChange,
  showAddButton = true,
  preference_data = DEFAULT_PREF_DATA,
  className = ""
}: MinatProps) {
  const [selectedMinat, setSelectedMinat] = useState<string[]>(value);

  // Preference baru yang belum ada di preference_data (belum masuk Firestore)
  const [localNewPrefs, setLocalNewPrefs] = useState<string[]>([]);

  const [isAddingMode, setIsAddingMode] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const allPreferences = Array.from(
    new Set([...preference_data, ...localNewPrefs, ...selectedMinat]),
  );

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedMinat(value);
    }
  }, [value]);

  const handleToggleMinat = (minat: string) => {
    let newData: string[];
    if (selectedMinat.includes(minat)) {
      newData = selectedMinat.filter((item) => item !== minat);
    } else {
      newData = [...selectedMinat, minat];
    }
    setSelectedMinat(newData);
    if (onMinatChange) onMinatChange(newData);
  };

  const handleSimpanCustomMinat = () => {
    const teksBaru = customInputValue.trim();
    setErrorMessage("");

    if (!teksBaru) {
      setErrorMessage("Minat tidak boleh kosong.");
      return;
    }

    if (allPreferences.includes(teksBaru)) {
      setErrorMessage("Minat sudah ada di daftar.");
      return;
    }

    // Simpan ke local state saja, belum ke Firestore
    const updatedNewPrefs = [...localNewPrefs, teksBaru];
    setLocalNewPrefs(updatedNewPrefs);

    // Beritahu parent daftar preference baru yang pending
    if (onNewPreferencesChange) onNewPreferencesChange(updatedNewPrefs);

    // Langsung select preference baru
    handleToggleMinat(teksBaru);

    setCustomInputValue("");
    setIsAddingMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSimpanCustomMinat();
    }
  };

  return (
    <div className={`${style.minatComponent} ${className}`.trim()}>
      <div className={style.header}>
        <img src={MinatIcon} alt="Minat Icon" />
        <p className={style.title}>Kamu orangnya kayak gimana?</p>
      </div>

      <div className={style.content}>
        {allPreferences.map((minat) => {
          const isActive = selectedMinat.includes(minat);
          return (
            <button
              key={minat}
              onClick={() => handleToggleMinat(minat)}
              className={`${style.capsule} ${isActive ? style.active : ""}`}
            >
              {minat}
            </button>
          );
        })}

        {showAddButton &&
          (isAddingMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <input
                type="text"
                className={style.customInput}
                placeholder="Ketik lalu Enter..."
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSimpanCustomMinat}
                autoFocus
              />
              {errorMessage && (
                <p style={{ color: "#ff6b6b", fontSize: "12px", margin: 0 }}>
                  {errorMessage}
                </p>
              )}
            </div>
          ) : (
            <button
              className={`${style.capsule} ${style.capsuleAdd}`}
              onClick={() => setIsAddingMode(true)}
            >
              + Tambah
            </button>
          ))}
      </div>
    </div>
  );
}