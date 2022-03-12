import {
    useState,
    useCallback
} from 'react';
import { io, Socket } from 'socket.io-client';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';

interface ConnectOptions {
    sessionId: string;
    characterId: string;
}

const usePlay = () => {
    const { bearer } = useAuth();

    const [socket, setSocket] = useState<Socket>();

    const connectSocket = useCallback(({
        sessionId,
        characterId
    } : ConnectOptions) => {
        setSocket(
            io(Api.baseUrl, {
                auth: {
                    token: bearer
                },
                query: {
                    sessionId,
                    characterId
                }
            })
        );
    }, [
        bearer
    ]);

    return {
        socket,
        connectSocket
    };
};

export default usePlay;
