import React, {useEffect} from 'react';

import ScormPlayer from './ScormPlayer';
import { useScormManifest } from "./hooks/useScormManifest.ts";

const App: React.FC = () => {
    const {
        loading,
        error,
        parseManifestFromUrl,
        getLaunchUrl
    } = useScormManifest();

    useEffect(() => {
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
        <div>
            <div>
                <header>
                    <h1>Odtwarzacz Szkoleń SCORM</h1>
                    <p>Prototyp w React/TypeScript do uruchamiania i śledzenia postępów.</p>
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
