import React from "react";

import { StatusGroup as StatusGroupStyled, StatusKey, StatusValue } from "./ScormPlayer.style";

export interface StatusGroupProps {
    title: string;
    value: string;
}

export function StatusGroup(props: StatusGroupProps): React.JSX.Element {
    return  <StatusGroupStyled>
        <StatusKey>{props.title}</StatusKey>
        <StatusValue>{props.value}</StatusValue>
    </StatusGroupStyled>
}
