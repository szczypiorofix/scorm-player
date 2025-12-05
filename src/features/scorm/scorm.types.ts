import type { SCORM_BOOLEAN, TRAINING_FORMAT } from "./scorm.constants";

export type ScormBoolean = (typeof SCORM_BOOLEAN)[keyof typeof SCORM_BOOLEAN] | boolean;

export type TrainingFormat = typeof TRAINING_FORMAT[keyof typeof TRAINING_FORMAT];

export interface IScormApi_1_2 {
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



