import type { IScormApi_1_2, IScormApi_2004 } from "./scorm.types";
import type { Dictionary } from "../../shared/types";

export const DEFAULT_SCORM_12_STATE: Readonly<IScormApi_1_2> = {
    lessonStatus: '',
    isInitialized: false,
    score: '0',
    sessionTime: '0000:00:00',
    studentName: 'Todd',
    suspendData: '',
    exit: '',
    mode: '',
}

export const DEFAULT_SCORM_2004_STATE: Readonly<IScormApi_2004> = {
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



export const SCORM_1_2_DATA_MODEL_KEYS = [
    'cmi.core.student_id',
    'cmi.core.student_name',
    'cmi.core.lesson_location',
    'cmi.core.lesson_status',
    'cmi.core.entry',
    'cmi.core.exit',
    'cmi.core.score.raw',
    'cmi.core.score.max',
    'cmi.core.score.min',
    'cmi.core.total_time',
    'cmi.core.lesson_mode',
    'cmi.core.session_time',
    'cmi.suspend_data',
] as const;

export type Scorm12Key = typeof SCORM_1_2_DATA_MODEL_KEYS[number];

export type Scorm12DataMap = {
  [key in Scorm12Key]: string;
};

export const scorm_12_objectMap: Scorm12DataMap = {
    'cmi.core.student_id': 'studentId',
    'cmi.core.student_name': 'studentName',
    'cmi.core.lesson_location': 'lessonLocation',
    'cmi.core.lesson_status': 'lessonStatus',
    'cmi.core.entry': 'entry',
    'cmi.core.exit': 'exit',
    'cmi.core.score.raw': 'score',
    'cmi.core.score.max': 'maxScore',
    'cmi.core.score.min': 'minScore',
    'cmi.core.total_time': 'totalTime',
    'cmi.core.lesson_mode': 'mode',
    'cmi.core.session_time': 'sessionTime',
    'cmi.suspend_data': 'suspendData',
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
