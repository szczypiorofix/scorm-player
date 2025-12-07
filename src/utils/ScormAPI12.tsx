import { SCORM_BOOLEAN, type Scorm12API, type CMI12, TRAINING_FORMAT } from "../features/scorm/api";
import type { PlayerRootState } from "../features/scorm/scorm.types.ts";
import { getScormValue, setScormValue } from "./SetNestedValue.ts";

export interface ScormApi12RootState {
    meta: {
        isInitialized: boolean;
        isLoading: boolean;
        lastSaved: Date | null;
        error: string | null;
    };
    scormData: CMI12;
}

export function createScormApi12(
    onStateChange: (state: ScormApi12RootState) => void,
    initialData: PlayerRootState | null = null,
    defaultData: CMI12,
    saveProgressCallback: () => void
): Scorm12API {
    const currentState: ScormApi12RootState = {
        meta: initialData?.meta ?? {
            isInitialized: false,
            error: '',
            lastSaved: null,
            isLoading: false,
            trainingVersion: TRAINING_FORMAT.SCORM_1_2
        },
        scormData: (initialData?.scormData as CMI12) || defaultData
    };

    console.log(initialData);

    let isInitialized = false;
    let lastError = "0";

    return {
        LMSInitialize: (param) => {
            console.log("LMS (Parent) Event: LMSInitialize. Param: " + param);
            if (isInitialized) {
                return SCORM_BOOLEAN.FALSE;
            }
            isInitialized = true;

            currentState.meta.isInitialized = isInitialized;

            onStateChange(currentState);

            return SCORM_BOOLEAN.TRUE;
        },
        LMSFinish: (param) => {
            console.log("LMS (Parent) Event: LMSFinish. Param: " + param);
            if (!isInitialized) {
                return SCORM_BOOLEAN.FALSE;
            }
            isInitialized = false;

            currentState.meta.isInitialized = isInitialized;
            onStateChange(currentState);

            saveProgressCallback();

            return SCORM_BOOLEAN.TRUE;
        },
        LMSGetValue: (key): string => {
            if (!isInitialized) {
                lastError = "301"; // Not initialized
                return "";
            }

            const value = getScormValue(currentState, key);
            console.log(`LMSGetValue('${key}') -> '${value}'`);

            lastError = "0"; // No error
            return "";
        },
        LMSSetValue: (key, value) => {
            if (!isInitialized) {
                lastError = "301";
                return SCORM_BOOLEAN.FALSE;
            }

            console.log(`LMSSetValue('${key}', '${value}')`);

            currentState.scormData = setScormValue(currentState.scormData, key, value);

            onStateChange(currentState);

            lastError = "0";
            return SCORM_BOOLEAN.TRUE;
        },
        LMSCommit: (param) => {
            console.log("LMS (Parent) Event: LMSCommit. Param: " + param);
            return SCORM_BOOLEAN.TRUE;
        },
        LMSGetLastError: () => {
            return lastError;
        },
        LMSGetErrorString: (errorCode) => {
            if (errorCode) {
                console.log('LMSGetErrorString: ', errorCode);
            }
            return "No error"
        },
        LMSGetDiagnostic: (errorCode) => {
            console.log('LMSGetDiagnostic: ', errorCode);
            return "No diagnostic information";
        },
    } as Scorm12API;
}
