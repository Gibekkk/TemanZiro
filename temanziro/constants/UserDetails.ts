export const GENDER = {
    PRIA: "pria",
    WANITA: "wanita",
    RAHASIA: "rahasia",
} as const;

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