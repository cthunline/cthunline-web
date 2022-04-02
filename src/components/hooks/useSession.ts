import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import {
    Session,
    SessionCreateBody,
    SessionEditBody
} from '../../types';

interface SessionHookOptions {
    loadList?: boolean;
    sessionId?: string;
}

interface CreateOptions {
    data: SessionCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    sessionId: string;
    data: SessionEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteOptions {
    sessionId: string;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useSession = ({
    loadList,
    sessionId
}: SessionHookOptions = {}) => {
    const [sessionList, setSessionList] = useState<Session[]>([]);
    const [session, setSession] = useState<Session>();

    const getSessions = useCallback(async () => {
        try {
            const { sessions } = await Api.call({
                method: 'GET',
                route: '/sessions?include=true'
            });
            return sessions;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    }, []);

    const getSession = useCallback(async (
        sessId: string
    ): Promise<Session> => {
        try {
            return await Api.call({
                method: 'GET',
                route: `/sessions/${sessId}`
            });
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    }, []);

    const refreshSession = useCallback(async (sessId: string) => {
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
    }: CreateOptions): Promise<Session> => {
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
            toast.error(err.message);
            throw err;
        }
    }, [
        refresh
    ]);

    const editSession = async ({
        sessionId: sessId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions) => {
        try {
            await Api.call({
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
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteSession = useCallback(async ({
        sessionId: sessId,
        isRefresh = true,
        isToast = true
    }: DeleteOptions) => {
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
            toast.error(err.message);
        }
    }, [
        refresh
    ]);

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
        deleteSession
    };
};

export default useSession;
