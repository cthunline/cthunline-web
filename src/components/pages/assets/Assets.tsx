import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Button,
    Box
} from '@mui/material';
import { toast } from 'react-toastify';
import { HiMusicNote } from 'react-icons/hi';
import { MdFolder, MdOutlineImage } from 'react-icons/md';

import Explorer, {
    ExplorerItem,
    ExplorerItemType
} from '../../ui/explorer/Explorer';
import UploadButton from '../../ui/uploadButton/UploadButton';
import { useApp } from '../../contexts/App';
import { useDialog } from '../../contexts/Dialog';
import useAsset from '../../hooks/useAsset';
import useDirectory from '../../hooks/useDirectory';
import DirectoryForm from './DirectoryForm';

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'audio/mpeg'
];

const limitSizeInMb = 20;

const Assets: React.FC = () => {
    const { T } = useApp();
    const {
        confirmDialog,
        openDialog,
        closeDialog
    } = useDialog();
    const {
        assetList,
        uploadAssets,
        deleteAsset
    } = useAsset({
        loadList: true
    });
    const {
        directoryList,
        createDirectory,
        deleteDirectory
    } = useDirectory({
        loadList: true
    });

    const [directoryIds, setDirectoryIds] = useState<string[]>([]);
    const [progress, setProgress] = useState<number | null>(null);

    const onDirectoryBack = () => {
        setDirectoryIds((previous) => (
            previous.slice(0, -1)
        ));
    };

    const onDirectoryClick = (id: string) => {
        setDirectoryIds((previous) => [...previous, id]);
    };

    const onSubmitDirectory = (name: string) => {
        const parentId = directoryIds.length ? directoryIds.at(-1) : undefined;
        createDirectory({
            data: {
                name,
                parentId
            }
        });
        closeDialog();
    };

    const onCreateDirectory = () => {
        openDialog({
            title: T('page.assets.newDirectory'),
            content: (
                <DirectoryForm onSubmit={onSubmitDirectory} />
            )
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const files: File[] = [...e.target.files];
            let valid = true;
            files.forEach((file) => {
                const sizeInMb = file.size / (1024 * 1024);
                if (sizeInMb > limitSizeInMb) {
                    toast.error(T('page.assets.error.fileTooLarge', {
                        name: file.name,
                        limitMb: String(limitSizeInMb)
                    }));
                    valid = false;
                }
            });
            if (valid) {
                const directoryId = directoryIds.length ? directoryIds.at(-1) : undefined;
                await uploadAssets({
                    data: {
                        assets: files,
                        directoryId
                    },
                    progress: (percent: number) => {
                        setProgress(percent);
                    }
                });
                setProgress(null);
            }
        }
    };

    const onDelete = (type: ExplorerItemType, id: string, name: string) => {
        if (type === ExplorerItemType.directory) {
            const confirmText = T('page.assets.deleteDirectoryConfirm', { name });
            confirmDialog(confirmText, () => {
                deleteDirectory({ directoryId: id });
            });
        }
        if (type === ExplorerItemType.file) {
            const confirmText = T('page.assets.deleteAssetConfirm', { name });
            confirmDialog(confirmText, () => {
                deleteAsset({ assetId: id });
            });
        }
    };

    const items: ExplorerItem[] = [
        ...directoryList.map(({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: ExplorerItemType.directory
        })),
        ...assetList.map(({
            id,
            name,
            type,
            directoryId
        }) => ({
            id,
            name,
            parentId: directoryId,
            type: ExplorerItemType.file,
            icon: type === 'audio' ? (
                <HiMusicNote size={25} />
            ) : (
                <MdOutlineImage size={25} />
            )
        }))
    ];

    return (
        <Paper elevation={3} className="page-list p-25 flex column start-x center-y">
            <Typography variant="h6" gutterBottom>
                {T('entity.assets')}
            </Typography>
            <Explorer
                className="scroll mb-10"
                items={items}
                directoryId={directoryIds.at(-1)}
                onDirectoryBack={onDirectoryBack}
                onDirectoryClick={onDirectoryClick}
                onDelete={onDelete}
            />
            <Box className="align-end">
                <Button
                    className="mr-10"
                    variant="contained"
                    size="medium"
                    component="span"
                    startIcon={<MdFolder />}
                    onClick={onCreateDirectory}
                >
                    {T('page.assets.newDirectory')}
                </Button>
                <UploadButton
                    label={T('page.assets.uploadAsset')}
                    progress={progress}
                    allowedMimeTypes={allowedMimeTypes}
                    onChange={handleFileChange}
                />
            </Box>
        </Paper>
    );
};

export default Assets;
