import { ReactNode, useEffect } from "react";
import styles from "./onboarding.module.css";
import Button from "@/views/components/OrangeButton/orangebutton";

interface OnboardingProps {
  image: string;
  title: ReactNode;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function OnboardingContent({
  image,
  title,
  description,
  buttonText,
  onButtonClick,
}: OnboardingProps) {
  return (
    <>
      <div className={styles.imageWrapper}>
        <img src={image} alt="Ziro" className={styles.imageZiro} />
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
    </>
  );
}
