import styled from 'styled-components';

const NotificationStyled = styled.div`
    padding-top: 0.67em;
    padding-bottom: 0.67em;
    text-align: center;
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
    color: black;
    background-color: red;
`;

export {
    NotificationStyled,
    NotificationParagraphInfoStyled,
    NotificationParagraphWarnStyled,
    NotificationParagraphErrorStyled
};
