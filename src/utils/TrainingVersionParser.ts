import { TRAINING_FORMAT, type TrainingFormat } from "../features/scorm/api";

export function getTrainingVersion(version: string): TrainingFormat {
    switch(version) {
        case '1.2':
            return TRAINING_FORMAT.SCORM_1_2;

        default:
            return TRAINING_FORMAT.SCORM_2004
    }
}
