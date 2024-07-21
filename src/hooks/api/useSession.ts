import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../contexts/App.js';
import {
    createSession as createSessionRequest,
    deleteSession as deleteSessionRequest,
    editSession as editSessionRequest,
    getSession as getSessionRequest,
    getSessions as getSessionsRequest
} from '../../services/requests/session.js';
import { toast } from '../../services/toast.js';
import type {
    Session,
    SessionCreateBody,
    SessionEditBody
} from '../../types/index.js';

interface SessionHookOptions {
    loadList?: boolean;
    sessionId?: number;
}

interface CreateSessionOptions {
    data: SessionCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditSessionOptions {
    sessionId: number;
    data: SessionEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteSessionOptions {
    sessionId: number;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useSession = ({ loadList, sessionId }: SessionHookOptions = {}) => {
    const { handleApiError } = useApp();

    const [sessionList, setSessionList] = useState<Session[]>([]);
    const [session, setSession] = useState<Session>();

    const getSessions = useCallback(async (): Promise<Session[]> => {
        try {
            return await getSessionsRequest();
        } catch (err: unknown) {
            throw handleApiError(err);
        }
    }, [handleApiError]);

    const getSession = useCallback(
        async (sessId: number): Promise<Session> => {
            try {
                return await getSessionRequest(sessId);
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError]
    );

    const refreshSession = useCallback(
        async (sessId: number) => {
            const sess = await getSession(sessId);
            setSession(sess);
        },
        [getSession]
    );

    const refreshSessionList = useCallback(async () => {
        const sessions = await getSessions();
        setSessionList(sessions);
    }, [getSessions]);

    const refresh = useCallback(async () => {
        const tasks = [];
        if (sessionId) {
            tasks.push(refreshSession(sessionId));
        }
        if (loadList) {
            tasks.push(refreshSessionList());
        }
        await Promise.all(tasks);
    }, [loadList, sessionId, refreshSession, refreshSessionList]);

    const createSession = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateSessionOptions): Promise<Session> => {
            try {
                const sess = await createSessionRequest(data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Session created');
                }
                return sess;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh, handleApiError]
    );

    const editSession = useCallback(
        async ({
            sessionId: sessId,
            data,
            isRefresh = true,
            isToast = true
        }: EditSessionOptions): Promise<Session> => {
            try {
                const sess = await editSessionRequest(sessId, data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Session edited');
                }
                return sess;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refresh]
    );

    const deleteSession = useCallback(
        async ({
            sessionId: sessId,
            isRefresh = true,
            isToast = true
        }: DeleteSessionOptions): Promise<void> => {
            try {
                await deleteSessionRequest(sessId);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Session deleted');
                }
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh, handleApiError]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        session,
        sessionList,
        getSession,
        getSessions,
        createSession,
        editSession,
        deleteSession
    };
};

export default useSession;
