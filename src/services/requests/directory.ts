import { callApi } from '../api.js';

import {
    type Directory,
    type DirectoryCreateBody,
    type DirectoryEditBody
} from '../../types/index.js';

export const getDirectories = async () => {
    const { directories } = await callApi<{ directories: Directory[] }>({
        method: 'GET',
        route: '/directories'
    });
    return directories;
};

export const createDirectory = async (body: DirectoryCreateBody) =>
    callApi<Directory>({
        method: 'POST',
        route: '/directories',
        body
    });

export const editDirectory = async (
    directoryId: number,
    body: DirectoryEditBody
) =>
    callApi<Directory>({
        method: 'POST',
        route: `/directories/${directoryId}`,
        body
    });

export const deleteDirectory = async (directoryId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/directories/${directoryId}`
    });
};
