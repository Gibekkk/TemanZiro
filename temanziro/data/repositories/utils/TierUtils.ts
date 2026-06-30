import { BadgeTier } from "@/constants/TierDetails";

export interface TierProgress {
  tier: BadgeTier;
  currentProgress: number;
  maxProgress: number;
}

export function calculateTierProgress(bookingCount: number): TierProgress {
  if (bookingCount >= 1000) {
    return {
      tier: "platinum",
      currentProgress: bookingCount,
      maxProgress: 1000,
    };
  } else if (bookingCount >= 500) {
    return {
      tier: "gold",
      currentProgress: bookingCount,
      maxProgress: 1000,
    };
  } else if (bookingCount >= 100) {
    return {
      tier: "silver",
      currentProgress: bookingCount,
      maxProgress: 500,
    };
  } else if (bookingCount >= 25) {
    return {
      tier: "bronze",
      currentProgress: bookingCount,
      maxProgress: 100,
    };
  } else {
    return {
      tier: "bronze",
      currentProgress: bookingCount,
      maxProgress: 25,
    };
  }
}
