import { useCallback, useEffect, useState } from 'react';

import { handleApiError } from '../../services/api.js';
import {
    createUser as createUserRequest,
    editUser as editUserRequest,
    generateInvitationCode as generateInvitationCodeRequest,
    getUsers as getUsersRequest,
    registerUser as registerUserRequest
} from '../../services/requests/user.js';
import { toast } from '../../services/toast.js';
import type {
    User,
    UserCreateBody,
    UserEditBody,
    UserRegisterBody
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
    const [userList, setUserList] = useState<User[]>([]);

    const refreshUserList = useCallback(async () => {
        try {
            const users = await getUsersRequest(listDisabled);
            setUserList(users);
        } catch (err: unknown) {
            throw handleApiError(err);
        }
    }, [listDisabled]);

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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [loadList, refreshUserList]
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [loadList, refreshUserList]
    );

    const registerUser = useCallback(
        async ({ data, isToast = true }: RegisterOptions): Promise<User> => {
            try {
                const user = await registerUserRequest(data);
                if (isToast) {
                    toast.success('Registered successfully');
                }
                return user;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        []
    );

    const generateInvitationCode = useCallback(async (): Promise<string> => {
        try {
            const code = await generateInvitationCodeRequest();
            return code;
        } catch (err: unknown) {
            throw handleApiError(err);
        }
    }, []);

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
