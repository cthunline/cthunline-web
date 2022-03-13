import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    CircularProgress
} from '@mui/material';

import usePlay from '../../hooks/usePlay';
import PlayMenu from './PlayMenu';
import { Widget, Console } from '../../ui';

import './Play.css';

const Play = () => {
    const { sessionId, characterId } = useParams();
    const { socket, logs } = usePlay({
        sessionId,
        characterId
    });

    return socket ? (
        <Box className="play-container flex row">
            <PlayMenu isMaster={socket.isMaster} />
            <Box id="play-content" className="play-content flex column end">
                <Widget />
                <Console logs={logs} />
            </Box>
        </Box>
    ) : (
        <CircularProgress size={100} />
    );
};

export default Play;
