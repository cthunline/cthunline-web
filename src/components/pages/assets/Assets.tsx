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

    const onBack = () => {
        setDirectoryIds((previous) => (
            previous.slice(0, -1)
        ));
    };

    const onDirectory = (id: string) => {
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
            title: 'Create a directory',
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
                    toast.error(`Size of file ${file.name} is too large (max ${limitSizeInMb}Mb)`);
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
            confirmDialog(`Delete directory ${name} ?`, () => {
                deleteDirectory({ directoryId: id });
            });
        }
        if (type === ExplorerItemType.file) {
            confirmDialog(`Delete asset ${name} ?`, () => {
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
        <Paper elevation={3} className="page-list box flex column start-x center-y">
            <Typography variant="h6" gutterBottom>
                Assets
            </Typography>
            <Explorer
                className="mb-10"
                items={items}
                directoryId={directoryIds.at(-1)}
                onBack={onBack}
                onDirectory={onDirectory}
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
                    New directory
                </Button>
                <UploadButton
                    label="Upload asset"
                    progress={progress}
                    allowedMimeTypes={allowedMimeTypes}
                    onChange={handleFileChange}
                />
            </Box>
        </Paper>
    );
};

export default Assets;
