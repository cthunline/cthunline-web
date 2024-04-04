import { callApi } from '../api';

import {
    type Sketch,
    type SketchCreateBody,
    type SketchUpdateBody
} from '../../types';

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
        method: 'POST',
        route: `/sketchs/${sketchId}`,
        body
    });

export const deleteSketch = async (sketchId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/sketchs/${sketchId}`
    });
};
