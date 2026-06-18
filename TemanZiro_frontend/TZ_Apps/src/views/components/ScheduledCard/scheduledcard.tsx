import React from 'react';
import style from './scheduledcard.module.css';
import IconLocation from '@/assets/icon/location-primary.svg';
import IconDate from '@/assets/icon/date-primary.svg';
import IconTime from '@/assets/icon/time-primary.svg';
import IMGMiniZiro from '@/assets/image/mini-ziro.svg';

interface LocationData {
  address: string;
  lat?: number;
  lng?: number;
}

interface ScheduleData {
  id?: number | string;
  status: string;
  name: string;
  age: number | string;
  location: string | LocationData;
  date: string;
  time: string;
  badgeText: string;
  avatar: string;
}

interface ScheduleCardProps {
  schedule: ScheduleData;
  onClick?: () => void;
}

export default function ScheduleCard({ schedule, onClick }: ScheduleCardProps) {
  const badgeColor = schedule.status === "Batal" ? "#e53e3e" : "var(--primary-color)";

  // Handle location: dapat berupa string atau object
  const locationDisplay = typeof schedule.location === "string"
    ? schedule.location
    : (schedule.location as LocationData).address || "Belum ditentukan";

  return (
    <div
      className={style.scheduleCard}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div
        className={style.badge}
        style={{ backgroundColor: badgeColor }}
      >
        {schedule.badgeText}
      </div>

      <div className={style.avatarSmall}>
        {schedule.status === "online" &&
          <div className={style.onlineDotSmall}></div>
        }
        <img
          src={schedule.avatar || IMGMiniZiro}
          alt={schedule.name}
          className={style.avatarSmallImage}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMGMiniZiro; }}
        />
      </div>

      <div className={style.scheduleInfo}>
        <h3 className={style.scheduleName}>
          {schedule.name}, {schedule.age}
        </h3>

        <div className={style.infoRow}>
          <img src={IconLocation} alt="Location" className={style.icon} />
          {locationDisplay}
        </div>

        <div className={style.dateTimeRow}>
          <div className={style.infoRow}>
            <img src={IconDate} alt="Date" className={style.icon} />
            {schedule.date}
          </div>
          <div className={style.infoRow}>
            <img src={IconTime} alt="Time" className={style.icon} />
            {schedule.time}
          </div>
        </div>
      </div>
    </div>
  );
}