import { ReactNode } from "react";
import styles from "./datascreenlayout.module.css";
import back from "@/assets/icon/back.svg";
import { useNavigate } from "react-router-dom";

interface DataScreenLayoutProps {
  children: ReactNode;
  title: string;
  noShadow?: boolean;
  alignLeft?: boolean;
  rightProfile?: string;
  tabsComponent?: ReactNode;
  contentClassName?: string;
}

export default function DataScreenLayout({
  children,
  title,
  noShadow = false,
  alignLeft = false,
  rightProfile,
  tabsComponent,
  contentClassName = "",
}: DataScreenLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles.screen}>
      <header
        className={`
        ${styles.header}
        ${noShadow ? styles.noShadow : ""} 
        ${alignLeft ? styles.headerLeft : ""}
      `}
      >
        <div className={styles.secondHeader}>
          <img
            src={back}
            alt="Back"
            className={styles.backButton}
            onClick={handleBack}
          />
          <div className={styles.contentHeader}>
            <h4 className={styles.title}>{title}</h4>

            {/* Jika prop rightProfile diisi, tampilkan gambar profilnya */}
            {rightProfile && (
              <img
                src={rightProfile}
                alt="Profile"
                className={styles.profileIcon}
              />
            )}
          </div>
        </div>

        {tabsComponent && (
          <div className={styles.tabsWrapper}>{tabsComponent}</div>
        )}
      </header>

      <div className={`${styles.contentScreen} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
