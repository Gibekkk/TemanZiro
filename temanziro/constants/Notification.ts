export const NOTIFICATION_TYPE = {
    MATCH_REQUEST: "match_request",
    WITHDRAWAL_REQUEST: "withdrawal_request",
} as const;

export const NOTIFICATION_STATUS = {
    UNREAD: "false",
    READ: "true",
}

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];