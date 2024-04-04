import { io } from 'socket.io-client';
import {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
    useRef,
    useMemo
} from 'react';

import { type User, type PlaySocket } from '../../types';
import useSession from '../hooks/useSession';
import { toast } from '../../services/toast';
import { useApp } from './App';
import useSketch, {
    type SketchHookExport,
    defaultSketchHookExport
} from '../hooks/play/useSketch';
import useLogs, {
    type LogsHookExport,
    defaultLogsHookExport
} from '../hooks/play/useLogs';
import useAudio, {
    type AudioHookExport,
    defaultAudioHookExport
} from '../hooks/play/useAudio';
import useDice, {
    type DiceHookExport,
    defaultDiceHookExport
} from '../hooks/play/useDice';
import useSessionUsers, {
    type SessionUsersHookExport,
    defaultSessionUsersHookExport
} from '../hooks/play/useSessionUsers';

interface PlayProviderProps {
    children: JSX.Element | JSX.Element[];
    sessionId: number;
    characterId?: number;
}

interface PlayContextData
    extends SketchHookExport,
        AudioHookExport,
        DiceHookExport,
        SessionUsersHookExport,
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
    ...defaultSessionUsersHookExport
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

export const PlayProvider = ({
    sessionId,
    characterId,
    children
}: PlayProviderProps) => {
    const [socket, setSocket] = useState<PlaySocket | null>(
        defaultPlayData.socket
    );

    const { T, t, user } = useApp();
    const { session } = useSession({ sessionId });
    const { logs, pushLog } = useLogs();
    const { users, setUsers, updateUserCharacter, characterUpdate } =
        useSessionUsers(socket);
    const { getDiceResultLog, requestDice } = useDice(socket);
    const { audioData, setAudioTrack, clearAudioTrack, playAudio, stopAudio } =
        useAudio(socket);
    const {
        sketchData,
        setSketchData,
        updateSketch,
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
        updateMovingToken,
        attachTokenData,
        unattachTokenData,
        duplicateToken,
        changeTokenColor,
        deleteSketchToken,
        clearTokens,
        undoSketch,
        clearSketch
    } = useSketch(socket);

    const isConnecting = useRef(false);

    const characterUpdateTimers = useRef<Record<number, NodeJS.Timeout>>({});
    const characterUpdateTimerMs = 5000;

    const bindSocketEvents = useCallback(
        (sock: PlaySocket) => {
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
                pushLog({
                    dateTime: true,
                    user: sock.user,
                    isMaster: sock.isMaster,
                    text: t('page.play.event.reconnecting')
                });
            });
            sock.io.on('reconnect', () => {
                isConnecting.current = false;
                pushLog({
                    dateTime: true,
                    user: sock.user,
                    isMaster: sock.isMaster,
                    text: t('page.play.event.reconnected')
                });
            });
            sock.on('disconnect', (reason) => {
                if (reason === 'io server disconnect') {
                    setSocket(null);
                } else {
                    pushLog({
                        dateTime: true,
                        user: sock.user,
                        isMaster: sock.isMaster,
                        text: t('page.play.event.disconnected')
                    });
                }
            });
            sock.on(
                'join',
                ({
                    dateTime,
                    user: sockUser,
                    users: sessionUsers,
                    isMaster
                }) => {
                    pushLog({
                        dateTime,
                        user: sockUser,
                        isMaster,
                        text: t('page.play.event.joined')
                    });
                    setUsers(sessionUsers);
                }
            );
            sock.on(
                'leave',
                ({
                    dateTime,
                    user: sockUser,
                    users: sessionUsers,
                    isMaster
                }) => {
                    pushLog({
                        dateTime,
                        user: sockUser,
                        isMaster,
                        text: t('page.play.event.left')
                    });
                    setUsers(sessionUsers);
                }
            );
            sock.on(
                'diceResult',
                ({
                    dateTime,
                    user: sockUser,
                    isMaster,
                    isPrivate,
                    request,
                    result
                }) => {
                    pushLog({
                        dateTime,
                        user: sockUser,
                        isMaster,
                        text: getDiceResultLog(request, result, isPrivate)
                    });
                }
            );
            sock.on(
                'characterUpdate',
                ({ dateTime, user: sockUser, isMaster, character }) => {
                    const eventText = t('page.play.event.editedCharacter', {
                        name: character.name
                    });
                    updateUserCharacter(sockUser.id, character);
                    if (characterUpdateTimers.current[character.id]) {
                        clearTimeout(
                            characterUpdateTimers.current[character.id]
                        );
                    }
                    characterUpdateTimers.current[character.id] = setTimeout(
                        () => {
                            pushLog({
                                dateTime,
                                user: sockUser,
                                isMaster,
                                text: eventText
                            });
                            delete characterUpdateTimers.current[character.id];
                        },
                        characterUpdateTimerMs
                    );
                }
            );
            sock.on('audioPlay', ({ asset, time }) => {
                setAudioTrack(asset, time);
            });
            sock.on('audioStop', () => {
                clearAudioTrack();
            });
            sock.on('sketchUpdate', ({ sketch }) => {
                setSketchData((previous) => ({
                    ...sketch,
                    events: previous.events
                }));
            });
        },
        [
            t,
            T,
            pushLog,
            updateUserCharacter,
            setAudioTrack,
            clearAudioTrack,
            getDiceResultLog,
            setUsers,
            setSketchData
        ]
    );

    const connectSocket = useCallback(
        ({
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
        },
        [user, bindSocketEvents]
    );

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
    }, [socket]);

    useEffect(() => {
        (async () => {
            if (
                (!socket || !socket.connected) &&
                !isConnecting.current &&
                sessionId &&
                session
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
            setSketchData({
                ...session.sketch,
                events: []
            });
        }
    }, [session, setSketchData]);

    useEffect(() => () => disconnectSocket(), [disconnectSocket]);

    const contextValue = useMemo(
        () => ({
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
            updateSketch,
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
            updateMovingToken,
            attachTokenData,
            unattachTokenData,
            duplicateToken,
            changeTokenColor,
            deleteSketchToken,
            clearTokens,
            setSketchDisplay,
            isFreeDrawing,
            setIsFreeDrawing
        }),
        [
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
            updateSketch,
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
            updateMovingToken,
            attachTokenData,
            unattachTokenData,
            duplicateToken,
            changeTokenColor,
            deleteSketchToken,
            clearTokens,
            setSketchDisplay,
            isFreeDrawing,
            setIsFreeDrawing
        ]
    );

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
