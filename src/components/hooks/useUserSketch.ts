import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useApp } from '../contexts/App';
import { UserSketch, UserSketchCreateBody } from '../../types';

interface CreateUserSketchOptions {
    data: UserSketchCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteUserSketchOptions {
    sketchId: number;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useUserSketch = (loadList: boolean = false) => {
    const { handleApiError } = useApp();

    const [userSketchs, setUserSketchs] = useState<UserSketch[]>([]);

    const getUserSketchs = useCallback(async (): Promise<UserSketch[]> => {
        try {
            const { sketchs } = await Api.call({
                method: 'GET',
                route: '/sketchs'
            });
            return sketchs;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [handleApiError]);

    const getUserSketch = useCallback(
        async (sketchId: number): Promise<UserSketch> => {
            try {
                return await Api.call({
                    method: 'GET',
                    route: `/sketchs/${sketchId}`
                });
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [handleApiError]
    );

    const refresh = useCallback(async () => {
        if (loadList) {
            const sketchs = await getUserSketchs();
            setUserSketchs(sketchs);
        }
    }, [loadList, getUserSketchs]);

    const createUserSketch = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateUserSketchOptions): Promise<UserSketch> => {
            try {
                const sketch = await Api.call({
                    method: 'POST',
                    route: '/sketchs',
                    data
                });
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Sketch saved');
                }
                return sketch;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    const deleteUserSketch = useCallback(
        async ({
            sketchId,
            isRefresh = true,
            isToast = true
        }: DeleteUserSketchOptions): Promise<void> => {
            try {
                await Api.call({
                    method: 'DELETE',
                    route: `/sketchs/${sketchId}`
                });
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Sketch deleted');
                }
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        userSketchs,
        refresh,
        getUserSketch,
        createUserSketch,
        deleteUserSketch
    };
};

export default useUserSketch;
