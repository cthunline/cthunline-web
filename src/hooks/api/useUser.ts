import { useState, useEffect, useCallback } from 'react';

import { toast } from '../../services/toast.js';
import { useApp } from '../../contexts/App.js';
import {
    getUsers as getUsersRequest,
    createUser as createUserRequest,
    editUser as editUserRequest,
    generateInvitationCode as generateInvitationCodeRequest,
    registerUser as registerUserRequest
} from '../../services/requests/user.js';
import {
    type User,
    type UserCreateBody,
    type UserEditBody,
    type UserRegisterBody
} from '../../types/index.js';

interface UserHookOptions {
    loadList?: boolean;
    listDisabled?: boolean;
}

interface CreateOptions {
    data: UserCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    userId: number;
    data: UserEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface RegisterOptions {
    data: UserRegisterBody;
    isToast?: boolean;
}

const useUser = ({
    loadList = false,
    listDisabled = false
}: UserHookOptions = {}) => {
    const { handleApiError } = useApp();

    const [userList, setUserList] = useState<User[]>([]);

    const refreshUserList = useCallback(async () => {
        try {
            const users = await getUsersRequest(listDisabled);
            setUserList(users);
        } catch (err: any) {
            throw handleApiError(err);
        }
    }, [listDisabled, handleApiError]);

    const createUser = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateOptions): Promise<User> => {
            try {
                const user = await createUserRequest(data);
                if (isRefresh && loadList) {
                    await refreshUserList();
                }
                if (isToast) {
                    toast.success('User created');
                }
                return user;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [handleApiError, loadList, refreshUserList]
    );

    const editUser = useCallback(
        async ({
            userId,
            data,
            isRefresh = true,
            isToast = true
        }: EditOptions): Promise<User> => {
            try {
                const user = await editUserRequest(userId, data);
                if (isRefresh && loadList) {
                    await refreshUserList();
                }
                if (isToast) {
                    toast.success('User edited');
                }
                return user;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [handleApiError, loadList, refreshUserList]
    );

    const registerUser = useCallback(
        async ({ data, isToast = true }: RegisterOptions): Promise<User> => {
            try {
                const user = await registerUserRequest(data);
                if (isToast) {
                    toast.success('Registered successfully');
                }
                return user;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [handleApiError]
    );

    const generateInvitationCode = useCallback(async (): Promise<string> => {
        try {
            const code = await generateInvitationCodeRequest();
            return code;
        } catch (err: any) {
            throw handleApiError(err);
        }
    }, [handleApiError]);

    useEffect(() => {
        if (loadList) {
            refreshUserList();
        }
    }, [loadList, refreshUserList]);

    return {
        userList,
        createUser,
        editUser,
        registerUser,
        generateInvitationCode
    };
};

export default useUser;
