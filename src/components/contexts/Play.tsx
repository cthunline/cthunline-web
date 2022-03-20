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
    DicesRequest,
    SessionUser,
    Character,
    AudioData,
    Asset
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
    users: SessionUser[];
    disconnectSocket: () => void;
    logs: PlayLog[];
    requestDice: (request: DicesRequest, isPrivate: boolean) => void;
    characterUpdate: () => void;
    playAudio: (asset: Asset, time: number) => void;
    stopAudio: () => void;
    audioData: AudioData | null;
    isSketchDisplayed: boolean;
    setIsSketchDisplayed: (value: boolean) => void;
    isFreeDrawing: boolean;
    setIsFreeDrawing: (value: boolean) => void;
}

const defaultPlayData: PlayContextData = {
    sessionId: '',
    socket: null,
    users: [],
    disconnectSocket: () => {},
    logs: [],
    requestDice: () => {},
    characterUpdate: () => {},
    playAudio: () => {},
    stopAudio: () => {},
    audioData: null,
    isSketchDisplayed: false,
    setIsSketchDisplayed: () => {},
    isFreeDrawing: false,
    setIsFreeDrawing: () => {}
};

interface ConnectOptions {
    sessionId: string;
    isMaster: boolean;
    characterId?: string;
}

const PlayContext = createContext<PlayContextData>(defaultPlayData);

export const PlayProvider:React.FC<PlayProviderProps> = ({
    sessionId,
    characterId,
    children
}) => {
    const { user } = useAuth();
    const { session } = useSession({
        sessionId
    });

    const [socket, setSocket] = useState<PlaySocket | null>(null);
    const [users, setUsers] = useState<SessionUser[]>([]);
    const [audioData, setAudioData] = useState<AudioData | null>(null);
    const [logs, setLogs] = useState<PlayLog[]>([]);
    const [isSketchDisplayed, setIsSketchDisplayed] = useState<boolean>(false);
    const [isFreeDrawing, setIsFreeDrawing] = useState<boolean>(false);

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

    const updateUserCharacter = useCallback((userId: string, character: Character) => {
        setUsers((previous) => (
            previous.map((sessionUser: SessionUser) => (
                sessionUser.id === userId ? {
                    ...sessionUser,
                    character
                } : sessionUser
            ))
        ));
    }, []);

    const bindSocketEvents = useCallback((sock: PlaySocket) => {
        sock.on('connect_error', (/* { message } */) => {
            toast.error('Socket connection error');
            // console.log(message);
        });
        sock.on('error', ({ status }) => {
            toast.error(`Socket ${status} error`);
        });
        sock.on('connect', () => {
            setSocket(sock);
        });
        sock.on('disconnect', () => {
            setSocket(null);
        });
        sock.on('join', ({ user: sockUser, users: sessionUsers, isMaster }) => {
            pushLog(`${getLogUsername(sockUser, isMaster)} joined the session`);
            setUsers(sessionUsers);
        });
        sock.on('leave', ({ user: sockUser, users: sessionUsers, isMaster }) => {
            pushLog(`${getLogUsername(sockUser, isMaster)} left the session`);
            setUsers(sessionUsers);
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
            updateUserCharacter(sockUser.id, character);
        });
        sock.on('audioPlay', ({ asset, time }) => {
            setAudioData({
                ...asset,
                time,
                playing: true
            });
        });
        sock.on('audioStop', () => {
            setAudioData(null);
        });
    }, [
        pushLog,
        getDiceResultLog,
        getLogUsername,
        updateUserCharacter
    ]);

    const connectSocket = useCallback(({
        sessionId: sessId,
        isMaster,
        characterId: charId
    }: ConnectOptions): PlaySocket => {
        const sock = io(Api.baseUrl, {
            query: {
                sessionId: sessId,
                characterId: charId
            },
            withCredentials: true
        }) as PlaySocket;
        sock.user = user as User;
        sock.sessionId = sessId;
        sock.isMaster = isMaster;
        sock.characterId = charId;
        bindSocketEvents(sock);
        return sock;
    }, [
        user,
        bindSocketEvents
    ]);

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
    }, [
        socket
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

    const playAudio = useCallback((asset: Asset, time: number) => {
        socket?.emit('audioPlay', {
            assetId: asset.id,
            time
        });
    }, [
        socket
    ]);

    const stopAudio = useCallback(() => {
        socket?.emit('audioStop');
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
        users,
        disconnectSocket,
        logs,
        requestDice,
        characterUpdate,
        playAudio,
        stopAudio,
        audioData,
        isSketchDisplayed,
        setIsSketchDisplayed,
        isFreeDrawing,
        setIsFreeDrawing
    }), [
        sessionId,
        characterId,
        socket,
        users,
        disconnectSocket,
        logs,
        requestDice,
        characterUpdate,
        playAudio,
        stopAudio,
        audioData,
        isSketchDisplayed,
        setIsSketchDisplayed,
        isFreeDrawing,
        setIsFreeDrawing
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
