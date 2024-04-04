import { useState, useEffect, useCallback } from 'react';

import { type Asset, type AssetCreateBody } from '../../types';
import { toast } from '../../services/toast';
import { useApp } from '../contexts/App';
import {
    deleteAsset as deleteAssetRequest,
    getAssets as getAssetsRequest,
    uploadAssets as uploadAssetsRequest
} from '../../services/requests/asset';

interface AssetHookOptions {
    loadList?: boolean;
    type?: 'audio' | 'image';
}

interface UploadOptions {
    data: AssetCreateBody;
    progress?: (percent: number) => void;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteOptions {
    assetId: number;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useAsset = ({ loadList, type }: AssetHookOptions = {}) => {
    const { handleApiError } = useApp();

    const [assetList, setAssetList] = useState<Asset[]>([]);

    const getAssets = useCallback(async (): Promise<Asset[]> => {
        try {
            return await getAssetsRequest(type);
        } catch (err: any) {
            throw handleApiError(err);
        }
    }, [type, handleApiError]);

    const refreshAssetList = useCallback(async () => {
        const assets = await getAssets();
        setAssetList(assets);
    }, [getAssets]);

    const uploadAssets = useCallback(
        async ({
            data,
            progress,
            isRefresh = true,
            isToast = true
        }: UploadOptions): Promise<Asset[]> => {
            try {
                const assets = await uploadAssetsRequest({
                    body: data,
                    progress
                });
                if (isRefresh && loadList) {
                    await refreshAssetList();
                }
                if (isToast) {
                    const s = assets.length > 1 ? 's' : '';
                    toast.success(`Asset${s} uploaded`);
                }
                return assets;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [loadList, refreshAssetList, handleApiError]
    );

    const deleteAsset = useCallback(
        async ({
            assetId,
            isRefresh = true,
            isToast = true
        }: DeleteOptions): Promise<void> => {
            try {
                await deleteAssetRequest(assetId);
                if (isRefresh && loadList) {
                    await refreshAssetList();
                }
                if (isToast) {
                    toast.success('Asset deleted');
                }
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [loadList, refreshAssetList, handleApiError]
    );

    useEffect(() => {
        if (loadList) {
            refreshAssetList();
        }
    }, [loadList, refreshAssetList]);

    return {
        assetList,
        getAssets,
        uploadAssets,
        deleteAsset
    };
};

export default useAsset;
