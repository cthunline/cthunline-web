import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../contexts/App.js';
import {
    createDirectory as createDirectoryRequest,
    deleteDirectory as deleteDirectoryRequest,
    editDirectory as editDirectoryRequest,
    getDirectories as getDirectoriesRequest
} from '../../services/requests/directory.js';
import { toast } from '../../services/toast.js';
import type {
    Directory,
    DirectoryCreateBody,
    DirectoryEditBody
} from '../../types/index.js';

interface DirectoryHookOptions {
    loadList?: boolean;
}

interface CreateOptions {
    data: DirectoryCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    directoryId: number;
    data: DirectoryEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteOptions {
    directoryId: number;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useDirectory = ({ loadList }: DirectoryHookOptions = {}) => {
    const { user, handleApiError } = useApp();

    const [directoryList, setDirectoryList] = useState<Directory[]>([]);

    const getDirectories = useCallback(async (): Promise<Directory[]> => {
        try {
            const directories = await getDirectoriesRequest();
            return directories;
        } catch (err: unknown) {
            throw handleApiError(err);
        }
    }, [handleApiError]);

    const refreshDirectoryList = useCallback(async () => {
        if (user?.id) {
            const directories = await getDirectories();
            setDirectoryList(directories);
        }
    }, [user, getDirectories]);

    const createDirectory = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateOptions): Promise<Directory> => {
            try {
                const dir = await createDirectoryRequest(data);
                if (isRefresh && loadList) {
                    await refreshDirectoryList();
                }
                if (isToast) {
                    toast.success('Directory created');
                }
                return dir;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refreshDirectoryList, loadList]
    );

    const editDirectory = useCallback(
        async ({
            directoryId,
            data,
            isRefresh = true,
            isToast = true
        }: EditOptions): Promise<Directory> => {
            try {
                const dir = await editDirectoryRequest(directoryId, data);
                if (isRefresh && loadList) {
                    await refreshDirectoryList();
                }
                if (isToast) {
                    toast.success('Directory edited');
                }
                return dir;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refreshDirectoryList, loadList]
    );

    const deleteDirectory = useCallback(
        async ({
            directoryId,
            isRefresh = true,
            isToast = true
        }: DeleteOptions): Promise<void> => {
            try {
                await deleteDirectoryRequest(directoryId);
                if (isRefresh && loadList) {
                    await refreshDirectoryList();
                }
                if (isToast) {
                    toast.success('Directory deleted');
                }
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [loadList, refreshDirectoryList, handleApiError]
    );

    useEffect(() => {
        if (loadList) {
            refreshDirectoryList();
        }
    }, [loadList, refreshDirectoryList]);

    return {
        directoryList,
        getDirectories,
        createDirectory,
        editDirectory,
        deleteDirectory
    };
};

export default useDirectory;
