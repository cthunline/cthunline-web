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

import { useApp } from './App';
import useSession from '../hooks/useSession';
import useSketch, { SketchHookExport, defaultSketchHookExport } from '../hooks/play/useSketch';
import useLogs, { LogsHookExport, defaultLogsHookExport } from '../hooks/play/useLogs';
import useAudio, { AudioHookExport, defaultAudioHookExport } from '../hooks/play/useAudio';
import useDice, { DiceHookExport, defaultDiceHookExport } from '../hooks/play/useDice';
import useUsers, { UsersHookExport, defaultUsersHookExport } from '../hooks/play/useUsers';
import { User, PlaySocket } from '../../types';

interface PlayProviderProps {
    children: JSX.Element | JSX.Element[];
    sessionId: number;
    characterId?: number;
}

interface PlayContextData extends
    SketchHookExport,
    AudioHookExport,
    DiceHookExport,
    UsersHookExport,
    LogsHookExport {
    sessionId: number;
    characterId?: number;
    socket: PlaySocket | null;
}

const defaultPlayData: PlayContextData = {
    sessionId: 0,
    socket: null,
    ...defaultSketchHookExport,
    ...defaultLogsHookExport,
    ...defaultAudioHookExport,
    ...defaultDiceHookExport,
    ...defaultUsersHookExport
};

interface ConnectOptions {
    sessionId: number;
    isMaster: boolean;
    characterId?: number;
}

const socketIoConnectOptions = {
    withCredentials: true,
    timeout: 3000,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 1000,
    reconnectionAttempts: 10
};

const PlayContext = createContext<PlayContextData>(defaultPlayData);

export const PlayProvider:React.FC<PlayProviderProps> = ({
    sessionId,
    characterId,
    children
}) => {
    const [socket, setSocket] = useState<PlaySocket | null>(
        defaultPlayData.socket
    );

    const { T, t, user } = useApp();
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
        setSketchDisplay,
        isFreeDrawing,
        setIsFreeDrawing,
        addSketchDrawPath,
        clearDrawings,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        addSketchToken,
        addSketchUserTokens,
        updateSketchTokens,
        assignTokenUser,
        unassignTokenUser,
        duplicateToken,
        changeTokenColor,
        deleteSketchToken,
        clearTokens,
        undoSketch,
        clearSketch
    } = useSketch(socket);

    const isConnecting = useRef(false);

    const bindSocketEvents = useCallback((sock: PlaySocket) => {
        sock.on('connect_error', () => {
            toast.error(T('page.play.error.connectionError'));
        });
        sock.on('error', ({ status }) => {
            toast.error(T('page.play.error.statusError', { status }));
        });
        sock.on('connect', () => {
            isConnecting.current = false;
            setSocket(sock);
        });
        sock.io.on('reconnect_attempt', () => {
            isConnecting.current = true;
            pushLog(sock.user, sock.isMaster, t('page.play.event.reconnecting'));
        });
        sock.io.on('reconnect', () => {
            isConnecting.current = false;
            pushLog(sock.user, sock.isMaster, t('page.play.event.reconnected'));
        });
        sock.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                setSocket(null);
            } else {
                pushLog(sock.user, sock.isMaster, t('page.play.event.disconnected'));
            }
        });
        sock.on('join', ({ user: sockUser, users: sessionUsers, isMaster }) => {
            pushLog(sockUser, isMaster, t('page.play.event.joined'));
            setUsers(sessionUsers);
        });
        sock.on('leave', ({ user: sockUser, users: sessionUsers, isMaster }) => {
            pushLog(sockUser, isMaster, t('page.play.event.left'));
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
            const eventText = t('page.play.event.editedCharacter', {
                name: character.name
            });
            pushLog(sockUser, isMaster, eventText);
            updateUserCharacter(sockUser.id, character);
        });
        sock.on('audioPlay', ({ asset, time }) => {
            setAudioTrack(asset, time);
        });
        sock.on('audioStop', () => {
            clearAudioTrack();
        });
        sock.on('sketchUpdate', ({ sketch }) => {
            setSketchData(sketch);
        });
    }, [
        t,
        T,
        pushLog,
        updateUserCharacter,
        setAudioTrack,
        clearAudioTrack,
        getDiceResultLog,
        setUsers,
        setSketchData
    ]);

    const connectSocket = useCallback(({
        sessionId: sessId,
        isMaster,
        characterId: charId
    }: ConnectOptions): PlaySocket => {
        const sock = io({
            ...socketIoConnectOptions,
            query: {
                sessionId: sessId,
                characterId: charId
            }
        }) as PlaySocket;
        sock.user = user as User;
        sock.sessionId = Number(sessId);
        sock.isMaster = isMaster;
        sock.characterId = Number(charId);
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

    useEffect(() => {
        (async () => {
            if (
                (!socket || !socket.connected)
                && !isConnecting.current
                && sessionId
                && session
            ) {
                isConnecting.current = true;
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
        socket,
        user,
        session,
        sessionId,
        characterId,
        connectSocket,
        setSketchData
    ]);

    useEffect(() => {
        if (session) {
            setSketchData(session.sketch);
        }
    }, [
        session,
        setSketchData
    ]);

    useEffect(() => (
        () => disconnectSocket()
    ), [
        disconnectSocket
    ]);

    const contextValue = useMemo(() => ({
        sessionId,
        characterId,
        socket,
        users,
        logs,
        requestDice,
        characterUpdate,
        playAudio,
        stopAudio,
        audioData,
        sketchData,
        addSketchDrawPath,
        clearDrawings,
        undoSketch,
        clearSketch,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        addSketchToken,
        addSketchUserTokens,
        updateSketchTokens,
        assignTokenUser,
        unassignTokenUser,
        duplicateToken,
        changeTokenColor,
        deleteSketchToken,
        clearTokens,
        setSketchDisplay,
        isFreeDrawing,
        setIsFreeDrawing
    }), [
        sessionId,
        characterId,
        socket,
        users,
        logs,
        requestDice,
        characterUpdate,
        playAudio,
        stopAudio,
        audioData,
        sketchData,
        addSketchDrawPath,
        undoSketch,
        clearSketch,
        addSketchImage,
        clearDrawings,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        addSketchToken,
        addSketchUserTokens,
        updateSketchTokens,
        assignTokenUser,
        unassignTokenUser,
        duplicateToken,
        changeTokenColor,
        deleteSketchToken,
        clearTokens,
        setSketchDisplay,
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
