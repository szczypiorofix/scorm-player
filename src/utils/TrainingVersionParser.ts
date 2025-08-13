import { TRAINING_FORMAT } from "../shared/constants";
import type { TrainingFormat } from "../shared/types";

export function getTrainingVersion(version: string): TrainingFormat {
    switch(version) {
        case '1.2':
            return TRAINING_FORMAT.SCORM_1_2;

        default:
            return TRAINING_FORMAT.SCORM_2004
    }
}
