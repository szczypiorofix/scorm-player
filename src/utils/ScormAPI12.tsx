import { DEFAULT_SCORM_12_STATE, scorm_12_objectMap } from "../features/scorm/scorm.constants";
import type { IScormApi_1_2 } from "../features/scorm/scorm.types";
import { getStateKeyByDictionaryKey, updateStateValueByKey } from "./ScormObjectParser";
import { ScormV12 } from "../features/scorm/models/scorm-version-12.ts";

/**
 * 
    SCORM 1.2 parameters:
    'cmi.core.lesson_status': 'incomplete',
    'cmi.core.score.raw': '0',
    'isInitialized: true,
    'cmi.core.session_time': '0',
    'cmi.core.student_name': 'Todd',
    'cmi.suspend_data': '',
    'cmi.core.exit': 'suspend'
 */

export function createScormApi12(
    onStateChange: (state: IScormApi_1_2) => void,
    initialData: Partial<IScormApi_1_2> | null = null,
    saveProgress: () => void
): ScormV12.ApiSignature {
    let state: IScormApi_1_2 = {
        ...DEFAULT_SCORM_12_STATE,
        ...initialData,
    };

    let isInitialized = false;

    return {
        LMSInitialize: (param: string) => {
            if (isInitialized) return false;
            isInitialized = true;
            console.log("LMS (Parent) Event: LMSInitialize. Param: " + param);

            state.isInitialized = isInitialized;

            if (state.lessonStatus !== 'completed') {
                state.lessonStatus = 'incomplete';
            }

            onStateChange(state);

            return true;
        },
        LMSFinish: (param: string) => {
            if (!isInitialized) return false;
            isInitialized = false;
            console.log("LMS (Parent) Event: LMSFinish. Param: " + param);

            state.isInitialized = isInitialized;
            onStateChange(state);

            // save progress for training
            saveProgress();

            return true;
        },
        LMSGetValue: (key: ScormV12.CMIElement) => {
            const v = getStateKeyByDictionaryKey(state, key as keyof IScormApi_1_2, scorm_12_objectMap);
            console.log(`LMSGetValue: [KEY: ${key}]: ${v}=${state[v as keyof IScormApi_1_2]}`);
            return state[v as keyof IScormApi_1_2];
        },
        LMSSetValue: (key: ScormV12.CMIElement, value: string) => {
            console.log('LMSSetValue: Update key ' + key + ' value: ' + value)

            state = updateStateValueByKey<IScormApi_1_2, keyof IScormApi_1_2>(state, key as keyof IScormApi_1_2, value, scorm_12_objectMap);
            onStateChange(state);

            return "";
        },
        LMSCommit: (param: string) => {
            console.log("LMS (Parent) Event: LMSCommit. Param: " + param);
            return true;
        },
        LMSGetLastError: () => {
            return 0;
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
    } as ScormV12.ApiSignature;
}
