import { SCORM_BOOLEAN, type Scorm2004API, type CMI2004 } from "../features/scorm/api";
import type { PlayerRootState} from "../features/scorm/scorm.types";
import { getScormValue, setScormValue } from "./SetNestedValue.ts";

export interface ScormApi2004RootState {
    meta: {
        isInitialized: boolean;
        isLoading: boolean;
        lastSaved: Date | null;
        error: string | null;
    };
    scormData: CMI2004;
}

export function createScormApi2004 (
    onStateChange: (state: PlayerRootState) => void,
    initialData: Partial<PlayerRootState> | null = null,
    defaultData: CMI2004,
    saveProgressCallback: () => void
): Scorm2004API {
    const currentState: ScormApi2004RootState = {
        meta: initialData?.meta ?? {
            isInitialized: false,
            error: '',
            lastSaved: null,
            isLoading: false
        },
        scormData: (initialData?.scormData as CMI2004) || defaultData
    };

    let isInitialized = false;
    let lastError = "0";

    return {
        Initialize: (param) => {

            isInitialized = true;
            console.log("LMS (Parent) Event: Initialize. Param: " + param);

            onStateChange(currentState);

            return SCORM_BOOLEAN.TRUE;
        },
        Terminate: (param) => {
            if (!isInitialized) return SCORM_BOOLEAN.FALSE;
            isInitialized = false;
            console.log("LMS (Parent) Event: Terminate. Param: " + param);

            currentState.meta.isInitialized = isInitialized;
            onStateChange(currentState);

            // save progress for training
            saveProgressCallback();

            return SCORM_BOOLEAN.TRUE;
        },
        GetValue: (key) => {
            if (!isInitialized) {
                lastError = "301"; // Not initialized
                return "";
            }
            console.log(currentState.scormData);
            const value = getScormValue(currentState.scormData, key);

            console.log(`GetValue: [KEY: ${key}] -> '${value}'`);

            lastError = "0"; // No error
            return value;
        },
        SetValue: (key, value) => {
            console.log(`SetValue: ${key} = ${value}`);

            currentState.scormData = setScormValue(currentState.scormData, key, value);

            onStateChange(currentState);

            lastError = "0";

            return SCORM_BOOLEAN.TRUE;
        },
        Commit(param) {
            console.log("LMS (Parent, 2004 version) Event: Commit. Param: " + param);
            return SCORM_BOOLEAN.TRUE;
        },
        GetLastError: () => {
            return lastError;
        },
    } as Scorm2004API;
}
