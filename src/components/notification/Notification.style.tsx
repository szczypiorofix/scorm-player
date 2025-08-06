import styled from 'styled-components';

const NotificationStyled = styled.div`
    padding-top: 0.67em;
    padding-bottom: 0.67em;
    text-align: center;
    display: flex;
    justify-content: center;
    p {
        padding: 12px 36px;
        font-size: 18px;
        font-weight: 400;
    }
`;

const NotificationParagraphInfoStyled = styled.p`
    color: black;
    background-color: white;
`;

const NotificationParagraphWarnStyled = styled.p`
    color: black;
    background-color: yellow;
`;

const NotificationParagraphErrorStyled = styled.p`
    color: white;
    background-color: rgba(190, 10, 10, 0.95);
`;

export {
    NotificationStyled,
    NotificationParagraphInfoStyled,
    NotificationParagraphWarnStyled,
    NotificationParagraphErrorStyled
};
