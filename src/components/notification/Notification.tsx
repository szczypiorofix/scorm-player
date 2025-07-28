import React from "react";

import {
    NotificationParagraphInfoStyled,
    NotificationParagraphWarnStyled,
    NotificationStyled
} from "./Notification.style";
import type { NotificationType } from "../../shared/NotificationType";

export interface NotificationProps {
    message: string;
    type: NotificationType;
}

export function Notification(props: NotificationProps): React.JSX.Element {
    const notificationSelector = (message: string, type: NotificationType) => {
        switch(type) {
            case 0:
                return <NotificationParagraphInfoStyled>{message}</NotificationParagraphInfoStyled>;
            case 1:
                return <NotificationParagraphWarnStyled>{message}</NotificationParagraphWarnStyled>;
            default:
                return <NotificationParagraphInfoStyled>{message}</NotificationParagraphInfoStyled>;
        }
    }
    return <NotificationStyled>
        { notificationSelector(props.message, props.type) }
    </NotificationStyled>
}
