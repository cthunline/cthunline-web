import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import {
    createSketch,
    deleteSketch,
    getSketch,
    getSketchs
} from '../../services/requests/sketch';

import { useApp } from '../contexts/App';

import { Sketch, SketchCreateBody } from '../../types';

interface CreateUserSketchOptions {
    data: SketchCreateBody;
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

    const [userSketchs, setUserSketchs] = useState<Sketch[]>([]);

    const getUserSketchs = useCallback(async (): Promise<Sketch[]> => {
        try {
            return await getSketchs();
        } catch (err: any) {
            throw handleApiError(err);
        }
    }, [handleApiError]);

    const getUserSketch = useCallback(
        async (sketchId: number): Promise<Sketch> => {
            try {
                return await getSketch(sketchId);
            } catch (err: any) {
                throw handleApiError(err);
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
        }: CreateUserSketchOptions): Promise<Sketch> => {
            try {
                const sketch = await createSketch(data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Sketch saved');
                }
                return sketch;
            } catch (err: any) {
                throw handleApiError(err);
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
                await deleteSketch(sketchId);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Sketch deleted');
                }
            } catch (err: any) {
                throw handleApiError(err);
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
