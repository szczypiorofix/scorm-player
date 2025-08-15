import React from "react";

import {
    NotificationParagraphInfoStyled,
    NotificationParagraphWarnStyled,
    NotificationParagraphErrorStyled,
    NotificationStyled
} from "./Notification.style";

export const NotificationType = {
    INFO: 0,
    WARN: 1,
    ERROR: 2
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationProps {
    message: string;
    type: NotificationType;
}

export function Notification(props: NotificationProps): React.JSX.Element {
    const notificationSelector = (message: string, type: NotificationType) => {
        switch(type) {
            case NotificationType.WARN:
                return <NotificationParagraphWarnStyled>{message}</NotificationParagraphWarnStyled>;
            case NotificationType.ERROR:
                return <NotificationParagraphErrorStyled>{message}</NotificationParagraphErrorStyled>;
            default:
                return <NotificationParagraphInfoStyled>{message}</NotificationParagraphInfoStyled>;
        }
    }
    return <NotificationStyled>
        { notificationSelector(props.message, props.type) }
    </NotificationStyled>
}
