import ImgBronze from "@/assets/image/Level/bronze.svg";
import ImgSilver from "@/assets/image/Level/silver.svg";
import ImgGold from "@/assets/image/Level/gold.svg";
import ImgPlatinum from "@/assets/image/Level/platinum.svg";
import ZiroBronze from "@/assets/image/Level/ziro-bronze.svg";
import ZiroSilver from "@/assets/image/Level/ziro-silver.svg";
import ZiroGold from "@/assets/image/Level/ziro-gold.svg";
import ZiroPlatinum from "@/assets/image/Level/ziro-platinum.svg";

export type TierType = {
  id: string;
  name: string;
  minPoints: number;
  medal: React.ElementType;
  mascotMedal: React.ElementType;
};

export const BADGES: TierType[] = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 25,
    medal: ImgBronze,
    mascotMedal: ZiroBronze,
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 100,
    medal: ImgSilver,
    mascotMedal: ZiroSilver,
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 500,
    medal: ImgGold,
    mascotMedal: ZiroGold,
  },
  {
    id: "platinum",
    name: "Platinum",
    minPoints: 1000,
    medal: ImgPlatinum,
    mascotMedal: ZiroPlatinum,
  },
];

export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";