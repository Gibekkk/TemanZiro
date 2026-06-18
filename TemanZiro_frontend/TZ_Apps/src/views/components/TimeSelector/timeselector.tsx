import React, { useState } from "react";
import style from "./timeselector.module.css";
import IconCalendar from '@/assets/icon/date.svg';
import IconCheck from "@/assets/icon/check.svg";

export default function TimeSelector() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Pilih Hari");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Senin",
    "Selasa",
  ]);

  const timeOptions = [
    "Pagi Weekdays",
    "Malam Weekday",
    "Akhir Pekan",
    "Setiap hari",
  ];

  const daysOfWeek = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  const toggleDay = (day: string) => {
    if (selectedCategory !== "Pilih Hari") setSelectedCategory("Pilih Hari");

    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <img src={IconCalendar} alt="Calendar" className={style.headerIcon} />
        <h2 className={style.title}>Kapan kamu ada waktu?</h2>
      </div>

      <div className={style.grid}>
        {timeOptions.map((option) => {
          // Buat variabel agar lebih rapi dibaca
          const isActive = selectedCategory === option;

          return (
            <div
              key={option}
              // GABUNGKAN CLASS: Jika isActive true, tambahkan style.timeOptionActive
              className={`${style.timeOption} ${isActive ? style.timeOptionActive : ""}`}
              onClick={() => setSelectedCategory(option)}
            >
              <span>{option}</span>
              {isActive ? (
                <img
                  src={IconCheck}
                  alt="Checked"
                  className={style.checkIcon}
                />
              ) : (
                <div className={style.radioCircle}></div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`${style.customDayCard} ${selectedCategory === "Pilih Hari" ? style.customDayCardActive : ""}`}
        onClick={() => setSelectedCategory("Pilih Hari")}
      >
        <div className={style.customDayHeader}>
          <span>Pilih Hari</span>
          {selectedCategory === "Pilih Hari" ? (
            <img src={IconCheck} alt="Checked" className={style.checkIcon} />
          ) : (
            <div className={style.radioCircle}></div>
          )}
        </div>

        <div className={style.daysGrid}>
          {daysOfWeek.map((day) => {
            const isActive =
              selectedCategory === "Pilih Hari" && selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                className={`${style.dayBtn} ${isActive ? style.dayBtnActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDay(day);
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
