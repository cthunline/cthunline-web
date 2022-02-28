import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { UserData } from '../../types/api';

interface UserHookOptions {
    loadList?: boolean;
    listDisabled?: boolean;
}

const useUser = ({
    loadList = false,
    listDisabled = false
}: UserHookOptions = {}) => {
    const [userList, setUserList] = useState<UserData[]>([]);

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

    const createUser = async (data: object) => {
        try {
            await Api.call({
                method: 'POST',
                route: '/users',
                body: data
            });
            if (loadList) {
                await refreshUserList();
            }
            toast.success('User created');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const editUser = async (userId: string, data: object) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${userId}`,
                body: data
            });
            if (loadList) {
                await refreshUserList();
            }
            toast.success('User edited');
        } catch (err: any) {
            toast.error(err.message);
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
