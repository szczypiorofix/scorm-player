import type { IScormApi, IScormState } from "./types";

export const createScormApi = (onStateChange: (key: keyof IScormState, value: unknown) => void): IScormApi => {
    const state: { [key: string]: unknown } = {
        'cmi.core.lesson_status': 'incomplete',
        'cmi.core.student_name': 'Uczestnik',
        'cmi.core.score.raw': '0',
        'cmi.suspend_data': '',
    };
    let isInitialized = false;

    const trackedKeys: (keyof IScormState)[] = [
        'cmi.core.lesson_status',
        'cmi.core.score.raw',
        'isInitialized'
    ];

    return {
        LMSInitialize: (param) => {
            if (isInitialized) return "false";
            isInitialized = true;
            console.log("LMS (Parent) Event: LMSInitialize. Param: " + param);
            onStateChange('isInitialized', true);
            return "true";
        },
        LMSFinish: (param) => {
            if (!isInitialized) return "false";
            isInitialized = false;
            console.log("LMS (Parent) Event: LMSFinish. Param: " + param);
            onStateChange('isInitialized', false);
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
            console.log('LMSGetLastError');
            return "0";
        },
        LMSGetErrorString: (errorCode) => {
            console.log('LMSGetErrorString: ' + errorCode);
            return "No error"
        },
        LMSGetDiagnostic: (errorCode) => {
            console.log('LMSGetDiagnostic: ' + errorCode);
            return "No diagnostic information";
        },
    } as IScormApi;
};
