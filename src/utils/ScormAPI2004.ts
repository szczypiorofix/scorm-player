import { SCORM_BOOLEAN, type Scorm2004API } from "../features/scorm/api";
import { DEFAULT_SCORM_2004_STATE, scorm_2004_objectMap } from "../features/scorm/scorm.constants";
import type { IScormApi_2004 } from "../features/scorm/scorm.types";
import { getStateKeyByDictionaryKey, updateStateValueByKey } from "./ScormObjectParser";

export function createScormApi2004 (
    onStateChange: (state: IScormApi_2004) => void,
    initialData: Partial<IScormApi_2004> | null = null,
    saveProgress: () => void
): Scorm2004API {
    let state: IScormApi_2004 = {
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
            const v = getStateKeyByDictionaryKey(state, key as keyof IScormApi_2004, scorm_2004_objectMap);
            console.log(`GetValue: [KEY: ${key}]: ${v}`);
            return state[v as keyof IScormApi_2004];
        },
        SetValue: (key, value) => {
            console.log('SetValue: Update key ' + key + ' value: ' + value)
            
            state = updateStateValueByKey<IScormApi_2004, keyof IScormApi_2004>(state, key as keyof IScormApi_2004, value, scorm_2004_objectMap);
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
