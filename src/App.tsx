import { type JSX, useEffect, useState } from 'react';
import ScormPlayer from './components/player/ScormPlayer';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ToolBar } from './components/toolbar/ToolBar';
import { TRAINING_CONTAINER_FOLDER_NAME } from './shared/constants';
import { useScormManifest } from './features/scorm/hooks/useScormManifest';
import { CustomButton } from "./components/button/CustomButton.tsx";

function App(): JSX.Element {
    const {
        loading,
        error,
        reload,
        parseManifestFromUrl,
        getLaunchUrl,
        manifest,
    } = useScormManifest();
    const [launch, setLaunch] = useState<boolean>(false);

    useEffect(() => {
        if (!manifest && !error && launch) {
            parseManifestFromUrl('/scorm/imsmanifest.xml')
                .then(() => console.log('Manifest parsed'))
                .catch(e => console.log('Error: ' + e))
                .finally(() => {
                    setLaunch(false);
                });
        }
    }, [launch, error, manifest, parseManifestFromUrl]);

    const reloadAll = () => {
        setLaunch(true);
        reload();
    }

    const launchUrl = getLaunchUrl();

    console.log(manifest);

    return (
        <Box>
            <ToolBar />
            <Container fixed>
                <Box component={'div'}  >
                    <Box component={'div'}>
                        <Typography variant={'h5'}>Application</Typography>
                    </Box>
                    <Box>
                        <CustomButton onClick={reloadAll} disabled={launch}>LAUNCH</CustomButton>
                    </Box>
                </Box>
                { launch && loading && <Box mt={1} mb={1}>
                    <Alert variant="filled" severity="info">Loading SCORM package ...</Alert>
                </Box> }
                { error && <Box mt={1} mb={1}>
                    <Alert variant="filled" severity="error">Error: {error}</Alert>
                </Box> }
                { !loading && !launchUrl && <Box mt={1} mb={1}>
                    <Alert variant="filled" severity="error">No launch URL found.</Alert>
                </Box> }

                <main>
                    { !error && launchUrl && manifest && launchUrl.length > 0 && <ScormPlayer
                        scormFilePath={ `/${TRAINING_CONTAINER_FOLDER_NAME}/${launchUrl}`}
                        manifest={manifest}
                    /> }
                </main>
            </Container>
        </Box>
    );
}

export default App;
