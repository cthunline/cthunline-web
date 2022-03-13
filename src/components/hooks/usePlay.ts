import {
    useState,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { io } from 'socket.io-client';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import useSession from './useSession';
import { User, PlaySocket, PlayLog } from '../../types';

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
        setLogs((previous) => (
            [...previous, {
                date: new Date(),
                text
            }].slice(-100)
        ));
    }, []);

    const getLogUserName = (logUser: User, isMaster: boolean) => (
        `[${isMaster ? 'GM ' : ''}${logUser?.name}]`
    );

    const bindSocketEvents = useCallback((sock: PlaySocket) => {
        sock.on('connect', () => {
            pushLog(`${getLogUserName(sock.user, sock.isMaster)} joined the session`);
            setSocket(sock);
        });
        sock.on('disconnect', () => {
            pushLog(`${user?.name} left the session`);
            setSocket(null);
        });
        sock.on('join', ({ user: joinUser, isMaster }) => {
            pushLog(`${getLogUserName(joinUser, isMaster)} joined the session`);
        });
        sock.on('leave', ({ user: joinUser, isMaster }) => {
            pushLog(`${getLogUserName(joinUser, isMaster)} left the session`);
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
        sock.user = user as User;
        sock.sessionId = sessId;
        sock.isMaster = isMaster;
        sock.characterId = charId;
        bindSocketEvents(sock);
        return sock;
    }, [
        user,
        bearer,
        bindSocketEvents
    ]);

    const initialConnection = useRef(true);
    useEffect(() => {
        (async () => {
            if (initialConnection.current && session && sessionId) {
                initialConnection.current = false;
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
