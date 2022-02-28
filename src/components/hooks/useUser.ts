import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { UserData } from '../../types/api';

const useUser = (loadList: boolean = false) => {
    const [userList, setUserList] = useState<UserData[]>([]);

    const refreshUserList = async () => {
        try {
            const { users } = await Api.call({
                method: 'GET',
                route: '/users'
            });
            setUserList(users);
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

    const deleteUser = async (userId: string) => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/users/${userId}`
            });
            if (loadList) {
                await refreshUserList();
            }
            toast.success('User deleted');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (loadList) {
            refreshUserList();
        }
    }, [loadList]);

    return {
        userList,
        editUser,
        deleteUser
    };
};

export default useUser;
