import { DEFAULT_SCORM_2004_STATE, scorm_2004_objectMap } from "../shared/constants";
import type { IScormApi2004, IScormApi_2004 } from "../shared/types";
import { getStateKeyByDictionaryKey, updateStateValueByKey } from "./ScormObjectParser";

/**
 * 
    SCORM 2004 parameters:
    'cmi.core.lesson_status': 'incomplete',
    'cmi.core.score.raw': '0',
    isInitialized: true,
    'cmi.core.session_time': '0',
    'cmi.core.student_name': 'Todd',
    'cmi.suspend_data': '....',
    'cmi.exit': 'suspend',
    'cmi.score.raw': '33.33',
    'cmi.score.max': '100',
    'cmi.score.min': '0',
    'cmi.score.scaled': '0.3333',
    'cmi.success_status': 'unknown',
    'cmi.completion_status': 'incomplete',
    'cmi.session_time': 'PT1.79S',
    'cmi.interactions.0.id': 'Scene1_Slide1_FreeFormPickMany_1_0',
    'cmi.interactions.0.type': 'choice',
    'cmi.interactions.0.learner_response': 'praw',
    'cmi.interactions.0.result': 'correct',
    'cmi.interactions.0.correct_responses.0.pattern': 'praw',
    'cmi.interactions.0.description': 'Pick Many',
    'cmi.interactions.0.weighting': '10',
    'cmi.interactions.0.latency': 'PT5.12S',
    'cmi.interactions.0.objectives.0.id': 'TEST_LMS_SCORM_2004',
    'cmi.interactions.0.timestamp': '2025-07-31T16:44:37.0+02'
 */

export const createScormApi2004 = (
    onStateChange: (state: IScormApi_2004) => void,
    initialData: Partial<IScormApi_2004> | null = null,
    saveProgress: () => void
): IScormApi2004 => {
    let state: IScormApi_2004 = {
        ...DEFAULT_SCORM_2004_STATE,
        ...initialData,
    };
    let isInitialized = false;

    return {
        Initialize: (param) => {
            if (isInitialized) return "false";
            isInitialized = true;
            console.log("LMS (Parent) Event: Initialize. Param: " + param);

            state.isInitialized = isInitialized;

            if (state.lessonStatus !== 'completed') {
                state.lessonStatus = 'incomplete';
            }

            onStateChange(state);

            return "true";
        },
        Terminate: (param) => {
            if (!isInitialized) return "false";
            isInitialized = false;
            console.log("LMS (Parent) Event: Terminate. Param: " + param);

            state.isInitialized = isInitialized;
            onStateChange(state);

            // save progress for training
            saveProgress();

            return "true";
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
            return "true";
        },
        Commit(param) {
            console.log("LMS (Parent, 2004 version) Event: Commit. Param: " + param);
            return "true";
        },
        GetLastError: () => {
            return "0";
        },
    } as IScormApi2004;
};
