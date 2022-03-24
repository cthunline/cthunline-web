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

import { useAuth } from './Auth';
import useSession from '../hooks/useSession';
import useSketch from '../hooks/play/useSketch';
import useLogs from '../hooks/play/useLogs';
import useAudio from '../hooks/play/useAudio';
import useDice from '../hooks/play/useDice';
import useUsers from '../hooks/play/useUsers';
import {
    User,
    PlaySocket,
    PlayLog,
    DicesRequest,
    SessionUser,
    AudioData,
    Asset,
    SketchData
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
    sketchData: SketchData;
    addSketchDrawPath: (path: string) => void;
    undoSketch: () => void;
    clearSketch: () => void;
    addSketchImage: (url: string) => void;
    deleteSketchImage: (index: number) => void;
    setSketchData: React.Dispatch<React.SetStateAction<SketchData>>;
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
    sketchData: {
        paths: [],
        images: [],
        events: []
    },
    addSketchDrawPath: () => {},
    undoSketch: () => {},
    clearSketch: () => {},
    addSketchImage: () => {},
    deleteSketchImage: () => {},
    setSketchData: () => {},
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
    const [socket, setSocket] = useState<PlaySocket | null>(
        defaultPlayData.socket
    );

    const { user } = useAuth();
    const { session } = useSession({ sessionId });
    const { logs, pushLog } = useLogs();
    const {
        users,
        setUsers,
        updateUserCharacter,
        characterUpdate
    } = useUsers(socket);
    const { getDiceResultLog, requestDice } = useDice(socket);
    const {
        audioData,
        setAudioTrack,
        clearAudioTrack,
        playAudio,
        stopAudio
    } = useAudio(socket);
    const {
        sketchData,
        setSketchData,
        isSketchDisplayed,
        setIsSketchDisplayed,
        isFreeDrawing,
        setIsFreeDrawing,
        addSketchDrawPath,
        addSketchImage,
        deleteSketchImage,
        undoSketch,
        clearSketch
    } = useSketch();

    const bindSocketEvents = useCallback((sock: PlaySocket) => {
        sock.on('connect_error', (/* { message } */) => {
            toast.error('Socket connection error');
            // console.error(message);
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
            pushLog(sockUser, isMaster, 'joined the session');
            setUsers(sessionUsers);
        });
        sock.on('leave', ({ user: sockUser, users: sessionUsers, isMaster }) => {
            pushLog(sockUser, isMaster, 'left the session');
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
                sockUser,
                isMaster,
                getDiceResultLog(
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
            pushLog(sockUser, isMaster, `edited character ${character.name}`);
            updateUserCharacter(sockUser.id, character);
        });
        sock.on('audioPlay', ({ asset, time }) => {
            setAudioTrack(asset, time);
        });
        sock.on('audioStop', () => {
            clearAudioTrack();
        });
    }, [
        pushLog,
        updateUserCharacter,
        setAudioTrack,
        clearAudioTrack,
        getDiceResultLog,
        setUsers
    ]);

    const connectSocket = useCallback(({
        sessionId: sessId,
        isMaster,
        characterId: charId
    }: ConnectOptions): PlaySocket => {
        const sock = io({
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
        sketchData,
        addSketchDrawPath,
        setSketchData,
        undoSketch,
        clearSketch,
        addSketchImage,
        deleteSketchImage,
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
        sketchData,
        setSketchData,
        addSketchDrawPath,
        undoSketch,
        clearSketch,
        addSketchImage,
        deleteSketchImage,
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
