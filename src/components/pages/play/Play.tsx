import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    CircularProgress
} from '@mui/material';

import usePlay from '../../hooks/usePlay';
import PlayMenu from './PlayMenu';
import { Console } from '../../ui';

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
            <Box className="play-content flex column end">
                <Console logs={logs} />
            </Box>
        </Box>
    ) : (
        <CircularProgress size={100} />
    );
};

export default Play;
