import { callApi } from '../api.js';

import type { Asset } from '../../types/index.js';

export const getAssets = async (type?: 'audio' | 'image') => {
    const typeQuery = type ? `?type=${type}` : '';
    const { assets } = await callApi<{ assets: Asset[] }>({
        method: 'GET',
        route: `/assets${typeQuery}`
    });
    return assets;
};

interface UploadAssetsBody {
    assets: File[];
    directoryId?: number;
}

interface UploadAssetsOptions {
    body: UploadAssetsBody;
    progress?: (percent: number) => void;
}

export const uploadAssets = async ({ body, progress }: UploadAssetsOptions) => {
    const formData = new FormData();
    for (const file of [...body.assets]) {
        formData.append('assets', file);
    }
    if (body.directoryId) {
        formData.append('directoryId', body.directoryId.toString());
    }
    const { assets } = await callApi<{ assets: Asset[] }>({
        method: 'POST',
        route: '/assets',
        body: formData,
        progress
    });
    return assets;
};

export const deleteAsset = async (assetId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/assets/${assetId}`
    });
};
