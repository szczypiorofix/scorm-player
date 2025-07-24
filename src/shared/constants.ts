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
} as const
