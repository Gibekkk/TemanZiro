import styles from "./reviewcard.module.css";
import IconStarYellow from "@/assets/icon/staryellow.svg";

export interface ReviewData {
  avatar: string;
  name: string;
  rating: number;
  text: string;
}

export default function ReviewCard({ avatar, name, rating, text }: ReviewData) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewerInfo}>
          <img src={avatar} alt={name} className={styles.reviewerAvatar} />
          <span className={styles.reviewerName}>{name}</span>
        </div>
        <div className={styles.reviewRating}>
          <img src={IconStarYellow} alt="" />
          <span>{rating}</span>
        </div>
      </div>
      <p className={styles.reviewText}>{text}</p>
    </div>
  );
}