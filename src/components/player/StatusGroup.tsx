import React from "react";

import { StatusGroup as StatusGroupStyled, StatusKey, StatusValue } from "./ScormPlayer.style";

export interface StatusGroupProps {
    title: string;
    value: number| string | symbol;
}

export function StatusGroup(props: StatusGroupProps): React.JSX.Element {
    return  <StatusGroupStyled>
        <StatusKey>{props.title}</StatusKey>
        <StatusValue>{props.value.toString()}</StatusValue>
    </StatusGroupStyled>
}
