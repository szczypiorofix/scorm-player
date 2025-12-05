import { SCORM_BOOLEAN, type Scorm2004API } from "../features/scorm/api";
import { DEFAULT_SCORM_STATE} from "../features/scorm/scorm.constants";
import type { PlayerRootState} from "../features/scorm/scorm.types";

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

export function createScormApi2004 (
    onStateChange: (state: PlayerRootState) => void,
    initialData: Partial<PlayerRootState> | null = null,
    saveProgress: () => void
): Scorm2004API {
    let state: PlayerRootState = {
        ...DEFAULT_SCORM_STATE,
        ...initialData,
    };
    let isInitialized = false;

    return {
        Initialize: (param) => {
            if (isInitialized) return SCORM_BOOLEAN.FALSE;
            isInitialized = true;
            console.log("LMS (Parent) Event: Initialize. Param: " + param);

            // state.core.isInitialized = isInitialized;
            //
            // if (state.lessonStatus !== 'completed') {
            //     state.lessonStatus = 'incomplete';
            // }

            let isInitialized = false;

            onStateChange(state);

            return SCORM_BOOLEAN.TRUE;
        },
        Terminate: (param) => {
            if (!isInitialized) return SCORM_BOOLEAN.FALSE;
            isInitialized = false;
            console.log("LMS (Parent) Event: Terminate. Param: " + param);

            state.meta.isInitialized = isInitialized;
            onStateChange(state);

            // save progress for training
            saveProgress();

            return SCORM_BOOLEAN.TRUE;
        },
        GetValue: (key) => {
            // const v = getStateKeyByDictionaryKey(state, key as keyof IScormApi_2004, scorm_2004_objectMap);
            // console.log(`GetValue: [KEY: ${key}]: ${v}`);
            // return state[v as keyof IScormApi_2004];
            return "";
        },
        SetValue: (key, value) => {
            console.log(`SetValue: ${key} = ${value}`);

            state = setNestedValue(state, key, value);
            onStateChange(state);

            return SCORM_BOOLEAN.TRUE;
        },
        Commit(param) {
            console.log("LMS (Parent, 2004 version) Event: Commit. Param: " + param);
            return SCORM_BOOLEAN.TRUE;
        },
        GetLastError: () => {
            return "0";
        },
    } as Scorm2004API;
}
