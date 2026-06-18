import { useRef, useState } from "react";
import style from "./temanjalan_page.module.css";
import MainLayout from "@/views/layouts/MainLayout/mainlayout";
import FeaturedCard from "@/views/components/FeaturedCard/featuredcard";
import ScheduleCard from "@/views/components/ScheduledCard/scheduledcard";
import IconArrowRight from "@/assets/icon/arrowright.svg";

interface TemanJalanLayoutProps {
  title?: string;
}

export default function TemanJalanCompanionPage({
  title = "Teman Jalan",
}: TemanJalanLayoutProps) {
  // const { currentUser, userProfile, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("Mencari");

  const tabs = ["Mencari", "Konfirmasi", "Berlangsung", "Selesai", "Batal"];

  const allSchedules = [
    {
      id: 1,
      status: "Mencari",
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
      status: "Mencari",
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
      status: "Confirmed",
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

  const featuredDataList = [
    {
      id: 1,
      status: "Mencari",
      name: "Tiara",
      age: 21,
      location: "Central Park Mall",
      date: "20 Apr 2027",
      time: "2.00 PM",
      notes: "Aku tipe orang yang benar-benar menikmati...",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 2,
      status: "Konfirmasi",
      name: "Siska",
      age: 22,
      location: "Grand Indonesia",
      date: "25 Apr 2027",
      time: "1.00 PM",
      notes: "Suka ngopi dan bahas startup.",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: 3,
      status: "Berlangsung",
      name: "Budi",
      age: 25,
      location: "Senayan City",
      date: "26 Apr 2027",
      time: "4.00 PM",
      notes: "Cari teman main badminton sore.",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 4,
      status: "Selesai",
      name: "Budi",
      age: 25,
      location: "Senayan City",
      date: "26 Apr 2027",
      time: "4.00 PM",
      notes: "Cari teman main badminton sore.",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.clientWidth;

      const currentIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(currentIndex);
    }
  };

  return (
    <MainLayout title={title} titleColor="var(--text-primary)" hideHeaderShadow>
      <div className={style.carouselContainer}>
        <div
          className={style.cardsWrapper}
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {featuredDataList.map((data) => {
            const canChat = data.status === "Konfirmasi" || data.status === "Berlangsung";

            return (
              <div className={style.cardSlide} key={data.id}>
                <FeaturedCard
                  userData={data}
                  onChatClick={canChat ? () => console.log("Chat", data.name) : undefined}
                  isChatDisabled={!canChat}
                  isCheckInDisabled={!canChat}
                  checkInMode="qr"
                  checkInPayload={String(data.id)}
                />
              </div>
            );
          })}
        </div>

        <div className={style.paginationWindow}>
          <div
            className={style.paginationTrack}
            style={{
              transform: `translateX(-${
                Math.max(
                  0,
                  Math.min(activeIndex - 1, featuredDataList.length - 3),
                ) * 14
              }px)`,
            }}
          >
            {featuredDataList.map((_, index) => (
              <div
                key={index}
                className={`${style.dot} ${activeIndex === index ? style.dotActive : ""}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* --- BOTTOM SHEET (TABS & LIST) --- */}
      <div className={style.bottomSheet}>
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

        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>Jadwal Kamu</h2>
          <a href="#" className={style.viewAll}>
            View all
            <img src={IconArrowRight} alt="Arrow Right" />
          </a>
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
      </div>
    </MainLayout>
  );
}
