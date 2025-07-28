import React, { useState, useEffect, useRef } from 'react';

import type { IScormPlayerProps, IScormState } from "../../shared/types";
import { createScormApi } from "../../utils/ScormAPI";
import * as SP from "./ScormPlayer.style";
import { StatusGroup } from "./StatusGroup";
import {LESSON_COMPLETION_STATUS, SCORM_API_CONSTANTS} from "../../shared/constants";

export const COURSE_ID = '1';

function saveDataToBackend(userId: string, courseId: string, scormData: unknown) {
    const url = `http://localhost:3000/api/progress/${userId}/${courseId}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(scormData),
        })
        .then(response => response.json())
        .then(data => console.log('Sukces:', data))
        .catch((error) => console.error('Błąd:', error));
}

async function loadDataFromBackend(userId: string, courseId: string) {
    const url = `http://localhost:3000/api/progress/${userId}/${courseId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.log("Brak wcześniejszego postępu, startujemy od zera.");
                return null;
            }
            throw new Error('Błąd sieci lub serwera');
        }
        const data = await response.json();
        console.log('Pobrano dane:', data);
        return data;
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        return null;
    }
}

const ScormPlayer: React.FC<IScormPlayerProps> = ({ scormFilePath }) => {
    const [scormState, setScormState] = useState<IScormState>({
        [SCORM_API_CONSTANTS.LESSON_STATUS]: LESSON_COMPLETION_STATUS.NOT_STARTED,
        [SCORM_API_CONSTANTS.SCORE_RAW]: '0',
        [SCORM_API_CONSTANTS.IS_INITIALIZED]: false,
        [SCORM_API_CONSTANTS.SESSION_TIME]: '0',
        [SCORM_API_CONSTANTS.STUDENT_NAME]: 'Todd',
        [SCORM_API_CONSTANTS.SUSPEND_DATA]: '',
    });

    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (!scormFilePath) return;

        console.log("Setting up SCORM environment for:", scormFilePath);

        const handleStateChange = (key: keyof IScormState, value: unknown) => {
            console.log(`[REACT STATE UPDATE]: ${key} ->`, value);
            setScormState(prevState => {
                saveDataToBackend(prevState[SCORM_API_CONSTANTS.STUDENT_NAME], COURSE_ID, { ...prevState, [key]: value });
                return { ...prevState, [key]: value };
            });
        };

        const loadedData = loadDataFromBackend(scormState[SCORM_API_CONSTANTS.STUDENT_NAME], COURSE_ID);
        loadedData
            .then((data) => {
                console.log('Loaded data: ', data);

                const scormApi = createScormApi(
                    handleStateChange,
                    data,
                    () => { console.log('Progress saved.') }
                );
                window.API = scormApi;
                window.API_1484_11 = scormApi;
            })
            .catch(err => console.error(err));

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
