export const TOPUP_STATUS = {
    MENUNGGU: "menunggu",
    BERHASIL: "berhasil",
    DITOLAK: "ditolak",
} as const;

export const WITHDRAW_STATUS = {
    MENUNGGU: "menunggu",
    BERHASIL: "berhasil",
    DITOLAK: "ditolak",
} as const;

export const BANK_NAME = {
    BCA: "BCA",
    BRI: "BRI",
    MANDIRI: "Mandiri",
    BNI: "BNI",
} as const;

export type TopUpStatus = typeof TOPUP_STATUS[keyof typeof TOPUP_STATUS];
export type WithdrawStatus = typeof WITHDRAW_STATUS[keyof typeof WITHDRAW_STATUS];
export type BankName = typeof BANK_NAME[keyof typeof BANK_NAME];