export interface IScormPlayerProps {
    scormFilePath: string;
    manifest: ScormManifest;
}

export type Dictionary = {[key: string]: string };

declare global {
    interface Window {
        API?: IScormApi;
        API_1484_11?: IScormApi2004;
    }
}
