import bronzeBadge from "@/assets/tier/bronze.svg";
import silverBadge from "@/assets/tier/silver.svg";
import goldBadge from "@/assets/tier/gold.svg";
import platinumBadge from "@/assets/tier/platinum.svg";
import bronzeMascot from "@/assets/tier/ziro-bronze.svg";
import silverMascot from "@/assets/tier/ziro-silver.svg";
import goldMascot from "@/assets/tier/ziro-gold.svg";
import platinumMascot from "@/assets/tier/ziro-platinum.svg";

export type TierType = {
    name: string;
    value: string;
    minPoints: number;
    badgeImg: any;
    mascotImg: any;
}

export const TIERS = {
    bronze: { name: "Bronze", value: "bronze", minPoints: 25, badgeImg: bronzeBadge, mascotImg: bronzeMascot },
    silver: { name: "Silver", value: "silver", minPoints: 100, badgeImg: silverBadge, mascotImg: silverMascot },
    gold: { name: "Gold", value: "gold", minPoints: 500, badgeImg: goldBadge, mascotImg: goldMascot },
    platinum: { name: "Platinum", value: "platinum", minPoints: 1000, badgeImg: platinumBadge, mascotImg: platinumMascot }
} as const satisfies Record<string, TierType>;

export type Tier = typeof TIERS[keyof typeof TIERS]["value"];
export type StarRating = 1 | 2 | 3 | 4 | 5;

export const FEELING_OPTIONS: Record<StarRating, readonly string[]> = {
    1: ["Dissapointed", "Ignored", "Uncomfortable", "Unpleasant"],
    2: ["Unhelpful", "Rushed", "Misunderstood", "Unfriendly"],
    3: ["Average", "Met Expectations", "Neutral"],
    4: ["Safe", "Calm", "Heard", "Respected", "Helpful"],
    5: ["Safe", "Trusted", "Inspired", "Empowered", "Valued", "Respected", "Very Satisfied"],
} as const;

export const TIER_TYPE_VALUES = Object.values(TIERS).map((tier) => tier.value);