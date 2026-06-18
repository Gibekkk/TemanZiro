import React from "react";
import style from "./badge.module.css";
import ImgBronze from "@/assets/image/Level/bronze.svg";
import ImgSilver from "@/assets/image/Level/silver.svg";
import ImgGold from "@/assets/image/Level/gold.svg";
import ImgPlatinum from "@/assets/image/Level/platinum.svg";

export type TierType = "bronze" | "silver" | "gold" | "platinum";

interface BadgeProps {
  tier: TierType | string;
  currentProgress?: number;
  maxProgress?: number;
  rewardsHref?: string;
  onRewardsClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const MEDAL_IMAGES: Record<TierType, string> = {
  bronze: ImgBronze,
  silver: ImgSilver,
  gold: ImgGold,
  platinum: ImgPlatinum,
};

const TIER_THEMES: Record<TierType, { cardBg: string; border: string; progressFill: string }> = {
  bronze: {
    cardBg: "#f8efea",
    border: "#f0dfd7",
    progressFill: "#d95d16",
  },
  silver: {
    cardBg: "#f1f5f9",
    border: "#e2e8f0",
    progressFill: "#64748b",
  },
  gold: {
    cardBg: "#fffbeb",
    border: "#fef3c7",
    progressFill: "#d97706",
  },
  platinum: {
    cardBg: "#f0fdfa",
    border: "#ccfbf1",
    progressFill: "#0d9488",
  },
};

export default function Badge({
  tier,
  currentProgress = 0,
  maxProgress = 9,
  rewardsHref = "#",
  onRewardsClick,
}: BadgeProps) {
  const lowerTier = tier.toLowerCase();
  const activeTier: TierType = (lowerTier === "silver" || lowerTier === "gold" || lowerTier === "platinum") 
    ? lowerTier 
    : "bronze";

  const medalSrc = MEDAL_IMAGES[activeTier];
  const tierName = activeTier.charAt(0).toUpperCase() + activeTier.slice(1);
  const theme = TIER_THEMES[activeTier];

  // Calculate percentage safely
  const percentage = maxProgress > 0 ? Math.min((currentProgress / maxProgress) * 100, 100) : 0;

  return (
    <div 
      className={style.tierCard} 
      style={{ 
        backgroundColor: theme.cardBg, 
        borderColor: theme.border 
      }}
    >
      <div className={style.tierHeader}>
        <div className={style.tierInfo}>
          <img src={medalSrc} alt={`${tierName} Tier Medal`} className={style.imgMedali} />
          <h3 className={style.tierName}>{tierName}</h3>
        </div>
        <a 
          href={rewardsHref} 
          onClick={onRewardsClick} 
          className={style.rewardsLink}
        >
          Rewards
        </a>
      </div>
      <div className={style.progressContainer}>
        <div className={style.progressBar}>
          <div
            className={style.progressFill}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: theme.progressFill
            }}
          ></div>
        </div>
        <span className={style.progressText}>{currentProgress} / {maxProgress}</span>
      </div>
    </div>
  );
}
