import type { CMI12, CMI2004 } from "./api";

export interface PlayerRootState {
    meta: {
        isInitialized: boolean;
        isLoading: boolean;
        lastSaved: Date | null;
        error: string | null;
    };
    scormData: CMI12 | CMI2004;
}
