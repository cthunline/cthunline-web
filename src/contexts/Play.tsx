import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useShallow } from 'zustand/react/shallow';

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
import { createSocketClient } from '../services/socket.js';
import { toast } from '../services/toast.js';
import { useAuthStore } from '../stores/auth.js';
import { useLocaleStore } from '../stores/locale.js';
import type {
    DiceAlienResponseBody,
    DiceResponseBody,
    Session,
    User
} from '../types/index.js';
import type { SocketClient } from '../types/socket.js';

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
    initialized: boolean;
    sessionId: number;
    session?: Session;
    characterId?: number;
    socket: SocketClient | null;
}

const defaultPlayData: PlayContextData = {
    initialized: false,
    sessionId: 0,
    session: undefined,
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
    const [socket, setSocket] = useState<SocketClient | null>(
        defaultPlayData.socket
    );

    const user = useAuthStore(({ user }) => user);
    const { t, T } = useLocaleStore(useShallow(({ t, T }) => ({ t, T })));

    const { session } = useSession({ sessionId });
    const { logs, pushLog } = useLogs();
    const { users, setUsers, updateUserCharacter, characterUpdate } =
        useSessionUsers(socket);
    const {
        getDiceResultLog,
        getDiceAlienResultLog,
        requestDice,
        requestDiceAlien
    } = useDice(socket);
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
        (sock: SocketClient) => {
            sock.on('connect_error', () => {
                toast.error(T('page.play.error.connectionError'));
            });
            sock.on('error', ({ status }) => {
                toast.error(
                    T('page.play.error.statusError', {
                        status: status?.toString() ?? ''
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
            sock.on('diceResult', (res: DiceResponseBody) => {
                const { dateTime, user: sockUser, isMaster } = res;
                pushLog({
                    dateTime,
                    user: sockUser,
                    isMaster,
                    content: getDiceResultLog(res)
                });
            });
            sock.on('diceAlienResult', (res: DiceAlienResponseBody) => {
                const { dateTime, user: sockUser, isMaster } = res;
                pushLog({
                    dateTime,
                    user: sockUser,
                    isMaster,
                    content: getDiceAlienResultLog(res)
                });
            });
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
            getDiceAlienResultLog,
            setUsers,
            setSketchData
        ]
    );

    const connectSocket = useCallback(
        ({
            sessionId: sessId,
            isMaster,
            characterId: charId
        }: ConnectOptions): SocketClient => {
            const sock = createSocketClient({
                ...socketIoConnectOptions,
                query: {
                    sessionId: sessId,
                    characterId: charId
                },
                data: {
                    user: user as User,
                    sessionId: Number(sessId),
                    isMaster: isMaster,
                    characterId: Number(charId)
                }
            });
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
            initialized: true,
            sessionId,
            session,
            characterId,
            socket,
            users,
            logs,
            requestDice,
            requestDiceAlien,
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
            session,
            characterId,
            socket,
            users,
            logs,
            requestDice,
            requestDiceAlien,
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

    return <PlayContext value={contextValue}>{children}</PlayContext>;
};

export const usePlay = () => {
    const context = useContext(PlayContext);
    if (!context?.initialized) {
        throw new Error('usePlay must be used within an PlayProvider');
    }
    return context;
};
