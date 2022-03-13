import {
    useState,
    useCallback,
    useEffect
} from 'react';
import { io } from 'socket.io-client';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import useSession from './useSession';
import { PlaySocket, PlayLog } from '../../types';

interface PlayHooksOptions {
    sessionId?: string;
    characterId?: string;
}

interface ConnectOptions {
    sessionId: string;
    isMaster: boolean;
    characterId?: string;
}

const usePlay = ({
    sessionId,
    characterId
}: PlayHooksOptions) => {
    const { user, bearer } = useAuth();
    const { session } = useSession({
        sessionId
    });

    const [socket, setSocket] = useState<PlaySocket | null>(null);
    const [logs, setLogs] = useState<PlayLog[]>([]);

    const pushLog = useCallback((text: string) => {
        setLogs((previous) => {
            previous.push({
                date: new Date(),
                text
            });
            return previous.slice(-100);
        });
    }, []);

    const bindSocketEvents = useCallback((sock: PlaySocket) => {
        sock.on('connect', () => {
            pushLog(`${user?.name} joined the session`);
            setSocket(sock);
        });
        sock.on('disconnect', () => {
            pushLog(`${user?.name} left the session`);
            setSocket(null);
        });
    }, [
        pushLog,
        user
    ]);

    const connectSocket = useCallback(({
        sessionId: sessId,
        isMaster,
        characterId: charId
    }: ConnectOptions): PlaySocket => {
        const sock = io(Api.baseUrl, {
            auth: {
                token: bearer
            },
            query: {
                sessionId: sessId,
                characterId: charId
            }
        }) as PlaySocket;
        sock.sessionId = sessId;
        sock.isMaster = isMaster;
        sock.characterId = charId;
        bindSocketEvents(sock);
        return sock;
    }, [
        bearer,
        bindSocketEvents
    ]);

    useEffect(() => {
        (async () => {
            if (session && !socket && sessionId) {
                const isMaster = session.masterId === user?.id;
                setSocket(
                    connectSocket({
                        sessionId,
                        isMaster,
                        characterId
                    })
                );
            }
        })();
    }, [
        user,
        session,
        socket,
        sessionId,
        characterId,
        connectSocket
    ]);

    return {
        socket,
        logs
    };
};

export default usePlay;
