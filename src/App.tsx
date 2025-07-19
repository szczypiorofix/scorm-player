import React, {useEffect} from 'react';

import ScormPlayer from './ScormPlayer';
import { useScormManifest } from "./hooks/useScormManifest.ts";

const App: React.FC = () => {
    const {
        manifest,
        loading,
        error,
        parseManifestFromUrl,
        getLaunchUrl
    } = useScormManifest();
    // const scormLaunchPath = "/scorm/index_lms.html";

    useEffect(() => {
        // Parse manifest from your SCORM package
        parseManifestFromUrl('/scorm/imsmanifest.xml')
            .then(() => console.log('Manifest parsed'))
            .catch(e => console.log('Error: ' + e));
    }, []);

    const launchUrl = getLaunchUrl();
    console.log(launchUrl);

    if (loading) return <div>Loading SCORM package...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!launchUrl) return <div>No launch URL found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-800">Odtwarzacz Szkoleń SCORM</h1>
                    <p className="text-slate-600 mt-2">Prototyp w React/TypeScript do uruchamiania i śledzenia postępów.</p>
                </header>
                <main>
                    { launchUrl.length > 0 &&
                    <ScormPlayer scormFilePath={'/scorm/'+launchUrl} /> }
                </main>
            </div>
        </div>
    );
}

export default App;
