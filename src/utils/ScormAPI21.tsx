import { DEFAULT_SCORM_21_STATE, scorm_21_objectMap } from "../shared/constants";
import type { IScormApi, IScormApi_21 } from "../shared/types";
import { getStateKeyByDictionaryKey, updateStateValueByKey } from "./ScormObjectParser";

/**
 * 
    SCORM 2.1 parameters:
    'cmi.core.lesson_status': 'incomplete',
    'cmi.core.score.raw': '0',
    'isInitialized: true,
    'cmi.core.session_time': '0',
    'cmi.core.student_name': 'Todd',
    'cmi.suspend_data': '',
    'cmi.core.exit': 'suspend'
 */

export const createScormApi21 = (
    onStateChange: (state: IScormApi_21) => void,
    initialData: Partial<IScormApi_21> | null = null,
    saveProgress: () => void
): IScormApi => {
    let state: IScormApi_21 = {
        ...DEFAULT_SCORM_21_STATE,
        ...initialData,
    };

    let isInitialized = false;

    return {
        LMSInitialize: (param) => {
            if (isInitialized) return "false";
            isInitialized = true;
            console.log("LMS (Parent) Event: LMSInitialize. Param: " + param);

            state.isInitialized = isInitialized;

            if (state.lessonStatus !== 'completed') {
                state.lessonStatus = 'incomplete';
            }

            onStateChange(state);

            return "true";
        },
        LMSFinish: (param) => {
            if (!isInitialized) return "false";
            isInitialized = false;
            console.log("LMS (Parent) Event: LMSFinish. Param: " + param);

            state.isInitialized = isInitialized;
            onStateChange(state);

            // save progress for training
            saveProgress();

            return "true";
        },
        LMSGetValue: (key) => {
            const v = getStateKeyByDictionaryKey(state, key as keyof IScormApi_21, scorm_21_objectMap);
            console.log(`LMSGetValue: [KEY: ${key}]: ${v}=${state[v as keyof IScormApi_21]}`);
            return state[v as keyof IScormApi_21];
        },
        LMSSetValue: (key, value) => {
            console.log('LMSSetValue: Update key ' + key + ' value: ' + value)
            
            state = updateStateValueByKey<IScormApi_21, keyof IScormApi_21>(state, key as keyof IScormApi_21, value, scorm_21_objectMap);
            onStateChange(state);

            return "true";
        },
        LMSCommit: (param) => {
            console.log("LMS (Parent) Event: LMSCommit. Param: " + param);
            return "true";
        },
        LMSGetLastError: () => {
            return "0";
        },
        LMSGetErrorString: (errorCode) => {
            if (errorCode) {
                console.log('LMSGetErrorString: ' + errorCode);
            }
            return "No error"
        },
        LMSGetDiagnostic: (errorCode) => {
            console.log('LMSGetDiagnostic: ' + errorCode);
            return "No diagnostic information";
        },
        _getState: () => state,
    } as IScormApi;
};
