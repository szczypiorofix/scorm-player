import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useSaveProgress, useLoadProgress } from '../../hooks/';
import type { IScormPlayerProps } from "../../shared/types";
import { COURSE_ID, SCORM_API_CONSTANTS } from "../../shared/constants";
import * as SP from "./ScormPlayer.style";
import { StatusGroup } from "./StatusGroup";
import { getTrainingVersion } from '../../utils/TrainingVersionParser';
import { createScormApi12 } from "../../utils/ScormAPI12";
import { Notification } from "../notification/Notification";
import { NotificationType } from '../notification/Notification';
import { createScormApi2004 } from '../../utils/ScormAPI2004';
import type { PlayerRootState } from '../../features/scorm/scorm.types';
import { DEFAULT_SCORM_STATE } from '../../features/scorm/scorm.constants';
import {
    TRAINING_FORMAT,
    type Scorm12API,
    type Scorm2004API,
    type TrainingFormat,
    type Scorm12Status,
} from "../../features/scorm/api";

const ScormPlayer: React.FC<IScormPlayerProps> = (props: IScormPlayerProps) => {
    const [playerState, setPlayerState] = useState<PlayerRootState>(DEFAULT_SCORM_STATE);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    let studentName: string = "";
    if ("core" in playerState.scormData) {
        studentName = playerState.scormData.core.student_name;
    }
    if ("learner_name" in playerState.scormData) {
        studentName = playerState.scormData.learner_name;
    }

    let lessonStatus: Scorm12Status = 'not attempted';
    if ("core" in playerState.scormData) {
        lessonStatus = playerState.scormData.core.lesson_status;
    }

    const { data: initialScormData, isLoading: isLoadingProgress, error: loadError } = useLoadProgress({
        userId: studentName,
        courseId: COURSE_ID,
    });

    const { saveProgress, isLoading: isSavingProgress, error: saveError } = useSaveProgress({
        userId: studentName,
        courseId: COURSE_ID,
    });

    const handleScormUpdate = useCallback((newData: PlayerRootState) => {
        setPlayerState((prev: PlayerRootState) => ({
            ...prev,
            scormData: newData.scormData
        }));
        saveProgress(newData); // Zapisujemy strukturę CMI bezpośrednio
    }, [saveProgress]);

    useEffect(() => {
        if (!props.scormFilePath || isLoadingProgress) {
            return;
        }

        const trainingFormat: TrainingFormat = getTrainingVersion(props.manifest.version);
        console.log('Training format: ' + trainingFormat);
        let scormApi: Scorm12API | Scorm2004API | null;

        switch(trainingFormat) {
            case TRAINING_FORMAT.SCORM_1_2:
                    scormApi = createScormApi12(
                        handleScormUpdate,
                        initialScormData as PlayerRootState,
                        () => { console.log('Progress saved via Commit.'); }
                    );
                    window.API = scormApi;
                break;

            default:
                    scormApi = createScormApi2004(
                        handleScormUpdate,
                        initialScormData as PlayerRootState,
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
        handleScormUpdate
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
                <StatusGroup title={"Uczestnik"} value={studentName}/>
                <StatusGroup title={"Status Inicjalizacji"} value={playerState.meta.isInitialized ? 'Aktywne' : 'Nieaktywne'}/>
                <StatusGroup title={"Status Ukończenia"} value={lessonStatus}/>
                {/*{ scormState.completionStatus && <StatusGroup title={"Zaliczenie"} value={scormState.successStatus}/>}*/}
                {/*{ !(scormState.maxScore && scormState.minScore) && (scormState.score || scormState.rawScore) */}
                {/*    && <StatusGroup title={"Wynik"} value={`${scormState.score || scormState.rawScore}%`}/>}*/}
                {/*{ scormState.maxScore && scormState.minScore*/}
                {/*    && <StatusGroup title={"Wynik"} value={`${scormState.rawScore}% (${scormState.minScore}/${scormState.maxScore})`}/>}*/}
                {/*<StatusGroup title={"Czas sesji"} value={scormState.sessionTime}/>*/}
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
