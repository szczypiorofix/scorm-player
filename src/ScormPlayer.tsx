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

        const handleStateChange = (key: keyof IScormState, value: any) => {
            console.log(`React State Update: ${key} ->`, value);
            setScormState(prevState => ({ ...prevState, [key]: value }));
        };

        const scormApi = createScormApi(handleStateChange);
        window.API = scormApi;
        window.API_1484_11 = scormApi;

        console.log("SCORM API created and attached to window.");

        return () => {
            console.log("Cleaning up SCORM environment for:", scormFilePath);

            // Wywołaj LMSFinish, jeśli API było zainicjowane
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
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-white p-1 rounded-lg shadow">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase">Status Inicjalizacji</h3>
                    <p className={`text-xl font-bold ${scormState.isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                        {scormState.isInitialized ? 'Aktywne' : 'Nieaktywne'}
                    </p>
                </div>
                <div className="bg-white p-1 rounded-lg shadow">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase">Status Ukończenia</h3>
                    <p className="text-xl font-bold text-blue-800 capitalize">{scormState['cmi.core.lesson_status']}</p>
                </div>
                <div className="bg-white p-1 rounded-lg shadow">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase">Wynik</h3>
                    <p className="text-xl font-bold text-blue-800">{scormState['cmi.core.score.raw']}%</p>
                </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-inner h-[75vh]">
                {scormFilePath && (
                    <iframe
                        ref={iframeRef}
                        src={scormFilePath}
                        title="SCORM Content Player"
                        className="w-full h-full border-0"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default ScormPlayer;
