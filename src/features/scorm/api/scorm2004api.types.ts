import { CMIErrorCodes } from './common.constants';
import type { ScormBoolean } from "./common.types.ts";

export interface Scorm2004API {
    Initialize(param: ""): ScormBoolean;
    Terminate(param: ""): ScormBoolean;
    GetValue(element: CmiElement2004): string;
    SetValue(element: CmiElement2004, value: string): ScormBoolean;
    Commit(param: ""): ScormBoolean;
    GetLastError(): string;
    GetErrorString(errorCode: keyof typeof CMIErrorCodes): string;
    GetDiagnostic(errorCode: keyof typeof CMIErrorCodes): string;
}

export type CmiElement2004 =
    | "cmi._version"
    | "cmi.completion_status"
    | "cmi.completion_threshold"
    | "cmi.credit"
    | "cmi.entry"
    | "cmi.exit"
    | "cmi.launch_data"
    | "cmi.learner_id"
    | "cmi.learner_name"
    | "cmi.location"
    | "cmi.max_time_allowed"
    | "cmi.mode"
    | "cmi.progress_measure"
    | "cmi.scaled_passing_score"
    | "cmi.score.scaled"
    | "cmi.score.raw"
    | "cmi.score.min"
    | "cmi.score.max"
    | "cmi.session_time"
    | "cmi.success_status"
    | "cmi.suspend_data"
    | "cmi.time_limit_action"
    | "cmi.total_time"
    | string;

export type Scorm2004CompletionStatus = "completed" | "incomplete" | "not attempted" | "unknown";
export type Scorm2004SuccessStatus = "passed" | "failed" | "unknown";
export type Scorm2004Exit = "time-out" | "suspend" | "logout" | "normal" | "";

export interface CMI2004 {
    readonly _version: string;
    completion_status: Scorm2004CompletionStatus;
    readonly completion_threshold: string;
    readonly credit: "credit" | "no-credit";
    readonly entry: "ab-initio" | "resume" | "";
    exit: Scorm2004Exit;
    readonly launch_data: string;
    readonly learner_id: string;
    readonly learner_name: string; // Format językowy (np. {lang=en}Name)
    location: string; // Odpowiednik lesson_location z 1.2
    readonly max_time_allowed: string; // Format ISO 8601 (PT1H30M)
    readonly mode: "browse" | "normal" | "review";
    progress_measure: string; // Liczba 0.0 do 1.0
    readonly scaled_passing_score: string;
    score: {
        scaled: string; // -1.0 do 1.0
        raw: string;
        min: string;
        max: string;
    };
    session_time: string; // Format ISO 8601 (PT1H5M)
    success_status: Scorm2004SuccessStatus;
    suspend_data: string; // Zwiększony limit znaków (64,000)
    readonly time_limit_action: string;
    readonly total_time: string; // Format ISO 8601

    // Złożone obiekty tablicowe (uproszczone)
    comments_from_learner: Array<{ comment: string; location: string; timestamp: string }>;
    comments_from_lms: Array<{ comment: string; location: string; timestamp: string }>;

    interactions: {
        [n: number]: {
            id: string;
            type: "true-false" | "choice" | "fill-in" | "long-fill-in" | "likert" | "matching" | "performance" | "sequencing" | "numeric" | "other";
            objectives: Array<{ id: string }>;
            timestamp: string;
            correct_responses: Array<{ pattern: string }>;
            weighting: string;
            learner_response: string;
            result: "correct" | "incorrect" | "unanticipated" | "neutral" | string; // lub wartość numeryczna
            latency: string;
            description: string;
        };
        _count: string;
    };

    learner_preference: {
        audio_level: string;
        audio_captioning: string;
        delivery_speed: string;
        language: string;
    };
}
