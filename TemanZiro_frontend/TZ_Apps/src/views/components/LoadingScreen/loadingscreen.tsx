import { useEffect } from "react";
import { useLottie } from "lottie-react";
import ziroAnimationData from "@/assets/animations/TemanZiro_LoadingScreenv1.json";
import styles from './loadingscreen.module.css';
import bgLoadScreen from "@/assets/image/bg-loadscreen.svg";

export default function LoadingScreen() {
  const { View, animationItem } = useLottie({
    animationData: ziroAnimationData,
    loop: false,
    autoplay: false,
  });

  useEffect(() => {
    if (!animationItem) return;

    animationItem.playSegments([0, 150], true);

    const handleComplete = () => {
      animationItem.playSegments([46, 150], true);
      animationItem.loop = true;
    };

    animationItem.addEventListener("complete", handleComplete);

    return () => {
      animationItem.removeEventListener("complete", handleComplete);
    };
  }, [animationItem]);

  return (
    <div className={styles.bgScreen}>
      <div className={styles.lottieWrapper}>{View}</div>
      <img src={bgLoadScreen} alt="background" />
    </div>
  );
}
