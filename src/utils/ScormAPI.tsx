import type { IScormApi, IScormState } from "../shared/types";
import { SCORM_API_CONSTANTS } from "../shared/constants";

export const createScormApi = (
    onStateChange: (key: keyof IScormState, value: unknown) => void,
    initialData: Partial<{ [key: string]: unknown }> = {},
    saveProgress: () => void
): IScormApi => {
    const state: { [key: string]: unknown } = {
        [SCORM_API_CONSTANTS.LESSON_STATUS]: 'incomplete',
        [SCORM_API_CONSTANTS.STUDENT_NAME]: 'Uczestnik',
        [SCORM_API_CONSTANTS.SCORE_RAW]: '0',
        [SCORM_API_CONSTANTS.SESSION_TIME]: '0',
        [SCORM_API_CONSTANTS.SUSPEND_DATA]: '',
        ...initialData,
    };
    let isInitialized = false;

    const trackedKeys: (keyof IScormState)[] = [
        SCORM_API_CONSTANTS.LESSON_STATUS,
        SCORM_API_CONSTANTS.SCORE_RAW,
        SCORM_API_CONSTANTS.SESSION_TIME,
        SCORM_API_CONSTANTS.SUSPEND_DATA,
        SCORM_API_CONSTANTS.IS_INITIALIZED
    ];

    return {
        LMSInitialize: (param) => {
            if (isInitialized) return "false";
            isInitialized = true;
            console.log("LMS (Parent) Event: LMSInitialize. Param: " + param);
            onStateChange(SCORM_API_CONSTANTS.IS_INITIALIZED, true);

            if(state[SCORM_API_CONSTANTS.LESSON_STATUS] !== 'completed') {
                state[SCORM_API_CONSTANTS.LESSON_STATUS] = 'incomplete';
                onStateChange(SCORM_API_CONSTANTS.LESSON_STATUS, 'incomplete');
            }

            return "true";
        },
        LMSFinish: (param) => {
            if (!isInitialized) return "false";
            isInitialized = false;
            console.log("LMS (Parent) Event: LMSFinish. Param: " + param);
            onStateChange(SCORM_API_CONSTANTS.IS_INITIALIZED, false);

            // save progress for training
            saveProgress();

            return "true";
        },
        LMSGetValue: (key) => {
            console.log(`LMS (Parent) Event: LMSGetValue for key '${key}'`);
            return state[key] || "";
        },
        LMSSetValue: (key, value) => {
            console.log(`LMS (Parent) Event: LMSSetValue for key '${key}' with value '${value}'`);
            state[key] = value;

            if (trackedKeys.includes(key as keyof IScormState)) {
                onStateChange(key as keyof IScormState, value);
            }
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
