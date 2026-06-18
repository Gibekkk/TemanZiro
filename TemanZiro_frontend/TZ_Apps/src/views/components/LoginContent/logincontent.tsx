import { ReactNode, useEffect } from "react";
import styles from "./logincontent.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";
import LogoLogin1 from "@/assets/icon/logo-login1.svg";
import LogoLogin2 from "@/assets/icon/logo-login2.svg";
import LogoLogin3 from "@/assets/icon/logo-login3.svg";

interface LoginContentProps {
  image1: string;
  image2: string;
  title: ReactNode;
  description: ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

export default function LoginContent({
  image1,
  image2,
  title,
  description,
  buttonText,
  onButtonClick,
}: LoginContentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <div className={styles.ziro}>
          <img src={image1} alt="Ziro" className={styles.imageZiro1} />
          <img src={image2} alt="Ziro" className={styles.imageZiro2} />
        </div>
      </div>

      <h2 className={styles.subTitle}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Button
        onClick={onButtonClick}
        variant="primary"
        className={styles.button}
      >
        {buttonText}
      </Button>
    </div>
  );
}
