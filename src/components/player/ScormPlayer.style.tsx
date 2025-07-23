import styled from 'styled-components';

export const ScormPlayer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StatusInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StatusGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    h3 {
        min-width: 220px;
    }
`;

export const IframeContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const Iframe = styled.iframe`
    width: calc(100% - 4px);
    height: 100vh;
`;
