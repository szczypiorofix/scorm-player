import type { SCORM_BOOLEAN, TRAINING_FORMAT } from "./common.constants";

export type ScormBoolean = (typeof SCORM_BOOLEAN)[keyof typeof SCORM_BOOLEAN] | boolean;

export type TrainingFormat = typeof TRAINING_FORMAT[keyof typeof TRAINING_FORMAT];
