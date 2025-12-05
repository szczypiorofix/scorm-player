import { CMIErrorCodes } from './common.constants';
import type { ScormBoolean } from "./common.types.ts";

export interface Scorm12API {
    LMSInitialize: (param: string) => ScormBoolean;
    LMSFinish: (param: string) => ScormBoolean;
    LMSGetValue: (key: CmiElement12) => string;
    LMSSetValue: (key: CmiElement12, value: string) => ScormBoolean;
    LMSCommit: (param: string) => ScormBoolean;
    LMSGetLastError: () => string;
    LMSGetErrorString: (errorCode: keyof typeof CMIErrorCodes) => string;
    LMSGetDiagnostic: (errorCode: keyof typeof CMIErrorCodes) => string;
}

export type CmiElement12 =
    | "cmi.core._children"
    | "cmi.core.student_id"
    | "cmi.core.student_name"
    | "cmi.core.lesson_location"
    | "cmi.core.credit"
    | "cmi.core.lesson_status"
    | "cmi.core.entry"
    | "cmi.core.score.raw"
    | "cmi.core.score.max"
    | "cmi.core.score.min"
    | "cmi.core.total_time"
    | "cmi.core.lesson_mode"
    | "cmi.core.exit"
    | "cmi.core.session_time"
    | "cmi.suspend_data"
    | "cmi.launch_data"
    | "cmi.comments"
    | "cmi.comments_from_lms"
    | string;

export type Scorm12Status = "passed" | "completed" | "failed" | "incomplete" | "browsed" | "not attempted";
export type Scorm12Exit = "time-out" | "suspend" | "logout" | "";

export interface CMI12 {
    core: {
        readonly _children: string;
        readonly student_id: string;
        readonly student_name: string;
        lesson_location: string;
        readonly credit: "credit" | "no-credit";
        lesson_status: Scorm12Status;
        readonly entry: "ab-initio" | "resume" | "";
        score: {
            readonly _children: string;
            raw: string; // Liczba jako string (np. "80")
            max: string;
            min: string;
        };
        readonly total_time: string; // Format CMITimespan (HH:MM:SS.ss)
        readonly lesson_mode: "browse" | "normal" | "review";
        exit: Scorm12Exit;
        session_time: string; // Format CMITimespan
    };
    suspend_data: string;
    launch_data: string;
    comments: string;
    readonly comments_from_lms: string;
    objectives: {
        [n: number]: {
            id: string;
            score: { raw: string; max: string; min: string };
            status: Scorm12Status;
        };
        _count: string;
    };
    student_data: {
        mastery_score: string;
        max_time_allowed: string;
        time_limit_action: string;
    };
    student_preference: {
        audio: string;
        language: string;
        speed: string;
        text: string;
    };
}
