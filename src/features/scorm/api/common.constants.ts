export const CMIErrorCodes = {
    0:   "No error",
    101: "General exception", // W SCORM 1.2 kod 10 jest często oznaczany jako 101
    201: "Invalid argument error",
    202: "Element cannot have children",
    203: "Element not an array. Cannot have count.",
    301: "Not initialized",
    401: "Not implemented error",
    402: "Invalid set value, element is a keyword",
    403: "Element is read only",
    404: "Element is write only",
    405: "Incorrect Data Type"
} as const;

export const TRAINING_FORMAT = {
    SCORM_1_2: 'SCORM_1_2',
    SCORM_2004: 'SCORM_2004',
    SCORM_2004v2: 'SCORM_2004v2',
    SCORM_2004v3: 'SCORM_2004v3',
    SCORM_2004v4: 'SCORM_2004v4',
    XAPI: 'XAPI',
} as const;

export const SCORM_BOOLEAN = {
  TRUE: "true",
  FALSE: "false",
} as const;
