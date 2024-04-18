import { callApi } from '../api.js';

import {
    type User,
    type UserCreateBody,
    type UserEditBody,
    type UserRegisterBody
} from '../../types/index.js';

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
        method: 'PATCH',
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
