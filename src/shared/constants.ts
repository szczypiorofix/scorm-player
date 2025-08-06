import type { Dictionary, IScormApi_2004, IScormApi_21 } from "./types";

export const SCORM_API_CONSTANTS = {
    LESSON_STATUS: 'cmi.core.lesson_status',
    SCORE_RAW: 'cmi.core.score.raw',
    IS_INITIALIZED: 'isInitialized',
    SESSION_TIME: 'cmi.core.session_time',
    STUDENT_NAME: 'cmi.core.student_name',
    SUSPEND_DATA: 'cmi.suspend_data',
} as const;

export const LESSON_COMPLETION_STATUS = {
    NOT_STARTED: 'nie rozpoczęto',
    INCOMPLETE: 'incomplete',
    COMPLETED: 'completed',
    PASSED: 'passed',
    FAILED: 'failed',
    BROWSED: 'browsed'
} as const;

export const API_BASE_URL = 'http://localhost:3000/api/';

export const API_PROGRESS_URL = `${API_BASE_URL}progress/`;

export const TRAINING_CONTAINER_FOLDER_NAME = 'scorm';

export const COURSE_ID = '1';

export const DEFAULT_SCORM_21_STATE: IScormApi_21 = {
        lessonStatus: '',
        isInitialized: false,
        score: '0',
        sessionTime: '0000:00:00',
        studentName: 'Todd',
        suspendData: '',
        exit: '',
        mode: '',
}

export const DEFAULT_SCORM_2004_STATE: IScormApi_2004 = {
        isInitialized: false,
        lessonStatus: '',
        score: '',
        sessionTime: '0000:00:00',
        studentName: 'Todd',
        suspendData: '',
        completionStatus: '',
        exit: '',
        maxScore: '',
        minScore: '',
        rawScore: '',
        scaledScore: '',
        successStatus: '',
}

export const TRAINING_FORMAT = {
    SCORM_2_1: 'SCORM_2_1',
    SCORM_2004: 'SCORM_2004',
    XAPI: 'XAPI',
} as const;

export const scorm_21_objectMap: Dictionary = {
    'cmi.core.lesson_status': 'lessonStatus',
    'isInitialized': 'isInitialized',
    'cmi.core.score.raw': 'score',
    'cmi.core.session_time': 'sessionTime',
    'cmi.core.student_name': 'studentName',
    'cmi.suspend_data': 'suspendData',
    'cmi.core.exit': 'exit',
    'cmi.core.lesson_mode': 'mode',
}

export const scorm_2004_objectMap: Dictionary = {
    'cmi.core.lesson_status': 'lessonStatus',
    'cmi.core.score.raw': 'score',
    'isInitialized': 'isInitialized',
    'cmi.core.session_time': 'sessionTime',
    'cmi.core.student_name': 'studentName',
    'cmi.suspend_data': 'suspendData',
    'cmi.exit': 'exit',
    'cmi.score.raw': 'rawScore',
    'cmi.score.max': 'maxScore',
    'cmi.score.min': 'minScore',
    'cmi.score.scaled': 'scaledScore',
    'cmi.success_status': 'successStatus',
    'cmi.completion_status': 'completionStatus',
    'cmi.session_time': 'sessionTime',
}
