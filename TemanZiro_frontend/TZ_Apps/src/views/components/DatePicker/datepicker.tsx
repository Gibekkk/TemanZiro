import { useState } from "react";
import style from "./datepicker.module.css";
import CalendarIcon from "@/assets/icon/date.svg";

interface DateInfo {
  date: string; // Format: YYYY-MM-DD
  day: string;  // Nama hari: Monday, Tuesday, etc
}

interface DatePickerProps {
  onRangeSelect?: (startDate: DateInfo | null, endDate: DateInfo | null) => void;
}

type ViewMode = 'day' | 'month' | 'year';

export default function DatePicker({ onRangeSelect }: DatePickerProps) {
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateWithDay = (date: Date | null): DateInfo | null => {
    if (!date) return null;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      date: formatDate(date),
      day: dayNames[date.getDay()]
    };
  };

  const [viewDate, setViewDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('day');

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];

  const handleDateClick = (clickedDate: Date) => {
    const clicked = new Date(clickedDate);
    clicked.setHours(0, 0, 0, 0);

    if (clicked < today) return;
    if (startDate && endDate) {
      setStartDate(clickedDate);
      setEndDate(null);
      if (onRangeSelect) onRangeSelect(formatDateWithDay(clickedDate), null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
        if (onRangeSelect) onRangeSelect(formatDateWithDay(clickedDate), formatDateWithDay(startDate));
      } else {
        setEndDate(clickedDate);
        if (onRangeSelect) onRangeSelect(formatDateWithDay(startDate), formatDateWithDay(clickedDate));
      }
    } else {
      setStartDate(clickedDate);
      setEndDate(null);
      if (onRangeSelect) onRangeSelect(formatDateWithDay(clickedDate), null);
    }
  };

  const handlePrevNext = (direction: -1 | 1) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    if (viewMode === 'day') {
      setViewDate(new Date(year, month + direction, 1));
    } else if (viewMode === 'month') {
      setViewDate(new Date(year + direction, month, 1));
    } else if (viewMode === 'year') {
      setViewDate(new Date(year + (direction * 12), month, 1));
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; 
    const daysInMonth = lastDay.getDate();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const getYears = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10 - 1; 
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <img src={CalendarIcon} alt="Calendar" className={style.headerIcon} />
        <h3 className={style.headerTitle}>Pilih Tanggal & Hari</h3>
      </div>

      <div className={style.card}>
        <div className={style.nav}>
          <button className={style.navBtn} onClick={() => handlePrevNext(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className={style.selectors}>
            <button 
              className={`${style.modeSelector} ${viewMode === 'month' ? style.activeMode : ''}`}
              onClick={() => setViewMode(viewMode === 'month' ? 'day' : 'month')}
            >
              {monthNames[viewDate.getMonth()]} <span className={style.arrow}>▼</span>
            </button>

            <button 
              className={`${style.modeSelector} ${viewMode === 'year' ? style.activeMode : ''}`}
              onClick={() => setViewMode(viewMode === 'year' ? 'day' : 'year')}
            >
              {viewDate.getFullYear()} <span className={style.arrow}>▼</span>
            </button>
          </div>

          <button className={style.navBtn} onClick={() => handlePrevNext(1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {viewMode === 'day' && (
          <>
            <div className={style.gridDayName}>
              {daysOfWeek.map(day => <div key={day} className={style.dayText}>{day}</div>)}
            </div>
            <div className={style.gridDays}>
              {getCalendarDays().map((item, index) => {
                const dateObj = item.date;
                dateObj.setHours(0,0,0,0);
                const isToday = isSameDay(dateObj, today);
                const isStart = startDate ? isSameDay(dateObj, startDate) : false;
                const isEnd = endDate ? isSameDay(dateObj, endDate) : false;
                const isInRange = startDate && endDate && dateObj > startDate && dateObj < endDate;
                
                let dayClasses = style.dayCell;
                if (!item.isCurrentMonth) dayClasses += ` ${style.otherMonth}`;
                if (isToday && !isStart && !isEnd) dayClasses += ` ${style.today}`;
                if (isStart || isEnd) dayClasses += ` ${style.selected}`;
                if (isInRange) dayClasses += ` ${style.inRange}`;

                return (
                  <button key={index} onClick={() => handleDateClick(dateObj)} className={dayClasses}>
                    {dateObj.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === 'month' && (
          <div className={style.gridList}>
            {monthNames.map((m, index) => (
              <button 
                key={m} 
                className={`${style.listCell} ${viewDate.getMonth() === index ? style.selected : ''}`}
                onClick={() => {
                  setViewDate(new Date(viewDate.getFullYear(), index, 1));
                  setViewMode('day'); 
                }}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {viewMode === 'year' && (
          <div className={style.gridList}>
            {getYears().map(year => (
              <button 
                key={year} 
                className={`${style.listCell} ${viewDate.getFullYear() === year ? style.selected : ''}`}
                onClick={() => {
                  setViewDate(new Date(year, viewDate.getMonth(), 1));
                  setViewMode('month');
                }}
              >
                {year}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}