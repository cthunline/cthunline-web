import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { io } from 'socket.io-client';

import useSession from '../hooks/api/useSession.js';
import useDice, {
    type DiceHookExport,
    defaultDiceHookExport
} from '../hooks/play/useDice.js';
import useLogs, {
    type LogsHookExport,
    defaultLogsHookExport
} from '../hooks/play/useLogs.js';
import useSessionUsers, {
    type SessionUsersHookExport,
    defaultSessionUsersHookExport
} from '../hooks/play/useSessionUsers.js';
import useSketch, {
    type SketchHookExport,
    defaultSketchHookExport
} from '../hooks/sketch/useSketch.js';
import { toast } from '../services/toast.js';
import type { DicesResponseBody, PlaySocket, User } from '../types/index.js';
import { useApp } from './App.js';

interface PlayProviderProps {
    children: React.ReactElement | React.ReactElement[];
    sessionId: number;
    characterId?: number;
}

interface PlayContextData
    extends SketchHookExport,
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
    const {
        sketchData,
        setSketchData,
        updateSketch,
        setSketchDisplay,
        drawingState,
        drawingColor,
        setDrawingColor,
        drawingWidth,
        setDrawingWidth,
        toggleFreeDrawing,
        toggleDrawingEraser,
        addSketchDrawPath,
        deleteSketchDrawPath,
        clearDrawings,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        addSketchText,
        updateSketchText,
        updateSketchTexts,
        changeTextColor,
        changeTextFontSize,
        duplicateText,
        deleteSketchText,
        clearTexts,
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

    const characterUpdateTimers = useRef<Record<number, number>>({});
    const characterUpdateTimerMs = 5000;

    const bindSocketEvents = useCallback(
        (sock: PlaySocket) => {
            sock.on('connect_error', () => {
                toast.error(T('page.play.error.connectionError'));
            });
            sock.on('error', ({ status }) => {
                toast.error(
                    T('page.play.error.statusError', {
                        status: status ?? ''
                    })
                );
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
                    content: t('page.play.event.reconnecting')
                });
            });
            sock.io.on('reconnect', () => {
                isConnecting.current = false;
                pushLog({
                    dateTime: true,
                    user: sock.user,
                    isMaster: sock.isMaster,
                    content: t('page.play.event.reconnected')
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
                        content: t('page.play.event.disconnected')
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
                        content: t('page.play.event.joined')
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
                        content: t('page.play.event.left')
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
                    ...rest
                }: DicesResponseBody) => {
                    pushLog({
                        dateTime,
                        user: sockUser,
                        isMaster,
                        content: getDiceResultLog(rest)
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
                        window.clearTimeout(
                            characterUpdateTimers.current[character.id]
                        );
                    }
                    characterUpdateTimers.current[character.id] =
                        window.setTimeout(() => {
                            pushLog({
                                dateTime,
                                user: sockUser,
                                isMaster,
                                content: eventText
                            });
                            delete characterUpdateTimers.current[character.id];
                        }, characterUpdateTimerMs);
                }
            );
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

    const onCtrlZ = useCallback(
        (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                undoSketch();
            }
        },
        [undoSketch]
    );

    useEffect(() => {
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
    }, [socket, user, session, sessionId, characterId, connectSocket]);

    useEffect(() => {
        if (session) {
            setSketchData({
                ...session.sketch,
                events: []
            });
        }
    }, [session, setSketchData]);

    useEffect(() => () => disconnectSocket(), [disconnectSocket]);

    useEffect(() => {
        document.addEventListener('keydown', onCtrlZ);
        return () => document.removeEventListener('keydown', onCtrlZ);
    }, [onCtrlZ]);

    const contextValue = useMemo(
        () => ({
            sessionId,
            characterId,
            socket,
            users,
            logs,
            requestDice,
            characterUpdate,
            sketchData,
            updateSketch,
            addSketchDrawPath,
            deleteSketchDrawPath,
            clearDrawings,
            undoSketch,
            clearSketch,
            addSketchImage,
            updateSketchImage,
            updateSketchImages,
            deleteSketchImage,
            addSketchText,
            updateSketchText,
            updateSketchTexts,
            changeTextColor,
            changeTextFontSize,
            duplicateText,
            deleteSketchText,
            clearTexts,
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
            drawingState,
            drawingColor,
            setDrawingColor,
            drawingWidth,
            setDrawingWidth,
            toggleFreeDrawing,
            toggleDrawingEraser
        }),
        [
            sessionId,
            characterId,
            socket,
            users,
            logs,
            requestDice,
            characterUpdate,
            sketchData,
            updateSketch,
            addSketchDrawPath,
            deleteSketchDrawPath,
            undoSketch,
            clearSketch,
            addSketchImage,
            clearDrawings,
            updateSketchImage,
            updateSketchImages,
            deleteSketchImage,
            addSketchText,
            updateSketchText,
            updateSketchTexts,
            changeTextColor,
            changeTextFontSize,
            duplicateText,
            deleteSketchText,
            clearTexts,
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
            drawingState,
            drawingColor,
            setDrawingColor,
            drawingWidth,
            setDrawingWidth,
            toggleFreeDrawing,
            toggleDrawingEraser
        ]
    );

    return (
        <PlayContext.Provider value={contextValue}>
            {children}
        </PlayContext.Provider>
    );
};

export const usePlay = () => {
    const context = useContext(PlayContext);
    if (!context) {
        throw new Error('usePlay must be used within an PlayProvider');
    }
    return context;
};
