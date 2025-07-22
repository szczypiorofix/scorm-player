import React, { useState, useEffect, useRef } from 'react';
import type { IScormPlayerProps, IScormState } from "./types";
import { createScormApi } from "./ScormAPI.tsx";

const ScormPlayer: React.FC<IScormPlayerProps> = ({ scormFilePath }) => {
    const [scormState, setScormState] = useState<IScormState>({
        'cmi.core.lesson_status': 'nie rozpoczęto',
        'cmi.core.score.raw': '0',
        'isInitialized': false,
    });
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    useEffect(() => {
        if (!scormFilePath) return;

        console.log("Setting up SCORM environment for:", scormFilePath);

        const handleStateChange = (key: keyof IScormState, value: unknown) => {
            console.log(`React State Update: ${key} ->`, value);
            setScormState(prevState => ({ ...prevState, [key]: value }));
        };

        const scormApi = createScormApi(handleStateChange);
        window.API = scormApi;
        window.API_1484_11 = scormApi;

        console.log("SCORM API created and attached to window.");

        return () => {
            console.log("Cleaning up SCORM environment for:", scormFilePath);

            if (window.API?.LMSGetValue('isInitialized') === 'true') {
                window.API.LMSFinish("");
            }
            if (window.API_1484_11?.LMSGetValue('isInitialized') === 'true') {
                window.API_1484_11.LMSFinish("");
            }

            delete window.API;
            delete window.API_1484_11;
            console.log("SCORM API cleaned up.");
        };
    }, [scormFilePath]);

    return (
        <div>
            <div>
                <div>
                    <h3>Status Inicjalizacji</h3>
                    <p>
                        {scormState.isInitialized ? 'Aktywne' : 'Nieaktywne'}
                    </p>
                </div>
                <div>
                    <h3>Status Ukończenia</h3>
                    <p>{scormState['cmi.core.lesson_status']}</p>
                </div>
                <div>
                    <h3>Wynik</h3>
                    <p>{scormState['cmi.core.score.raw']}%</p>
                </div>
            </div>

            <div>
                {scormFilePath && (
                    <iframe
                        ref={iframeRef}
                        src={scormFilePath}
                        title="SCORM Content Player"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default ScormPlayer;
