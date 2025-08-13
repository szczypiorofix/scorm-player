import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useSaveProgress, useLoadProgress } from '../../hooks/';
import type { IScormApi, IScormApi2004, IScormApi_2004, IScormApi_1_2, IScormPlayerProps, TrainingFormat } from "../../shared/types";
import { COURSE_ID, DEFAULT_SCORM_2004_STATE, DEFAULT_SCORM_21_STATE, SCORM_API_CONSTANTS, TRAINING_FORMAT } from "../../shared/constants";
import * as SP from "./ScormPlayer.style";
import { StatusGroup } from "./StatusGroup";
import { getTrainingVersion } from '../../utils/TrainingVersionParser';
import { createScormApi12 } from "../../utils/ScormAPI12";
import { Notification } from "../notification/Notification";
import { NotificationType } from '../../shared/NotificationType';
import { createScormApi2004 } from '../../utils/ScormAPI2004';

const ScormPlayer: React.FC<IScormPlayerProps> = (props: IScormPlayerProps) => {
    const [scormState, setScormState] = useState<IScormApi_1_2 & IScormApi_2004>({
        ...DEFAULT_SCORM_21_STATE,
        ...DEFAULT_SCORM_2004_STATE
    });

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const studentName: string = scormState.studentName;

    const { data: initialScormData, isLoading: isLoadingProgress, error: loadError } = useLoadProgress({
        userId: studentName,
        courseId: COURSE_ID,
    });

    const { saveProgress, isLoading: isSavingProgress, error: saveError } = useSaveProgress({
        userId: studentName,
        courseId: COURSE_ID,
    });

    const handleStateChangeForScorm12 = useCallback((state: IScormApi_1_2) => {
        console.log('[REACT STATE UPDATE]: ', state);
        setScormState(prevState => {
            const updatedState = { ...prevState, ...state };
            saveProgress(updatedState);
            return updatedState;
        });
    }, [saveProgress]);

    const handleStateChangeForScorm2004 = useCallback((state: IScormApi_2004) => {
        console.log('[REACT STATE UPDATE]: ', state);
        setScormState(prevState => {
            const updatedState = { ...prevState, ...state };
            saveProgress(updatedState);
            return updatedState;
        });
    }, [saveProgress]);

    useEffect(() => {
        if (!props.scormFilePath || isLoadingProgress) {
            return;
        }

        const trainingFormat: TrainingFormat = getTrainingVersion(props.manifest.version);
        console.log('Training format: ' + trainingFormat);
        let scormApi: IScormApi | IScormApi2004 | null;

        switch(trainingFormat) {
            case TRAINING_FORMAT.SCORM_1_2:
                    scormApi = createScormApi12(
                        handleStateChangeForScorm12,
                        initialScormData as IScormApi_1_2,
                        () => { console.log('Progress saved via Commit.'); }
                    );
                    window.API = scormApi;
                break;

            default:
                    scormApi = createScormApi2004(
                        handleStateChangeForScorm2004,
                        initialScormData as IScormApi_2004,
                        () => { console.log('Progress saved via Commit.'); }
                    );
                    window.API_1484_11 = scormApi;
                break;
        }

        console.log("SCORM API created and attached to window.");

        return () => {
            if (trainingFormat === TRAINING_FORMAT.SCORM_1_2) {
                if (window.API?.LMSGetValue(SCORM_API_CONSTANTS.IS_INITIALIZED) === 'true') {
                    window.API.LMSFinish("");
                }
            }
            if (trainingFormat === TRAINING_FORMAT.SCORM_2004) {
                if (window.API_1484_11?.GetValue(SCORM_API_CONSTANTS.IS_INITIALIZED) === 'true') {
                    window.API_1484_11.Terminate("");
                }
            }
            
            delete window.API;
            delete window.API_1484_11;
            console.log("SCORM API cleaned up.");
        };
    }, [
        props.scormFilePath,
        isLoadingProgress,
        initialScormData,
        props.manifest.version,
        handleStateChangeForScorm12,
        handleStateChangeForScorm2004
    ]);

    if (isLoadingProgress) {
        return <SP.ScormPlayer>Ładowanie danych kursu... ⏳</SP.ScormPlayer>;
    }

    if (loadError) {
        return <SP.ScormPlayer>Wystąpił błąd: {loadError.message} 😥</SP.ScormPlayer>;
    }

    return (
        <SP.ScormPlayer>
            <SP.StatusInfo>
                <StatusGroup title={"Uczestnik"} value={scormState.studentName}/>
                <StatusGroup title={"Status Inicjalizacji"} value={scormState.isInitialized ? 'Aktywne' : 'Nieaktywne'}/>
                <StatusGroup title={"Status Ukończenia"} value={scormState.lessonStatus}/>
                { scormState.completionStatus && <StatusGroup title={"Zaliczenie"} value={scormState.successStatus}/>}
                { !(scormState.maxScore && scormState.minScore) && (scormState.score || scormState.rawScore) 
                    && <StatusGroup title={"Wynik"} value={`${scormState.score || scormState.rawScore}%`}/>}
                { scormState.maxScore && scormState.minScore
                    && <StatusGroup title={"Wynik"} value={`${scormState.rawScore}% (${scormState.minScore}/${scormState.maxScore})`}/>}
                <StatusGroup title={"Czas sesji"} value={scormState.sessionTime}/>
                {isSavingProgress && <span>Zapisywanie...</span>}
                {saveError && <Notification message={"Save data error!"} type={NotificationType.ERROR}/> }
            </SP.StatusInfo>
            <SP.IframeContainer>
                {props.scormFilePath && (
                    <SP.Iframe
                        ref={iframeRef}
                        src={props.scormFilePath}
                        title="SCORM Content Player"
                        allowFullScreen
                    />
                )}
            </SP.IframeContainer>
        </SP.ScormPlayer>
    );
};

export default ScormPlayer;
