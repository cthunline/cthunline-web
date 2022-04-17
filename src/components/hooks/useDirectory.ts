import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import {
    Directory,
    DirectoryCreateBody,
    DirectoryEditBody
} from '../../types';

interface DirectoryHookOptions {
    loadList?: boolean;
}

interface CreateOptions {
    data: DirectoryCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    directoryId: string;
    data: DirectoryEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteOptions {
    directoryId: string;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useDirectory = ({ loadList }: DirectoryHookOptions = {}) => {
    const { user, handleApiError } = useAuth();

    const [directoryList, setDirectoryList] = useState<Directory[]>([]);

    const getDirectories = useCallback(async (userId: string): Promise<Directory[]> => {
        try {
            const { directories } = await Api.call({
                method: 'GET',
                route: `/users/${userId}/directories`
            });
            return directories;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [handleApiError]);

    const refreshDirectoryList = useCallback(async () => {
        if (user?.id) {
            const directories = await getDirectories(user.id);
            setDirectoryList(directories);
        }
    }, [
        user,
        getDirectories
    ]);

    const createDirectory = async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateOptions): Promise<Directory> => {
        try {
            const dir = await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/directories`,
                data
            });
            if (isRefresh && loadList) {
                await refreshDirectoryList();
            }
            if (isToast) {
                toast.success('Directory created');
            }
            return dir;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const editDirectory = async ({
        directoryId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions): Promise<Directory> => {
        try {
            const dir = await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/directories/${directoryId}`,
                data
            });
            if (isRefresh && loadList) {
                await refreshDirectoryList();
            }
            if (isToast) {
                toast.success('Directory edited');
            }
            return dir;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const deleteDirectory = useCallback(async ({
        directoryId,
        isRefresh = true,
        isToast = true
    }: DeleteOptions): Promise<void> => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/users/${user?.id}/directories/${directoryId}`
            });
            if (isRefresh && loadList) {
                await refreshDirectoryList();
            }
            if (isToast) {
                toast.success('Directory deleted');
            }
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [
        user,
        loadList,
        refreshDirectoryList,
        handleApiError
    ]);

    useEffect(() => {
        if (loadList) {
            refreshDirectoryList();
        }
    }, [
        loadList,
        refreshDirectoryList
    ]);

    return {
        directoryList,
        getDirectories,
        createDirectory,
        editDirectory,
        deleteDirectory
    };
};

export default useDirectory;
