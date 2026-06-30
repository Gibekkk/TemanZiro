import IconMale from "@/assets/icon/maleoff.svg";
import IconFemale from "@/assets/icon/femaleoff.svg";
import IconSecret from "@/assets/icon/rahasiaoff.svg";

export const GENDER = {
    PRIA: "pria",
    WANITA: "wanita",
    RAHASIA: "rahasia",
} as const;

export const GENDER_DETAILS = {
    [GENDER.PRIA]: {
        label: "Pria",
        icon: IconMale,
    },
    [GENDER.WANITA]: {
        label: "Wanita",
        icon: IconFemale,
    },
    [GENDER.RAHASIA]: {
        label: "Rahasia",
        icon: IconSecret,
    },
} as const;


export const GENDER_ICON = {
    [GENDER.PRIA]: {
        label: "Pria",
        iconOn: require("@/assets/icon/maleon.svg"),
        iconOff: require("@/assets/icon/maleoff.svg"),
    },
    [GENDER.WANITA]: {
        label: "Wanita",
        iconOn: require("@/assets/icon/femaleon.svg"),
        iconOff: require("@/assets/icon/femaleoff.svg"),
    },
    [GENDER.RAHASIA]: {
        label: "Rahasia",
        iconOn: require("@/assets/icon/rahasiaon.svg"),
        iconOff: require("@/assets/icon/rahasiaoff.svg"),
    }
};

export const USER_ROLE = {
    ADMIN: "admin",
    COMPANION: "companion",
    BOOKER: "booker",
} as const;

export const VERIFIED_STATUS = {
    VERIFIED: "verified",
    UNVERIFIED: "unverified",
    PENDING: "pending",
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
export type VerifiedStatus = typeof VERIFIED_STATUS[keyof typeof VERIFIED_STATUS];

export type KycDocumentType = 'ktp' | 'selfie_ktp';