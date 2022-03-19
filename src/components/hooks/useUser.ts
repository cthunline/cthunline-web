import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import {
    User,
    UserCreateBody,
    UserEditBody
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

const useUser = ({
    loadList = false,
    listDisabled = false
}: UserHookOptions = {}) => {
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
            toast.error(err.message);
        }
    }, [
        listDisabled
    ]);

    const createUser = async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateOptions) => {
        try {
            await Api.call({
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
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const editUser = async ({
        userId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions): Promise<User | null> => {
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
            toast.error(err.message);
            return null;
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
        editUser
    };
};

export default useUser;
