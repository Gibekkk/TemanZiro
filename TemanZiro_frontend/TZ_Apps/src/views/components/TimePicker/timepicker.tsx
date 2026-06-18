import React, { useEffect, useRef, useState } from "react";
import style from "./timepicker.module.css";
// Ganti dengan path icon jam kamu
import ClockIcon from "@/assets/icon/time.svg"; 

interface TimeSelectionProps {
  onTimeChange?: (data: { mode: string; startTime: string; endTime: string }) => void;
}

export default function TimeSelection({ onTimeChange }: TimeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<'standard' | 'fullday'>('standard');
  const [start, setStart] = useState({ h: 12, m: 0 });
  const [end, setEnd] = useState({ h: 14, m: 0 });
  const [activeField, setActiveField] = useState<'start' | 'end' | null>(null);

  const toTotalMinutes = (h: number, m: number) => h * 60 + m;
  const MIN_GAP = 120;

  const handleStartChange = (newH: number, newM: number) => {
    const newStartTotal = toTotalMinutes(newH, newM);
    const endTotal = toTotalMinutes(end.h, end.m);

    setStart({ h: newH, m: newM });

    if (newStartTotal + MIN_GAP > endTotal) {
      const adjustedEnd = newStartTotal + MIN_GAP;
      const finalEnd = Math.min(adjustedEnd, 1439);
      setEnd({
        h: Math.floor(finalEnd / 60),
        m: finalEnd % 60
      });
      }
    };

  const handleEndChange = (newH: number, newM: number) => {
    const newEndTotal = toTotalMinutes(newH, newM);
    const startTotal = toTotalMinutes(start.h, start.m);

    setEnd({ h: newH, m: newM });

    if (newEndTotal - MIN_GAP < startTotal) {
      const adjustedStart = Math.max(0, newEndTotal - MIN_GAP);
      setStart({
        h: Math.floor(adjustedStart / 60),
        m: adjustedStart % 60
      });
    }
  }

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  // Trigger onTimeChange ke Parent
  useEffect(() => {
    if (onTimeChange) {
      if (selectedMode === 'fullday') {
        onTimeChange({ mode: 'fullday', startTime: '00:00', endTime: '23:59' });
      } else {
        onTimeChange({
          mode: 'standard',
          startTime: `${formatTime(start.h)}:${formatTime(start.m)}`,
          endTime: `${formatTime(end.h)}:${formatTime(end.m)}`
        });
      }
    }
  }, [selectedMode, start, end]);

  // --- KOMPONEN SCROLL WHEEL INTERNAL ---
  const WheelColumn = ({ value, max, onChange, label }: { value: number, max: number, onChange: (val: number) => void, label?: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isProgrammatic = useRef(false);
    const isMounted = useRef(false);

    const ITEM_HEIGHT = 40; 
    const data = Array.from({ length: max }, (_, i) => i);

    useEffect(() => {
      if (!scrollRef.current) return;

      const targetTop = value * ITEM_HEIGHT;

      // 1. Initial Mount: Langsung ke posisi tanpa animasi
      if (!isMounted.current) {
        scrollRef.current.scrollTop = targetTop;
        isMounted.current = true;
        return;
      }

      // 2. KUNCI UTAMA: Cek selisih posisi scroll saat ini dengan target
      const currentTop = scrollRef.current.scrollTop;
      const diff = Math.abs(currentTop - targetTop);

      // Jika selisihnya kurang dari 5px, berarti posisi sudah benar (hasil scroll user).
      // JANGAN jalankan scrollTo agar tidak terjadi animasi balikan/lompatan.
      if (diff < diff) return;

      // 3. Jika selisih besar, berarti perubahan dari sistem (bukan jari user)
      isProgrammatic.current = true;
      scrollRef.current.scrollTo({ top: targetTop, behavior: 'smooth' });
      
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => { 
        isProgrammatic.current = false; 
      }, 500); 
    }, [value]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (isProgrammatic.current) return;
      const target = e.currentTarget;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const index = Math.round(target.scrollTop / ITEM_HEIGHT);
        if (index >= 0 && index < max && index !== value) {
          onChange(index);
        }
      }, 100); 
    };

    return (
      <div className={style.wheelCol}>
        <div className={style.wheelContainer} ref={scrollRef} onScroll={handleScroll}>
          <div className={style.padder}></div>
          {data.map((val) => (
            <div key={val} className={`${style.wheelItem} ${val === value ? style.wheelItemActive : ''}`}>
              {val.toString().padStart(2, '0')} {label && <span className={style.wheelLabel}>{label}</span>}
            </div>
          ))}
          <div className={style.padder}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={style.container}>
      <div className={style.mainHeader}>
        <img src={ClockIcon} alt="Clock" className={style.headerIcon} />
        <h2 className={style.mainTitle}>Pilih waktumu</h2>
      </div>

      {/* --- OPSI 1: STANDARD --- */}
      <div className={`${style.card} ${selectedMode === 'standard' ? style.cardActive : ''}`}>
        
        {/* Header Card Standard */}
        <div className={style.cardHeader} onClick={() => {
          setSelectedMode('standard');
          if (activeField === null) setActiveField('start');
        }}>
          <span className={style.cardTitle}>Standard (1 - 2 Jam)</span>
          <div className={style.radioIcon}>
            {selectedMode === 'standard' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#D77636"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            ) : <div className={style.radioUnchecked}></div>}
          </div>
        </div>

        {/* Konten Waktu Terbuka (Hanya jika Mode Standard) */}
        {selectedMode === 'standard' && (
          <div className={style.expandedContent}>
            
            {/* --- BAGIAN WAKTU MULAI --- */}
            <div 
              className={`${style.timeDisplayRow} ${activeField === 'start' ? style.rowActive : ''}`} 
              onClick={() => setActiveField(activeField === 'start' ? null : 'start')}
            >
              <div>
                <p className={style.timeLabel}>Waktu Mulai</p>
                <p className={style.timeSubLabel}>Waktu Dimulai</p>
              </div>
              <div className={style.timeBoxWrapper}>
                <div className={activeField === 'start' ? style.timeBoxActive : style.timeBoxInactive}>{formatTime(start.h)}</div>
                <span className={activeField === 'start' ? style.timeSeparator : style.timeSeparatorInactive}>:</span>
                <div className={activeField === 'start' ? style.timeBoxActive : style.timeBoxInactive}>{formatTime(start.m)}</div>
              </div>
            </div>

            {/* Picker untuk Waktu Mulai */}
            {activeField === 'start' && (
              <div className={style.pickerWrapper}>
                <div className={style.pickerHighlightBar}></div> {/* Garis Oranye di Tengah */}
                <WheelColumn value={start.h} max={24} onChange={(v) => handleStartChange(v, start.m)} />
                <span className={style.pickerSeparator}>:</span>
                <WheelColumn value={start.m} max={60} onChange={(v) => handleStartChange(start.h, v)} />
              </div>
            )}

            {/* --- BAGIAN WAKTU BERAKHIR --- */}
            <div 
              className={`${style.timeDisplayRow} ${activeField === 'end' ? style.rowActive : ''}`} 
              onClick={() => setActiveField(activeField === 'end' ? null : 'end')}
            >
              <div>
                <p className={style.timeLabel}>Waktu Berakhir</p>
                <p className={style.timeSubLabel}>Batas Waktu</p>
              </div>
              <div className={style.timeBoxWrapper}>
                <div className={activeField === 'end' ? style.timeBoxActive : style.timeBoxInactive}>{formatTime(end.h)}</div>
                <span className={activeField === 'end' ? style.timeSeparator : style.timeSeparatorInactive}>:</span>
                <div className={activeField === 'end' ? style.timeBoxActive : style.timeBoxInactive}>{formatTime(end.m)}</div>
              </div>
            </div>

            {/* Picker untuk Waktu Berakhir */}
            {activeField === 'end' && (
              <div className={style.pickerWrapper}>
                <div className={style.pickerHighlightBar}></div>
                <WheelColumn value={end.h} max={24} onChange={(v) => handleEndChange(v, end.m)} />
                <span className={style.pickerSeparator}>:</span>
                <WheelColumn value={end.m} max={60} onChange={(v) => handleEndChange(end.h, v)} />
              </div>
            )}

          </div>
        )}
      </div>

      {/* --- OPSI 2: FULL DAY --- */}
      <div className={`${style.card} ${selectedMode === 'fullday' ? style.cardActive : ''}`} onClick={() => {
        setSelectedMode('fullday');
        setActiveField(null); // Tutup picker jika ada yang terbuka
      }}>
        <div className={style.cardHeader}>
          <span className={style.cardTitle}>Full Day (24 Jam)</span>
          <div className={style.radioIcon}>
            {selectedMode === 'fullday' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#D77636"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            ) : <div className={style.radioUnchecked}></div>}
          </div>
        </div>
      </div>

    </div>
  );
}