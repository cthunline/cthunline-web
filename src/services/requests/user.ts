import { callApi } from '../api';

import {
    User,
    UserCreateBody,
    UserEditBody,
    UserRegisterBody
} from '../../types';

export const getUsers = async (includeDisabled?: boolean) => {
    const urlQuery = includeDisabled ? '?disabled=true' : '';
    const { users } = await callApi<{ users: User[] }>({
        method: 'GET',
        route: `/users${urlQuery}`
    });
    return users;
};

export const createUser = async (body: UserCreateBody) =>
    callApi<User>({
        method: 'POST',
        route: '/users',
        body
    });

export const getUser = async (userId: number) =>
    callApi<User>({
        method: 'GET',
        route: `/users/${userId}`
    });

export const editUser = async (userId: number, body: UserEditBody) =>
    callApi<User>({
        method: 'POST',
        route: `/users/${userId}`,
        body
    });

export const registerUser = async (body: UserRegisterBody) =>
    callApi<User>({
        method: 'POST',
        route: '/register',
        body
    });

export const generateInvitationCode = async () => {
    const { code } = await callApi<{ code: string }>({
        method: 'POST',
        route: '/invitation'
    });
    return code;
};
