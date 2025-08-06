import { SCORM_API_CONSTANTS, LESSON_COMPLETION_STATUS } from "./constants.ts";

export interface ITrainingData {
    lessonStatus: string;
    score: string;
    isInitialized: boolean;
    studentName: string;
    suspendData: string;
    sessionTime: string;
}

export interface IScormState {
    [SCORM_API_CONSTANTS.LESSON_STATUS]: keyof LESSON_COMPLETION_STATUS;
    [SCORM_API_CONSTANTS.SCORE_RAW]: string;
    [SCORM_API_CONSTANTS.IS_INITIALIZED]: boolean;
    [SCORM_API_CONSTANTS.SESSION_TIME]: string;
    [SCORM_API_CONSTANTS.STUDENT_NAME]: string;
    [SCORM_API_CONSTANTS.SUSPEND_DATA]: string;
}

export interface IScormApi_21 {
    lessonStatus: string;
    score: string;
    isInitialized: boolean;
    studentName: string;
    suspendData: string;
    sessionTime: string;
    exit: string;
    mode: string;
}

export interface IScormApi_2004 {
    lessonStatus: string;
    score: string;
    isInitialized: boolean;
    studentName: string;
    suspendData: string;
    sessionTime: string;
    exit: string;
    rawScore: string;
    maxScore: string;
    minScore: string;
    scaledScore: string;
    successStatus: string;
    completionStatus: string;
    sessionTime: string;
}

export interface IScormApi {
    LMSInitialize: (param: string) => ScormBoolean;
    LMSFinish: (param: string) => ScormBoolean;
    LMSGetValue: (key: string) => string;
    LMSSetValue: (key: string, value: string) => ScormBoolean;
    LMSCommit: (param: string) => ScormBoolean;
    LMSGetLastError: () => string;
    LMSGetErrorString: (errorCode: string) => string;
    LMSGetDiagnostic: (errorCode: string) => string;
    _getState: () => IScormApi_21,
}

export interface IScormApi2004 {
    Initialize: (param: string) => ScormBoolean;
    Terminate: (param: string) => ScormBoolean;
    GetValue: (key: string) => string;
    SetValue: (key: string, value: string) => ScormBoolean;
    SetScore: (key: string, value: string) => ScormBoolean;
    Commit: (param: string) => ScormBoolean;
    GetLastError: () => string;
}


export interface IScormPlayerProps {
    scormFilePath: string;
    manifest: ScormManifest;
}

export interface ScormManifest {
    identifier: string;
    version: string;
    title: string;
    description?: string;
    organizations: Organization[];
    resources: Resource[];
    defaultOrganization?: string;
}

export interface Organization {
    identifier: string;
    title: string;
    items: Item[];
}

export interface Item {
    identifier: string;
    title: string;
    identifierref?: string;
    items?: Item[];
}

export interface Resource {
    identifier: string;
    type: string;
    href: string;
    files: string[];
}

export type ScormBoolean = 'true' | 'false';

export type Dictionary = {[key: string]: string };

export type TrainingFormat = typeof TRAINING_FORMAT[keyof typeof TRAINING_FORMAT];

declare global {
    interface Window {
        API?: IScormApi;
        API_1484_11?: IScormApi2004;
    }
}
