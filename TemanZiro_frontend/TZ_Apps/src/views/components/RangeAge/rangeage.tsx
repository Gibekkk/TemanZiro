import React, { useState } from "react";
import style from "./rangeage.module.css";
import IconAge from "@/assets/icon/age.svg";

// import CalendarIcon from "@/assets/icon/calendar.svg";

interface AgeRangeSliderProps {
  onAgeRangeChange?: (range: number[]) => void;
}

export default function AgeRangeSlider({ onAgeRangeChange }: AgeRangeSliderProps) {
  const minBoundary = 18;
  const maxBoundary = 60;

  // State untuk nilai minimum dan maksimum
  const [minVal, setMinVal] = useState(20);
  const [maxVal, setMaxVal] = useState(30);

  // Kalkulasi persentase untuk mengatur lebar dan posisi warna oranye
  const getPercent = (value: number) =>
    Math.round(((value - minBoundary) / (maxBoundary - minBoundary)) * 100);

  const leftPercent = getPercent(minVal);
  const rightPercent = getPercent(maxVal);

  // Handle perubahan slider kiri (Min)
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
    onAgeRangeChange?.([value, maxVal]);
  };

  // Handle perubahan slider kanan (Max)
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
    onAgeRangeChange?.([minVal, value]);
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.titleWrapper}>
          <img src={IconAge} alt="Calendar" className={style.icon} />
          <h3 className={style.title}>Rentan Umur</h3>
        </div>
        <div className={style.badge}>
          {minVal} - {maxVal === maxBoundary ? `${maxVal}+` : maxVal}
        </div>
      </div>
      <div className={style.sliderWrapper}>
        <input
          type="range"
          min={minBoundary}
          max={maxBoundary}
          value={minVal}
          onChange={handleMinChange}
          className={`${style.thumb} ${style.thumbLeft}`}
        />
        <input
          type="range"
          min={minBoundary}
          max={maxBoundary}
          value={maxVal}
          onChange={handleMaxChange}
          className={`${style.thumb} ${style.thumbRight}`}
        />

        <div className={style.sliderTrack}>
          <div className={style.trackBg}></div>

          <div
            className={style.trackHighlight}
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`,
            }}
          ></div>
        </div>

        <div className={style.labels}>
          <span>18</span>
          <span>30</span>
          <span>45</span>
          <span>60+</span>
        </div>
      </div>
    </div>
  );
}
