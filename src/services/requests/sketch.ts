import { callApi } from '../api.js';

import type {
    Sketch,
    SketchCreateBody,
    SketchUpdateBody
} from '../../types/index.js';

export const getSketchs = async () => {
    const { sketchs } = await callApi<{ sketchs: Sketch[] }>({
        method: 'GET',
        route: '/sketchs'
    });
    return sketchs;
};

export const getSketch = async (sketchId: number) =>
    callApi<Sketch>({
        method: 'GET',
        route: `/sketchs/${sketchId}`
    });

export const createSketch = async (body: SketchCreateBody) =>
    callApi<Sketch>({
        method: 'POST',
        route: '/sketchs',
        body
    });

export const updateSketch = async (sketchId: number, body: SketchUpdateBody) =>
    callApi<Sketch>({
        method: 'PATCH',
        route: `/sketchs/${sketchId}`,
        body
    });

export const deleteSketch = async (sketchId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/sketchs/${sketchId}`
    });
};
