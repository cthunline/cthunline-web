import { useCallback, useEffect, useState } from 'react';

import { handleApiError } from '../../services/api.js';
import {
    createSessionSketch,
    deleteSketch,
    getSessionSketchs,
    getSketch,
    updateSketch
} from '../../services/requests/sketch.js';
import { toast } from '../../services/toast.js';
import type {
    Sketch,
    SketchCreateBody,
    SketchUpdateBody
} from '../../types/index.js';

interface CreateUserSketchOptions {
    sessionId: number;
    data: SketchCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface UpdateUserSketchOptions {
    sketchId: number;
    data: SketchUpdateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteUserSketchOptions {
    sketchId: number;
    isRefresh?: boolean;
    isToast?: boolean;
}

type UseSessionSketchOptions = {
    sessionId: number;
    loadList?: boolean;
};

const useSessionSketch = ({ sessionId, loadList }: UseSessionSketchOptions) => {
    const [userSketchs, setUserSketchs] = useState<Sketch[]>([]);

    const getUserSketchs = useCallback(
        async (sessionId: number): Promise<Sketch[]> => {
            try {
                return await getSessionSketchs(sessionId);
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        []
    );

    const getUserSketch = useCallback(
        async (sketchId: number): Promise<Sketch> => {
            try {
                return await getSketch(sketchId);
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        []
    );

    const refresh = useCallback(async () => {
        if (loadList) {
            const sketchs = await getUserSketchs(sessionId);
            setUserSketchs(sketchs);
        }
    }, [sessionId, loadList, getUserSketchs]);

    const createUserSketch = useCallback(
        async ({
            sessionId,
            data,
            isRefresh = true,
            isToast = true
        }: CreateUserSketchOptions): Promise<Sketch> => {
            try {
                const sketch = await createSessionSketch(sessionId, data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Sketch saved');
                }
                return sketch;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
    );

    const updateUserSketch = useCallback(
        async ({
            sketchId,
            data,
            isRefresh = true,
            isToast = true
        }: UpdateUserSketchOptions): Promise<Sketch> => {
            try {
                const sketch = await updateSketch(sketchId, data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Sketch overwritten');
                }
                return sketch;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        userSketchs,
        refresh,
        getUserSketch,
        createUserSketch,
        updateUserSketch,
        deleteUserSketch
    };
};

export default useSessionSketch;
