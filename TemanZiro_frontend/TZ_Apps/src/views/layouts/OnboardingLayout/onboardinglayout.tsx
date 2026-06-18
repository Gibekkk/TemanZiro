import { ReactNode } from "react";
import styles from "./onboardinglayout.module.css";
import iconthreepeople from "@/assets/icon/icon-threepeople.svg";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Teman<span>Ziro</span></h1>
      <div className={styles.container}>
        <div className={styles.tag}>
          <img src={iconthreepeople} alt="Three People Icon" />
          <h5 className={styles.tagText}>KOMUNITAS DIUTAMAKAN</h5>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
