import { callApi } from '../api';

import { Session, SessionCreateBody, SessionEditBody } from '../../types';

export const getSessions = async () => {
    const { sessions } = await callApi<{ sessions: Session[] }>({
        method: 'GET',
        route: '/sessions?include=true'
    });
    return sessions;
};

export const getSession = async (sessionId: number) =>
    callApi<Session>({
        method: 'GET',
        route: `/sessions/${sessionId}`
    });

export const createSession = async (body: SessionCreateBody) =>
    callApi<Session>({
        method: 'POST',
        route: '/sessions',
        body
    });

export const editSession = async (sessionId: number, body: SessionEditBody) =>
    callApi<Session>({
        method: 'POST',
        route: `/sessions/${sessionId}`,
        body
    });

export const deleteSession = async (sessionId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/sessions/${sessionId}`
    });
};
