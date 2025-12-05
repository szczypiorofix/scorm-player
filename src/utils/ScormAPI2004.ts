import { DEFAULT_SCORM_2004_STATE, scorm_2004_objectMap, SCORM_BOOLEAN } from "../features/scorm/scorm.constants";
import type { IScormApi2004State } from "../features/scorm/scorm.types";
import { getStateKeyByDictionaryKey, updateStateValueByKey } from "./ScormObjectParser";
import type { Scorm2004API } from "../features/scorm/api";

export function createScormApi2004 (
    onStateChange: (state: IScormApi2004State) => void,
    initialData: Partial<IScormApi2004State> | null = null,
    saveProgress: () => void
): Scorm2004API {
    let state: IScormApi2004State = {
        ...DEFAULT_SCORM_2004_STATE,
        ...initialData,
    };
    let isInitialized = false;

    return {
        Initialize: (param) => {
            if (isInitialized) return SCORM_BOOLEAN.FALSE;
            isInitialized = true;
            console.log("LMS (Parent) Event: Initialize. Param: " + param);

            state.isInitialized = isInitialized;

            if (state.lessonStatus !== 'completed') {
                state.lessonStatus = 'incomplete';
            }

            onStateChange(state);

            return SCORM_BOOLEAN.TRUE;
        },
        Terminate: (param) => {
            if (!isInitialized) return SCORM_BOOLEAN.FALSE;
            isInitialized = false;
            console.log("LMS (Parent) Event: Terminate. Param: " + param);

            state.isInitialized = isInitialized;
            onStateChange(state);

            // save progress for training
            saveProgress();

            return SCORM_BOOLEAN.TRUE;
        },
        GetValue: (key) => {
            const v = getStateKeyByDictionaryKey(state, key as keyof IScormApi2004State, scorm_2004_objectMap);
            console.log(`GetValue: [KEY: ${key}]: ${v}`);
            return state[v as keyof IScormApi2004State];
        },
        SetValue: (key, value) => {
            console.log('SetValue: Update key ' + key + ' value: ' + value)
            
            state = updateStateValueByKey<IScormApi2004State, keyof IScormApi2004State>(state, key as keyof IScormApi2004State, value, scorm_2004_objectMap);
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
