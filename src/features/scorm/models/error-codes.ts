namespace ScormVersion11 {
    export interface ApiSignature {
        LMSInitialize(arg?: string): boolean;
        LMSFinish(arg?: string): boolean;
        LMSGetValue(element: CMIElement): string;
        LMSSetValue(element: CMIElement, value: string): string;
        LMSCommit(arg?: string): boolean;
        LMSGetLastError(): keyof typeof CMIErrorCodes;
        LMSGetErrorString(errorCode : keyof typeof CMIErrorCodes): string;
        LMSGetDiagnostic(errorCode: keyof typeof CMIErrorCodes): string;
    }

    const CMIStaticElements = [
        "cmi.core._children",
        "cmi.core.student_id",
        "cmi.core.student_name",
        "cmi.core.lesson_location",
        "cmi.core.credit",
        "cmi.core.lesson_status",
        "cmi.core.entry",
        "cmi.core.score._children",
        "cmi.core.score.raw",
        "cmi.core.score.max",
        "cmi.core.score.min",
        "cmi.core.total_time",
        "cmi.core.lesson_mode",
        "cmi.core.exit",
        "cmi.core.session_time",
        "cmi.suspend_data",
        "cmi.launch_data",
        "cmi.comments",
        "cmi.comments_from_lms",
        "cmi.objectives._children",
        "cmi.objectives._count",
        "cmi.student_data._children",
        "cmi.student_data.mastery_score",
        "cmi.student_data.max_time_allowed",
        "cmi.student_data.time_limit_action",
        "cmi.student_preference._children",
        "cmi.student_preference.audio",
        "cmi.student_preference.language",
        "cmi.student_preference.speed",
        "cmi.student_preference.text",
        "cmi.interactions._children",
        "cmi.interactions._count",
    ] as const;

    type CMIStaticElement = typeof CMIStaticElements[number];

    type ObjectiveProperty =
        | "id"
        | "score._children"
        | "score.raw"
        | "score.min"
        | "score.max"
        | "status";

    type CMIObjectiveElement = `cmi.objectives.${number}.${ObjectiveProperty}`;

    type InteractionProperty =
        | "id"
        | "objectives._count"
        | `objectives.${number}.id`
        | "time"
        | "type"
        | "correct_responses._count"
        | `correct_responses.${number}.pattern`
        | "weighting"
        | "student_response"
        | "result"
        | "latency";

    type CMIInteractionElement = `cmi.interactions.${number}.${InteractionProperty}`;

    export type CMIElement = CMIStaticElement | CMIObjectiveElement | CMIInteractionElement;

    export const CMIAllElementsForValidation: CMIElement[] = [
        ...CMIStaticElements,
        "cmi.objectives.0.id",
        "cmi.objectives.0.status",
        "cmi.interactions.0.id",
        "cmi.interactions.0.result",
    ];


}
