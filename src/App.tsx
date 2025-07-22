import React, { useEffect, useState } from 'react';

import ScormPlayer from './ScormPlayer';
import { useScormManifest } from "./hooks/useScormManifest";

import './App.scss';

const App: React.FC = () => {
    const [parsed, setParsed] = useState(false);
    const {
        loading,
        error,
        parseManifestFromUrl,
        getLaunchUrl
    } = useScormManifest();

    useEffect(() => {
        if (!parsed) {
            parseManifestFromUrl('/scorm/imsmanifest.xml')
                .then(() => {
                    console.log('Manifest parsed');
                    setParsed(true);
                })
                .catch(e => console.log('Error: ' + e));
        }
    }, [parsed, parseManifestFromUrl]);

    const launchUrl = getLaunchUrl();

    if (loading) return <div>Loading SCORM package...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!launchUrl) return <div>No launch URL found</div>;

    console.log(launchUrl);

    return (
        <div className={"container"}>
            <header>
                <h1>Odtwarzacz Szkoleń SCORM</h1>
                <p>Prototyp w React/TypeScript do uruchamiania i śledzenia postępów.</p>
            </header>
            {}
            <div>

            </div>
            <main>
                { launchUrl.length > 0 &&
                <ScormPlayer scormFilePath={'/scorm/'+launchUrl} /> }
            </main>
        </div>
    );
}

export default App;
