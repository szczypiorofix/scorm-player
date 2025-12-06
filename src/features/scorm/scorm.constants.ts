import type { PlayerRootState } from "./scorm.types";
import type { Dictionary } from "../../shared/types";
import type { CMI12, CMI2004 } from "./api";

export const DEFAULT_SCORM_STATE: Readonly<PlayerRootState> = {
    meta: { isInitialized: false, isLoading: true, lastSaved: null, error: null },
    scormData: {} as CMI12 | CMI2004
}

export const DEFAULT_SCORM12_STATE: Readonly<CMI12> = {
    core: {
        lesson_status: "not attempted",
        lesson_mode: "normal",
        lesson_location: "",
        _children: "",
        credit: "credit",
        entry: "",
        exit: "suspend",
        score: {
            raw: "0",
            max: "100",
            min: "0",
            _children: "",
        },
        session_time: "",
        student_id: "",
        student_name: "",
        total_time: "",
    },
    comments: "",
    comments_from_lms: "",
    launch_data: "",
    student_data: {
        mastery_score: "",
        max_time_allowed: "",
        time_limit_action: "",
    },
    suspend_data: "",
    objectives: {
        _count: "",
    },
    student_preference: {
        audio: "",
        language: "",
        speed: "",
        text: "",
    }
}

export const DEFAULT_SCORM2004_STATE: Readonly<CMI2004> = {
    credit: 'no-credit',
    entry: '',
    exit: 'normal',
    score: {
        raw: '0',
        max: '100',
        min: '0',
        scaled: '0'
    },
    session_time: '',
    comments_from_lms: [],
    _version: '',
    launch_data: '',
    comments_from_learner: [],
    total_time: '',
    completion_status: 'not attempted',
    completion_threshold: '',
    interactions: {
        _count: '0'
    },
    learner_id: '',
    learner_name: '',
    max_time_allowed: '',
    location: '',
    mode: 'normal',
    suspend_data: '',
    learner_preference: {
        audio_level: '',
        language: '',
        audio_captioning: '',
        delivery_speed: ''
    },
    progress_measure: '',
    time_limit_action: '',
    scaled_passing_score: '',
    success_status: 'unknown'
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
