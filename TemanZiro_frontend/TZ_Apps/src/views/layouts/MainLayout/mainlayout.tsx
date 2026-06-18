import React from "react";
import style from "./mainlayout.module.css";
import { useAuth } from "@/controllers/hooks/useAuth";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import IconWallet from "@/assets/icon/money.svg";
import MoneyButton from "@/views/components/MoneyButton/moneybutton";

interface MainLayoutProps {
  title: string;
  titleColor?: string;
  searchBar?: React.ReactNode;
  children: React.ReactNode;
  hideHeaderShadow?: boolean;
  hideProfileImage?: boolean;
}

export default function MainLayout({
  title,
  titleColor,
  searchBar,
  children,
  hideHeaderShadow = false,
  hideProfileImage = false,
}: MainLayoutProps) {
  const { userProfile, role, loading } = useAuth();
  const profileImage = (role === "companion" ? userProfile?.url_photoprofile_companion : userProfile?.url_photoprofile_user) || IMGMiniZiro;
  return (
    <div className={style.screen}>
      <header
        className={style.header}
        style={{
          boxShadow: hideHeaderShadow ? "none" : undefined,
          borderBottom: hideHeaderShadow ? "none" : undefined,
        }}
      >
        <div className={style.headerTop}>
          <h4
            className={style.title}
            style={{ color: titleColor || "inherit" }}
          >
            {title}
          </h4>

          <div className={style.headerActions}>
            
            {/* Button Money */}
            <MoneyButton />

            {/* Profile Image */}
            {!hideProfileImage && (
              <img
                src={loading ? IMGMiniZiro : profileImage}
                alt={
                  role === "companion"
                    ? userProfile?.name_companion
                    : userProfile?.name_user
                }
                className={style.profileImage}
                onClick={() => {
                  if (role === "companion") {
                    window.location.href = "/profile-companion";
                  } else {
                    window.location.href = "/profile";
                  }
                }}
                onError={(event) => {
                  event.currentTarget.src = IMGMiniZiro;
                }}
              />
            )}
          </div>
        </div>

        {searchBar && <div className={style.searchBarWrapper}>{searchBar}</div>}
      </header>

      <main className={style.mainContent}>{children}</main>
    </div>
  );
}
