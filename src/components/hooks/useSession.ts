import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useApp } from '../contexts/App';
import {
    Session,
    SessionCreateBody,
    SessionEditBody,
    Note
} from '../../types';

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

interface EditNotesOptions {
    sessionId: number;
    text: string;
    isToast?: boolean;
}

const useSession = ({
    loadList,
    sessionId
}: SessionHookOptions = {}) => {
    const { handleApiError } = useApp();

    const [sessionList, setSessionList] = useState<Session[]>([]);
    const [session, setSession] = useState<Session>();

    const getSessions = useCallback(async (): Promise<Session[]> => {
        try {
            const { sessions } = await Api.call({
                method: 'GET',
                route: '/sessions?include=true'
            });
            return sessions;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [handleApiError]);

    const getSession = useCallback(async (
        sessId: number
    ): Promise<Session> => {
        try {
            return await Api.call({
                method: 'GET',
                route: `/sessions/${sessId}`
            });
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [handleApiError]);

    const refreshSession = useCallback(async (sessId: number) => {
        const sess = await getSession(sessId);
        setSession(sess);
    }, [getSession]);

    const refreshSessionList = useCallback(async () => {
        const sessions = await getSessions();
        setSessionList(sessions);
    }, [getSessions]);

    const refresh = useCallback(async () => {
        const tasks = [];
        if (sessionId) {
            tasks.push(
                refreshSession(sessionId)
            );
        }
        if (loadList) {
            tasks.push(
                refreshSessionList()
            );
        }
        await Promise.all(tasks);
    }, [
        loadList,
        sessionId,
        refreshSession,
        refreshSessionList
    ]);

    const createSession = useCallback(async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateSessionOptions): Promise<Session> => {
        try {
            const sess = await Api.call({
                method: 'POST',
                route: '/sessions',
                data
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Session created');
            }
            return sess;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [
        refresh,
        handleApiError
    ]);

    const editSession = async ({
        sessionId: sessId,
        data,
        isRefresh = true,
        isToast = true
    }: EditSessionOptions): Promise<Session> => {
        try {
            const sess = await Api.call({
                method: 'POST',
                route: `/sessions/${sessId}`,
                data
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Session edited');
            }
            return sess;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const deleteSession = useCallback(async ({
        sessionId: sessId,
        isRefresh = true,
        isToast = true
    }: DeleteSessionOptions): Promise<void> => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/sessions/${sessId}`
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Session deleted');
            }
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [
        refresh,
        handleApiError
    ]);

    const getNotes = useCallback(async (
        sessId: number
    ): Promise<Note> => {
        try {
            return await Api.call({
                method: 'GET',
                route: `/sessions/${sessId}/notes`
            });
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [handleApiError]);

    const editNotes = async ({
        sessionId: sessId,
        text,
        isToast = true
    }: EditNotesOptions): Promise<Note> => {
        try {
            const notes = await Api.call({
                method: 'POST',
                route: `/sessions/${sessId}/notes`,
                data: { text }
            });
            if (isToast) {
                toast.success('Notes edited');
            }
            return notes;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    useEffect(() => {
        refresh();
    }, [
        refresh
    ]);

    return {
        session,
        sessionList,
        getSession,
        getSessions,
        createSession,
        editSession,
        deleteSession,
        getNotes,
        editNotes
    };
};

export default useSession;
