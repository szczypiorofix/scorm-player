import { Scorm12API, Scorm2004API } from '../features/scorm/api';

export interface IScormPlayerProps {
    scormFilePath: string;
    manifest: ScormManifest;
}

export type Dictionary = {[key: string]: string };

declare global {
    interface Window {
        API?: Scorm12API;
        API_1484_11?: Scorm2004API;
    }
}
