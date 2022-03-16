import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import { Asset } from '../../types';

interface AssetHookOptions {
    loadList?: boolean;
    type?: 'audio' | 'image';
}

interface UploadOptions {
    file: File;
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
    const { user } = useAuth();

    const [assetList, setAssetList] = useState<Asset[]>([]);

    const getAssets = useCallback(async (userId: string) => {
        try {
            const query = type ? `?type=${type}` : '';
            const { assets } = await Api.call({
                method: 'GET',
                route: `/users/${userId}/assets${query}`
            });
            return assets;
        } catch (err: any) {
            toast.error(err.message);
            return undefined;
        }
    }, [
        type
    ]);

    const refreshAssetList = useCallback(async () => {
        if (user?.id) {
            const assets = await getAssets(user.id);
            if (assets) {
                setAssetList(assets);
            }
        }
    }, [
        user,
        getAssets
    ]);

    const uploadAsset = useCallback(async ({
        file,
        progress,
        isRefresh = true,
        isToast = true
    }: UploadOptions): Promise<Asset | null> => {
        try {
            const formData = new FormData();
            formData.append('asset', file);
            const asset = await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/assets`,
                data: formData,
                progress
            });
            if (isRefresh && loadList) {
                await refreshAssetList();
            }
            if (isToast) {
                toast.success('Asset created');
            }
            return asset;
        } catch (err: any) {
            toast.error(err.message);
            return null;
        }
    }, [
        loadList,
        refreshAssetList,
        user
    ]);

    const deleteAsset = useCallback(async ({
        assetId,
        isRefresh = true,
        isToast = true
    }: DeleteOptions) => {
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
            toast.error(err.message);
        }
    }, [
        user,
        loadList,
        refreshAssetList
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
        uploadAsset,
        deleteAsset
    };
};

export default useAsset;
