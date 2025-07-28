import { SCORM_API_CONSTANTS, LESSON_COMPLETION_STATUS } from "./constants.ts";

export interface IScormState {
    [SCORM_API_CONSTANTS.LESSON_STATUS]: keyof LESSON_COMPLETION_STATUS;
    [SCORM_API_CONSTANTS.SCORE_RAW]: string;
    [SCORM_API_CONSTANTS.IS_INITIALIZED]: boolean;
    [SCORM_API_CONSTANTS.SESSION_TIME]: string;
    [SCORM_API_CONSTANTS.STUDENT_NAME]: string;
    [SCORM_API_CONSTANTS.SUSPEND_DATA]: string;
}

export interface IScormApi {
    LMSInitialize: (param: string) => ScormBoolean;
    LMSFinish: (param: string) => ScormBoolean;
    LMSGetValue: (key: string) => string;
    LMSSetValue: (key: string, value: unknown) => ScormBoolean;
    LMSCommit: (param: string) => ScormBoolean;
    LMSGetLastError: () => string;
    LMSGetErrorString: (errorCode: string) => string;
    LMSGetDiagnostic: (errorCode: string) => string;
    _getState: () => { [key: string]: unknown },
}

export interface IScormPlayerProps {
    scormFilePath: string;
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

declare global {
    interface Window {
        API?: IScormApi;
        API_1484_11?: IScormApi;
    }
}
