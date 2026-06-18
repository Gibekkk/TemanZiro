import React, { useEffect, useState } from 'react';
import style from './interestselector.module.css';

// --- IMPORT ICON LOKAL (ORANYE & PUTIH) ---
import IconClipboard from '@/assets/icon/bidang.svg';
import IconNongkrongOrange from '@/assets/icon/nongkrongorange.svg';
import IconNongkrongWhite from '@/assets/icon/Vector.svg';
import IconJalanOrange from '@/assets/icon/belanjaorange.svg';
import IconJalanWhite from '@/assets/icon/belanjawhite.svg';
import IconBelajarOrange from '@/assets/icon/belajarorange.svg';
import IconBelajarWhite from '@/assets/icon/belajarwhite.svg';
import IconOlahragaOrange from '@/assets/icon/olahragaorange.svg';
import IconOlahragaWhite from '@/assets/icon/Vector-1.svg'; 
import IconKulinerOrange from '@/assets/icon/kulinerorange.svg';
import IconKulinerWhite from '@/assets/icon/kulinerwhite.svg'; 
import IconHiburanOrange from '@/assets/icon/hiburanorange.svg';
import IconHiburanWhite from '@/assets/icon/hiburanwhite.svg';

interface InterestProps {
  value?: string[];
  onChange?: (selected: string[]) => void;
  interests?: string[];
  className?: string;
}

const DEFAULT_VALUE: string[] = [];
const DEFAULT_INTERESTS: string[] = ["Nongkrong", "Jalan-jalan", "Belajar", "Olahraga", "Kuliner", "Hiburan"];  

export default function InterestSelector({ value = DEFAULT_VALUE, onChange, interests = DEFAULT_INTERESTS, className = "" }: InterestProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(value);
  const defaultInterests = [
    { label: "Nongkrong", iconOrange: IconNongkrongOrange, iconWhite: IconNongkrongWhite },
    { label: "Jalan-jalan", iconOrange: IconJalanOrange, iconWhite: IconJalanWhite },
    { label: "Belajar", iconOrange: IconBelajarOrange, iconWhite: IconBelajarWhite },
    { label: "Olahraga", iconOrange: IconOlahragaOrange, iconWhite: IconOlahragaWhite },
    { label: "Kuliner", iconOrange: IconKulinerOrange, iconWhite: IconKulinerWhite },
    { label: "Hiburan", iconOrange: IconHiburanOrange, iconWhite: IconHiburanWhite },
  ];

  // Map interests to include icons
  const interestData = interests.map(label => {
    const defaultItem = defaultInterests.find(item => item.label === label);
    return defaultItem || { label, iconOrange: IconNongkrongOrange, iconWhite: IconNongkrongWhite }; // fallback icon
  });

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedInterests(value);
    }
  }, [value]);

  useEffect(() => {
    // Filter selectedInterests to only include available interests
    setSelectedInterests(prev => prev.filter(interest => interests.includes(interest)));
  }, [interests]);

  const toggleInterest = (interest: string) => {
    const newSelected = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(newSelected);
    if (onChange) onChange(newSelected);
  };

  return (
    <div className={`${style.container} ${className}`}>
      <div className={style.header}>
        <img src={IconClipboard} alt="Clipboard" className={style.headerIcon} />
        <h2 className={style.title}>Kamu minat di bidang apa?</h2>
      </div>

      <div className={style.grid}>
        {interestData.map((item) => {
          const isActive = selectedInterests.includes(item.label);
          
          return (
            <button
              key={item.label}
              type="button"
              className={`${style.button} ${isActive ? style.buttonActive : ''}`}
              onClick={() => toggleInterest(item.label)}
            >
              <img 
                src={isActive ? item.iconWhite : item.iconOrange} 
                alt={item.label} 
                className={style.icon} 
              />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}