import type { TrainingFormat } from "../features/scorm/scorm.types";
import { TRAINING_FORMAT } from "../features/scorm/scorm.constants";

export function getTrainingVersion(version: string): TrainingFormat {
    switch(version) {
        case '1.2':
            return TRAINING_FORMAT.SCORM_1_2;

        default:
            return TRAINING_FORMAT.SCORM_2004
    }
}
