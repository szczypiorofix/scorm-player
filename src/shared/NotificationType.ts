export const NotificationType = {
    INFO: 0,
    WARN: 1,
    ERROR: 2
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
