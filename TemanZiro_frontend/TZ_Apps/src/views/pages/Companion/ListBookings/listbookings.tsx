import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import style from "./listbookings.module.css";
import ScheduleCard from "@/views/components/ScheduledCard/scheduledcard";
import { useState } from "react";

export default function ListBookingsPage() {
  const [activeTab, setActiveTab] = useState("Menunggu");

  const tabs = ["Menunggu", "Konfirmasi", "Berlangsung", "Selesai", "Batal"];

  const allSchedules = [
    {
      id: 1,
      status: "Menunggu",
      name: "Tiara",
      age: 21,
      location: "Central Park Mall",
      date: "20 Apr 2027",
      time: "2.00 PM",
      badgeText: "MENUNGGU",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 2,
      status: "Menunggu",
      name: "Andi",
      age: 24,
      location: "Senayan City",
      date: "22 Apr 2027",
      time: "4.00 PM",
      badgeText: "MENUNGGU",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 3,
      status: "Konfirmasi",
      name: "Siska",
      age: 22,
      location: "Grand Indonesia",
      date: "25 Apr 2027",
      time: "1.00 PM",
      badgeText: "DIKONFIRMASI",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: 4,
      status: "Berlangsung",
      name: "Budi",
      age: 25,
      location: "Cafe Senja",
      date: "19 Apr 2027",
      time: "10.00 AM",
      badgeText: "SEKARANG",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 5,
      status: "Batal",
      name: "Rina",
      age: 23,
      location: "Plaza Senayan",
      date: "18 Apr 2027",
      time: "3.00 PM",
      badgeText: "DIBATALKAN",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  ];

  const filteredSchedules = allSchedules
    .filter((schedule) => schedule.status === activeTab)
    .slice(0, 1);

  const dummyProfileImage = "https://i.pravatar.cc/150?img=5";

  const myTabs = (
    <div className={style.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${style.tab} ${activeTab === tab ? style.tabActive : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
  return (
    <DataScreenLayout
      title="Pemesanan"
      rightProfile={dummyProfileImage}
      alignLeft = {true}
      tabsComponent={myTabs}
      contentClassName={style.customPadding}
    >
      <div className={style.sectionHeader}>
        <h2 className={style.sectionTitle}>Jadwal Kamu</h2>
      </div>

      <div className={style.scheduleListContainer}>
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))
        ) : (
          <div className={style.emptyState}>
            Belum ada jadwal untuk status ini.
          </div>
        )}
      </div>
    </DataScreenLayout>
  );
}
