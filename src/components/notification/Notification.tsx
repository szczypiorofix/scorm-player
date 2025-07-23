import React from "react";
import { NotificationStyled } from "./Notification.style";
import type { NotificationType } from "../../shared/NotificationType";

export interface NotificationProps {
    message: string;
    type: NotificationType;
}

export function Notification(props: NotificationProps): React.JSX.Element {
    return <NotificationStyled>
        <p>{props.message}</p>
    </NotificationStyled>
}
