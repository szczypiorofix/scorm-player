import { useState } from "react";

import { ScormParser } from "../utils/ScormParser.tsx";
import type { ScormManifest } from "../types";

export const useScormManifest = () => {
    const [manifest, setManifest] = useState<ScormManifest | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseManifestFile = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            const xmlContent = await file.text();
            const parsedManifest = ScormParser.parseManifest(xmlContent);
            setManifest(parsedManifest);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse manifest');
        } finally {
            setLoading(false);
        }
    };

    const parseManifestFromUrl = async (url: string) => {
        setLoading(true);
        setError(null);

        setTimeout( async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch manifest: ${response.statusText}`);
                }

                const xmlContent = await response.text();
                const parsedManifest = ScormParser.parseManifest(xmlContent);
                setManifest(parsedManifest);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to parse manifest');
            } finally {
                setLoading(false);
            }
        }, 2000);

    };

    const getLaunchUrl = (): string | null => {
        return manifest ? ScormParser.getLaunchUrl(manifest) : null;
    };

    const getLaunchableItems = () => {
        return manifest ? ScormParser.getLaunchableItems(manifest) : [];
    };

    return {
        manifest,
        loading,
        error,
        parseManifestFile,
        parseManifestFromUrl,
        getLaunchUrl,
        getLaunchableItems
    };
};
