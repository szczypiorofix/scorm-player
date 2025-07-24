import React, { useState, useEffect, useRef } from 'react';

import type { IScormPlayerProps, IScormState } from "../../types";
import { createScormApi } from "../../utils/ScormAPI";
import * as SP from "./ScormPlayer.style";
import { StatusGroup } from "./StatusGroup";
import {LESSON_COMPLETION_STATUS, SCORM_API_CONSTANTS} from "../../shared/constants";

const ScormPlayer: React.FC<IScormPlayerProps> = ({ scormFilePath }) => {
    const [scormState, setScormState] = useState<IScormState>({
        [SCORM_API_CONSTANTS.LESSON_STATUS]: LESSON_COMPLETION_STATUS.NOT_STARTED,
        [SCORM_API_CONSTANTS.SCORE_RAW]: '0',
        [SCORM_API_CONSTANTS.IS_INITIALIZED]: false,
        [SCORM_API_CONSTANTS.SESSION_TIME]: '0',
        [SCORM_API_CONSTANTS.STUDENT_NAME]: 'Todd',
    });

    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (!scormFilePath) return;

        console.log("Setting up SCORM environment for:", scormFilePath);

        const handleStateChange = (key: keyof IScormState, value: unknown) => {
            console.log(`React State Update: ${key} ->`, value);
            setScormState(prevState => ({ ...prevState, [key]: value }));
        };

        const scormApi = createScormApi(
            handleStateChange,
            undefined,
            () => { console.log('Progress saved.') }
        );
        window.API = scormApi;
        window.API_1484_11 = scormApi;

        console.log("SCORM API created and attached to window.");

        return () => {
            console.log("Cleaning up SCORM environment for:", scormFilePath);

            if (window.API?.LMSGetValue(SCORM_API_CONSTANTS.IS_INITIALIZED) === 'true') {
                window.API.LMSFinish("");
            }
            if (window.API_1484_11?.LMSGetValue(SCORM_API_CONSTANTS.IS_INITIALIZED) === 'true') {
                window.API_1484_11.LMSFinish("");
            }

            delete window.API;
            delete window.API_1484_11;
            console.log("SCORM API cleaned up.");
        };
    }, [scormFilePath]);

    return (
        <SP.ScormPlayer>
            <SP.StatusInfo>
                <StatusGroup title={"Uczestnik"} value={scormState[SCORM_API_CONSTANTS.STUDENT_NAME]}/>
                <StatusGroup title={"Status Inicjalizacji"} value={scormState.isInitialized ? 'Aktywne' : 'Nieaktywne'}/>
                <StatusGroup title={"Status Ukończenia"} value={scormState[SCORM_API_CONSTANTS.LESSON_STATUS]}/>
                <StatusGroup title={"Wynik"} value={scormState[SCORM_API_CONSTANTS.SCORE_RAW]+"%"}/>
                <StatusGroup title={"Czas sesji"} value={scormState[SCORM_API_CONSTANTS.SESSION_TIME]}/>
            </SP.StatusInfo>
            <SP.IframeContainer>
                {scormFilePath && (
                    <SP.Iframe
                        ref={iframeRef}
                        src={scormFilePath}
                        title="SCORM Content Player"
                        allowFullScreen
                    ></SP.Iframe>
                )}
            </SP.IframeContainer>
        </SP.ScormPlayer>
    );
};

export default ScormPlayer;
