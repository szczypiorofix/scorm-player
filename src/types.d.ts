export interface IScormState {
    'cmi.core.lesson_status': 'nie rozpoczęto' | 'incomplete' | 'completed' | 'passed' | 'failed' | 'browsed';
    'cmi.core.score.raw': string;
    'isInitialized': boolean;
}

export interface IScormApi {
    LMSInitialize: (param: string) => "true" | "false";
    LMSFinish: (param: string) => "true" | "false";
    LMSGetValue: (key: string) => string;
    LMSSetValue: (key: string, value: any) => "true" | "false";
    LMSCommit: (param: string) => "true" | "false";
    LMSGetLastError: () => string;
    LMSGetErrorString: (errorCode: string) => string;
    LMSGetDiagnostic: (errorCode: string) => string;
}

export interface IScormPlayerProps {
    scormFilePath: string;
}

export interface ScormManifest {
    identifier: string;
    version: string;
    title: string;
    description?: string;
    organizations: Organization[];
    resources: Resource[];
    defaultOrganization?: string;
}

export interface Organization {
    identifier: string;
    title: string;
    items: Item[];
}

export interface Item {
    identifier: string;
    title: string;
    identifierref?: string;
    items?: Item[];
}

export interface Resource {
    identifier: string;
    type: string;
    href: string;
    files: string[];
}

declare global {
    interface Window {
        API?: IScormApi;
        API_1484_11?: IScormApi;
    }
}
