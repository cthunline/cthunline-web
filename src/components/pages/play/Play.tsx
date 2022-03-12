import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import usePlay from '../../hooks/usePlay';

const Play = () => {
    const { sessionId, characterId } = useParams();
    const { socket, connectSocket } = usePlay();

    useEffect(() => {
        if (sessionId && characterId) {
            connectSocket({
                sessionId,
                characterId
            });
        }
    }, [
        sessionId,
        characterId,
        connectSocket
    ]);

    return socket ? (
        <>Connected</>
    ) : (
        <CircularProgress size={100} />
    );
};

export default Play;
