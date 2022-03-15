import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
    useRef,
    useMemo
} from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from './Auth';
import useSession from '../hooks/useSession';
import {
    User,
    PlaySocket,
    PlayLog,
    DicesRequest
} from '../../types';

interface PlayProviderProps {
    children: JSX.Element | JSX.Element[];
    sessionId: string;
    characterId?: string;
}

interface PlayContextData {
    sessionId: string;
    characterId?: string;
    socket: PlaySocket | null;
    disconnectSocket: () => void;
    logs: PlayLog[];
    requestDice: (request: DicesRequest, isPrivate: boolean) => void;
    characterUpdate: () => void;
}

interface ConnectOptions {
    sessionId: string;
    isMaster: boolean;
    characterId?: string;
}

const defaultPlayData: PlayContextData = {
    sessionId: '',
    socket: null,
    disconnectSocket: () => {},
    logs: [],
    requestDice: () => {},
    characterUpdate: () => {}
};

const PlayContext = createContext<PlayContextData>(defaultPlayData);

export const PlayProvider:React.FC<PlayProviderProps> = ({
    sessionId,
    characterId,
    children
}) => {
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

    const getLogUsername = useCallback((logUser: User, isMaster: boolean) => (
        `[${isMaster ? 'GM ' : ''}${logUser?.name}]`
    ), []);

    const getDiceResultLog = useCallback((
        requestUser: User,
        isMaster: boolean,
        request: DicesRequest,
        result: number,
        isPrivate: boolean = false
    ) => {
        const username = getLogUsername(requestUser, isMaster);
        const requestText = Object.entries(request).map(([type, count]) => (
            `${count}${type}`
        )).join(' + ');
        const privatly = isPrivate ? 'privatly ' : '';
        return `${username} ${privatly}rolled ${requestText} and the result is ${result}`;
    }, [
        getLogUsername
    ]);

    const bindSocketEvents = useCallback((sock: PlaySocket) => {
        sock.on('connect', () => {
            pushLog(`${getLogUsername(sock.user, sock.isMaster)} joined the session`);
            setSocket(sock);
        });
        sock.on('disconnect', () => {
            pushLog(`${user?.name} left the session`);
            setSocket(null);
        });
        sock.on('error', ({ status }) => {
            toast.error(`Socket ${status} error`);
        });
        sock.on('join', ({ user: sockUser, isMaster }) => {
            pushLog(`${getLogUsername(sockUser, isMaster)} joined the session`);
        });
        sock.on('leave', ({ user: sockUser, isMaster }) => {
            pushLog(`${getLogUsername(sockUser, isMaster)} left the session`);
        });
        sock.on('diceResult', ({
            user: sockUser,
            isMaster,
            isPrivate,
            request,
            result
        }) => {
            pushLog(
                getDiceResultLog(
                    sockUser,
                    isMaster,
                    request,
                    result,
                    isPrivate
                )
            );
        });
        sock.on('characterUpdate', ({
            user: sockUser,
            isMaster,
            character
        }) => {
            pushLog(`${getLogUsername(sockUser, isMaster)} edited character ${character.name}`);
        });
    }, [
        pushLog,
        user,
        getDiceResultLog,
        getLogUsername
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

    const requestDice = useCallback((request: DicesRequest, isPrivate: boolean) => {
        socket?.emit(isPrivate ? 'dicePrivateRequest' : 'diceRequest', request);
    }, [
        socket
    ]);

    const characterUpdate = useCallback(() => {
        socket?.emit('characterUpdate');
    }, [
        socket
    ]);

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
    }, [
        socket
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

    const contextValue = useMemo(() => ({
        sessionId,
        characterId,
        socket,
        disconnectSocket,
        logs,
        requestDice,
        characterUpdate
    }), [
        sessionId,
        characterId,
        socket,
        disconnectSocket,
        logs,
        requestDice,
        characterUpdate
    ]);

    return (
        <PlayContext.Provider value={contextValue}>
            {children}
        </PlayContext.Provider>
    );
};

export function usePlay() {
    const context = useContext(PlayContext);
    if (!context) {
        throw new Error('usePlay must be used within an PlayProvider');
    }
    return context;
}
