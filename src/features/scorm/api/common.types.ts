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
