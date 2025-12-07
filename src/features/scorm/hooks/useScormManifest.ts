import { useState } from "react";

import { ScormParser } from "../../../utils/ScormParser";
import type { ScormManifest } from "../api/scorm.manifest.types.ts";

const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const useScormManifest = () => {
    const [manifest, setManifest] = useState<ScormManifest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const parseManifestFile = async (file: File) => {
        try {
            const xmlContent: string = await file.text();
            const parsedManifest: ScormManifest = ScormParser.parseManifest(xmlContent);
            setManifest(parsedManifest);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse manifest');
        } finally {
            setLoading(false);
        }
    };

    const parseManifestFromUrl = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch manifest: ${response.statusText}`);
            }

            console.log('Awaiting...');
            await sleep(1000);
            console.log('Done.');

            const xmlContent: string = await response.text();
            const parsedManifest: ScormManifest = ScormParser.parseManifest(xmlContent);
            setManifest(parsedManifest);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse manifest');
        } finally {
            setLoading(false);
        }
    };

    const getLaunchUrl = (): string | null => {
        return manifest ? ScormParser.getLaunchUrl(manifest) : null;
    };

    const getLaunchableItems = () => {
        return manifest ? ScormParser.getLaunchableItems(manifest) : [];
    };

    const reload = () => {
        setError(null);
        setLoading(true);
        setManifest(null);
    }

    return {
        manifest,
        loading,
        reload,
        error,
        parseManifestFile,
        parseManifestFromUrl,
        getLaunchUrl,
        getLaunchableItems
    };
};
