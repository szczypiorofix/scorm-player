import {SCORM_BOOLEAN, type Scorm12API, type CMI12, type CMI2004} from "../features/scorm/api";
import type {PlayerRootState} from "../features/scorm/scorm.types.ts";
import { DEFAULT_SCORM_STATE } from "../features/scorm/scorm.constants.ts";

function setNestedValue(obj: any, path: string, value: string) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // Obsługa tablic (np. interactions.0)
        if (!current[key]) current[key] = {};
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return { ...obj }; // Zwracamy nową referencję dla Reacta
}

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
    saveProgress: () => void
): Scorm12API {
    let state: ScormApi12RootState = {
        meta: initialData?.meta ?? {
            isInitialized: false,
            error: '',
            lastSaved: null,
            isLoading: false
        },
        scormData: state.scormData
    };

    let isInitialized = false;

    return {
        LMSInitialize: (param) => {
            console.log("LMS (Parent) Event: LMSInitialize. Param: " + param);
            if (isInitialized) {
                return SCORM_BOOLEAN.FALSE;
            }
            isInitialized = true;

            state.meta.isInitialized = isInitialized;

            onStateChange(state);

            return SCORM_BOOLEAN.TRUE;
        },
        LMSFinish: (param) => {
            console.log("LMS (Parent) Event: LMSFinish. Param: " + param);
            if (!isInitialized) {
                return SCORM_BOOLEAN.FALSE;
            }
            isInitialized = false;

            state.meta.isInitialized = isInitialized;
            onStateChange(state);

            saveProgress();

            return SCORM_BOOLEAN.TRUE;
        },
        LMSGetValue: (key): string => {
            // const v = getStateKeyByDictionaryKey(state, key as keyof IScormApi_1_2, scorm_12_objectMap);
            console.log(`LMSGetValue: [KEY: ${key}]`);
            // return state[v as keyof IScormApi_1_2];
            return state.scormData[key] as string;
        },
        LMSSetValue: (key, value) => {
            console.log(`LMSSetValue: ${key} = ${value}`);

            state = setNestedValue(state, key, value);
            onStateChange(state);

            return SCORM_BOOLEAN.TRUE;
        },
        LMSCommit: (param) => {
            console.log("LMS (Parent) Event: LMSCommit. Param: " + param);
            return SCORM_BOOLEAN.TRUE;
        },
        LMSGetLastError: () => {
            return "0";
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
