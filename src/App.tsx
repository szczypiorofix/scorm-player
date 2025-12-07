import React, { useEffect } from 'react';
import ScormPlayer from './components/player/ScormPlayer';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { TRAINING_CONTAINER_FOLDER_NAME } from './shared/constants';
import { useScormManifest } from './features/scorm/hooks/useScormManifest';

function App(): React.JSX.Element {
    const {
        loading,
        error,
        parseManifestFromUrl,
        getLaunchUrl,
        manifest,
    } = useScormManifest();

    useEffect(() => {
        if (!manifest && !error) {
            parseManifestFromUrl('/scorm/imsmanifest.xml')
                .then(() => console.log('Manifest parsed'))
                .catch(e => console.log('Error: ' + e));
        }
    }, [error, manifest, parseManifestFromUrl]);

    const launchUrl = getLaunchUrl();

    return (
        <Container fixed>
            { loading && <Box mt={1} mb={1}><Alert variant="filled" severity="info">Loading SCORM package ...</Alert></Box> }
            { error && <Box mt={1} mb={1}><Alert variant="filled" severity="error">Error: {error}</Alert></Box> }
            { !loading && !launchUrl && <Box mt={1} mb={1}><Alert variant="filled" severity="error">No launch URL found.</Alert></Box> }

            <main>
                { !error && launchUrl && manifest && launchUrl.length > 0 && <ScormPlayer
                    scormFilePath={ `/${TRAINING_CONTAINER_FOLDER_NAME}/${launchUrl}`} 
                    manifest={manifest}
                /> }
            </main>
        </Container>
    );
}

export default App;
