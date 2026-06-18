import style from "./gendertoggle.module.css";
import GenderIcon from "@/assets/icon/gender.svg";
import { useState, useEffect } from "react";
import IconPriaOn from "@/assets/icon/maleon.svg";
import IconPriaOff from "@/assets/icon/maleoff.svg";
import IconWanitaOn from "@/assets/icon/femaleon.svg";
import IconWanitaOff from "@/assets/icon/femaleoff.svg";
import IconRahasiaOn from "@/assets/icon/rahasiaon.svg";
import IconRahasiaOff from "@/assets/icon/rahasiaoff.svg";

interface GenderToggleProps {
  onGenderChange: (gender: string) => void;
  hideTitle?: boolean;
  value?: string;
}

export default function GenderToggle({
  onGenderChange,
  hideTitle = false,
  value,
}: GenderToggleProps) {
  const [selected, setSelected] = useState<string>(value ?? "Rahasia");

  // Opsi dengan icon sesuai UI baru
  const options = [
    {
      label: "Pria",
      iconOn: IconPriaOn,
      iconOff: IconPriaOff,
    },
    {
      label: "Wanita",
      iconOn: IconWanitaOn,
      iconOff: IconWanitaOff,
    },
    {
      label: "Rahasia",
      iconOn: IconRahasiaOn,
      iconOff: IconRahasiaOff,
    },
  ];

  // Logika fetch milikmu yang tidak diubah fungsinya
  const handleSelect = (optionLabel: string) => {
    setSelected(optionLabel);
    onGenderChange(optionLabel);
  };

  useEffect(() => {
    setSelected(value ?? "Rahasia");
  }, [value]);

  // Mencari index untuk pergerakan animasi slider
  const selectedIndex = options.findIndex((opt) => opt.label === selected);
  const activeIndex = selectedIndex !== -1 ? selectedIndex : 0;

  return (
    <div className={style.gender}>
      {/* Header bisa disembunyikan dengan prop hideTitle */}
      {!hideTitle && (
        <div className={style.header}>
          <img
            src={GenderIcon}
            alt="Gender Icon"
            className={style.icongender}
          />
          <h3 className={style.title}>Jenis Kelamin</h3>
        </div>
      )}

      <div className={style.segmentedControl}>
        <div
          className={style.slider}
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        ></div>

        {options.map((option, index) => {
          // Buat variabel pengecekan status aktif untuk masing-masing tombol
          const isActive = index === activeIndex;

          return (
            <button
              key={option.label}
              type="button"
              className={`${style.segmentBtn} ${isActive ? style.active : ""}`}
              onClick={() => handleSelect(option.label)}
            >
              <span className={style.btnContent}>
                {/* Gunakan img tag dengan kondisi isActive */}
                <img
                  src={isActive ? option.iconOn : option.iconOff}
                  alt={option.label}
                  className={style.iconImg}
                />
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
