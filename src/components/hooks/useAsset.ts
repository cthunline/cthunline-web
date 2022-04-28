import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useApp } from '../contexts/App';
import { Asset, AssetCreateBody } from '../../types';

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
    assetId: string;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useAsset = ({ loadList, type }: AssetHookOptions = {}) => {
    const { handleApiError } = useApp();

    const [assetList, setAssetList] = useState<Asset[]>([]);

    const getAssets = useCallback(async (): Promise<Asset[]> => {
        try {
            const typeQuery = type ? `?type=${type}` : '';
            const { assets } = await Api.call({
                method: 'GET',
                route: `/assets${typeQuery}`
            });
            return assets;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [
        type,
        handleApiError
    ]);

    const refreshAssetList = useCallback(async () => {
        const assets = await getAssets();
        setAssetList(assets);
    }, [getAssets]);

    const uploadAssets = useCallback(async ({
        data,
        progress,
        isRefresh = true,
        isToast = true
    }: UploadOptions): Promise<Asset[]> => {
        try {
            const formData = new FormData();
            [...data.assets].forEach((file) => {
                formData.append('assets', file);
            });
            if (data.directoryId) {
                formData.append('directoryId', data.directoryId);
            }
            const { assets } = await Api.call({
                method: 'POST',
                route: '/assets',
                data: formData,
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
            handleApiError(err);
            throw err;
        }
    }, [
        loadList,
        refreshAssetList,
        handleApiError
    ]);

    const deleteAsset = useCallback(async ({
        assetId,
        isRefresh = true,
        isToast = true
    }: DeleteOptions): Promise<void> => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/assets/${assetId}`
            });
            if (isRefresh && loadList) {
                await refreshAssetList();
            }
            if (isToast) {
                toast.success('Asset deleted');
            }
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [
        loadList,
        refreshAssetList,
        handleApiError
    ]);

    useEffect(() => {
        if (loadList) {
            refreshAssetList();
        }
    }, [
        loadList,
        refreshAssetList
    ]);

    return {
        assetList,
        getAssets,
        uploadAssets,
        deleteAsset
    };
};

export default useAsset;
