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

const useSession = ({ loadList }: SessionHookOptions = {}) => {
    const [sessionList, setSessionList] = useState<Session[]>([]);

    const getSessions = useCallback(async () => {
        try {
            const { sessions } = await Api.call({
                method: 'GET',
                route: '/sessions?include=true'
            });
            return sessions;
        } catch (err: any) {
            toast.error(err.message);
            return undefined;
        }
    }, []);

    const refreshSessionList = useCallback(async () => {
        const sessions = await getSessions();
        if (sessions) {
            setSessionList(sessions);
        }
    }, [getSessions]);

    const createSession = useCallback(async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateOptions): Promise<Session | null> => {
        try {
            const session = await Api.call({
                method: 'POST',
                route: '/sessions',
                data
            });
            if (isRefresh && loadList) {
                await refreshSessionList();
            }
            if (isToast) {
                toast.success('Session created');
            }
            return session;
        } catch (err: any) {
            toast.error(err.message);
            return null;
        }
    }, [
        loadList,
        refreshSessionList
    ]);

    const editSession = async ({
        sessionId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/sessions/${sessionId}`,
                data
            });
            if (isRefresh && loadList) {
                await refreshSessionList();
            }
            if (isToast) {
                toast.success('Session edited');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteSession = useCallback(async ({
        sessionId,
        isRefresh = true,
        isToast = true
    }: DeleteOptions) => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/sessions/${sessionId}`
            });
            if (isRefresh && loadList) {
                await refreshSessionList();
            }
            if (isToast) {
                toast.success('Session deleted');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [
        loadList,
        refreshSessionList
    ]);

    useEffect(() => {
        if (loadList) {
            refreshSessionList();
        }
    }, [
        loadList,
        refreshSessionList
    ]);

    return {
        sessionList,
        getSessions,
        createSession,
        editSession,
        deleteSession
    };
};

export default useSession;
