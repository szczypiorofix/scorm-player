import React from "react";
import { StatusGroup as StatusGroupStyled } from "./ScormPlayer.style";

export interface StatusGroupProps {
    title: string;
    value: string;
}

export function StatusGroup(props: StatusGroupProps): React.JSX.Element {
    return  <StatusGroupStyled>
        <h3>{props.title}</h3>
        <p>{props.value}</p>
    </StatusGroupStyled>
}
