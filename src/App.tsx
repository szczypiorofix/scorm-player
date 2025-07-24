import React, { useEffect } from 'react';

import { useScormManifest } from "./hooks/useScormManifest";

import ScormPlayer from './components/player/ScormPlayer';
import { Header } from "./components/header/Header";
import { AppStyled } from "./App.style";
import { Notification } from "./components/notification/Notification";
import { NotificationType } from "./shared/NotificationType";

function App(): React.JSX.Element {
    const {
        loading,
        error,
        parseManifestFromUrl,
        getLaunchUrl,
        manifest,
    } = useScormManifest();

    useEffect(() => {
        if (!manifest && !loading && !error) {
            parseManifestFromUrl('/scorm/imsmanifest.xml')
                .then(() => {
                    console.log('Manifest parsed');
                })
                .catch(e => console.log('Error: ' + e));
        }
    }, [error, loading, manifest, parseManifestFromUrl]);

    const launchUrl = getLaunchUrl();

    return (
        <AppStyled>
            <Header />
            { loading && <Notification message={"Loading SCORM package..."} type={NotificationType.INFO} /> }
            { error && <Notification message={"Error: " + error} type={NotificationType.ERROR} /> }
            { !loading && !launchUrl && <Notification message={"No launch URL found"} type={NotificationType.ERROR}/> }
            <main>
                { launchUrl && launchUrl.length > 0 &&
                <ScormPlayer scormFilePath={'/scorm/'+launchUrl} /> }
            </main>
        </AppStyled>
    );
}

export default App;
