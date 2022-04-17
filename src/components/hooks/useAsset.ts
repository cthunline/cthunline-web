import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
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
    const { user, handleApiError } = useAuth();

    const [assetList, setAssetList] = useState<Asset[]>([]);

    const getAssets = useCallback(async (userId: string): Promise<Asset[]> => {
        try {
            const typeQuery = type ? `?type=${type}` : '';
            const { assets } = await Api.call({
                method: 'GET',
                route: `/users/${userId}/assets${typeQuery}`
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
        if (user?.id) {
            const assets = await getAssets(user.id);
            setAssetList(assets);
        }
    }, [
        user,
        getAssets
    ]);

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
                route: `/users/${user?.id}/assets`,
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
        user,
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
                route: `/users/${user?.id}/assets/${assetId}`
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
        user,
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
