import styled from 'styled-components';

export const ScormPlayer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StatusInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    padding-bottom: 12px;
`;

export const StatusGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const StatusKey = styled.p`
    min-width: 180px;
    margin: 0;
`;

export const StatusValue = styled.p`
    min-width: 100px;
    margin: 0;
`

export const IframeContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const Iframe = styled.iframe`
    width: calc(100% - 4px);
    height: 100vh;
`;
