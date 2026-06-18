import React from "react";
// Kamu bisa tetap memanggil CSS yang sama, atau membuat file CSS khusus untuk ini
import style from "./philosophy.module.css";

interface PhilosophyCardProps {
  philosophy: string;
}

export default function PhilosophyCard({ philosophy }: PhilosophyCardProps) {
  return (
    <>
      <h3 className={style.sectionTitle}>Companion Philosophy</h3>
      <p className={style.philosophyText}>{philosophy}</p>
    </>
  );
}
