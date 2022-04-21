import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useApp } from '../contexts/App';
import {
    User,
    UserCreateBody,
    UserEditBody,
    UserRegisterBody
} from '../../types';

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
    userId: string;
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
            const urlQuery = listDisabled ? '?disabled=true' : '';
            const { users } = await Api.call({
                method: 'GET',
                route: `/users${urlQuery}`
            });
            setUserList(users);
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [
        listDisabled,
        handleApiError
    ]);

    const createUser = async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateOptions): Promise<User> => {
        try {
            const user = await Api.call({
                method: 'POST',
                route: '/users',
                data
            });
            if (isRefresh && loadList) {
                await refreshUserList();
            }
            if (isToast) {
                toast.success('User created');
            }
            return user;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const editUser = async ({
        userId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions): Promise<User> => {
        try {
            const user = await Api.call({
                method: 'POST',
                route: `/users/${userId}`,
                data
            });
            if (isRefresh && loadList) {
                await refreshUserList();
            }
            if (isToast) {
                toast.success('User edited');
            }
            return user;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const registerUser = async ({
        data,
        isToast = true
    }: RegisterOptions): Promise<User> => {
        try {
            const user = await Api.call({
                method: 'POST',
                route: '/register',
                data
            });
            if (isToast) {
                toast.success('Registered successfully');
            }
            return user;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const generateInvitationCode = async (): Promise<string> => {
        try {
            const { code } = await Api.call({
                method: 'POST',
                route: '/invitation'
            });
            return code;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    useEffect(() => {
        if (loadList) {
            refreshUserList();
        }
    }, [
        loadList,
        refreshUserList
    ]);

    return {
        userList,
        createUser,
        editUser,
        registerUser,
        generateInvitationCode
    };
};

export default useUser;
