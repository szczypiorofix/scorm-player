import { type CMI12, type CMI2004, TRAINING_FORMAT } from "./api";

export interface PlayerRootState {
    meta: {
        isInitialized: boolean;
        isLoading: boolean;
        lastSaved: Date | null;
        error: string | null;
        trainingVersion: keyof typeof TRAINING_FORMAT | null;
    };
    scormData: CMI12 | CMI2004;
}
