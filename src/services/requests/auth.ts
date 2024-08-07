import { callApi } from '../api.js';

import type { User } from '../../types/index.js';

interface LoginBody {
    email: string;
    password: string;
}

export const logout = async () => {
    await callApi({
        method: 'DELETE',
        route: '/auth'
    });
};

export const login = async (body: LoginBody) =>
    callApi<User>({
        method: 'POST',
        route: '/auth',
        body
    });

export const checkAuth = () =>
    callApi<User>({
        method: 'GET',
        route: '/auth'
    });
