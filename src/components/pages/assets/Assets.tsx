import { Alert, Button, FileButton, RingProgress } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { FaInfo } from 'react-icons/fa6';
import { HiMusicNote } from 'react-icons/hi';
import { MdFolder, MdOutlineImage, MdUploadFile } from 'react-icons/md';

import useAsset from '../../../hooks/api/useAsset.js';
import useDirectory from '../../../hooks/api/useDirectory.js';
import { toast } from '../../../services/toast.js';
import { useLocaleStore } from '../../../stores/locale.js';
import ContentBox from '../../common/ContentBox.js';
import FileExplorer, {
    type FileExplorerItem,
    type FileExplorerItemType
} from '../../common/FileExplorer.js';
import DirectoryForm from './DirectoryForm.js';

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'audio/mpeg'
];

const limitSizeInMb = 20;

const createDirModalId = 'create-directory-modal';
const editDirModalId = 'edit-directory-modal';

const Assets = () => {
    const T = useLocaleStore(({ T }) => T);

    const { assetList, uploadAssets, deleteAsset } = useAsset({
        loadList: true
    });
    const { directoryList, createDirectory, editDirectory, deleteDirectory } =
        useDirectory({
            loadList: true
        });

    const [directoryIds, setDirectoryIds] = useState<number[]>([]);
    const [progress, setProgress] = useState<number | null>(null);

    const onDirectoryBack = () => {
        setDirectoryIds((previous) => previous.slice(0, -1));
    };

    const onDirectoryClick = (id: number) => {
        setDirectoryIds((previous) => [...previous, id]);
    };

    const onSubmitCreateDirectory = (name: string) => {
        const parentId = directoryIds.length ? directoryIds.at(-1) : undefined;
        createDirectory({
            data: {
                name,
                parentId
            }
        });
        modals.close(createDirModalId);
    };

    const onCreateDirectory = () => {
        modals.open({
            modalId: createDirModalId,
            centered: true,
            title: T('page.assets.newDirectory'),
            children: <DirectoryForm onSubmit={onSubmitCreateDirectory} />
        });
    };

    const handleFileChange = async (files: File[]) => {
        if (files.length) {
            let valid = true;
            for (const file of files) {
                const sizeInMb = file.size / (1024 * 1024);
                if (sizeInMb > limitSizeInMb) {
                    toast.error(
                        T('page.assets.error.fileTooLarge', {
                            name: file.name,
                            limitMb: String(limitSizeInMb)
                        })
                    );
                    valid = false;
                }
            }
            if (valid) {
                const directoryId = directoryIds.length
                    ? directoryIds.at(-1)
                    : undefined;
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

    const onSubmitEditDirectory = (id: number, name: string) => {
        editDirectory({
            directoryId: id,
            data: {
                name
            }
        });
        modals.close(editDirModalId);
    };

    const onEdit = (type: FileExplorerItemType, id: number, name: string) => {
        if (type === 'directory') {
            modals.open({
                centered: true,
                modalId: editDirModalId,
                title: T('page.assets.editDirectory'),
                children: (
                    <DirectoryForm
                        name={name}
                        onSubmit={(updatedName: string) => {
                            onSubmitEditDirectory(id, updatedName);
                        }}
                    />
                )
            });
        }
    };

    const onDelete = (type: FileExplorerItemType, id: number, name: string) => {
        if (type === 'directory') {
            const confirmText = T('page.assets.deleteDirectoryConfirm', {
                name
            });
            modals.openConfirmModal({
                centered: true,
                title: confirmText,
                labels: {
                    confirm: T('action.confirm'),
                    cancel: T('action.cancel')
                },
                onConfirm: () => {
                    deleteDirectory({ directoryId: id });
                }
            });
        }
        if (type === 'file') {
            const confirmText = T('page.assets.deleteAssetConfirm', { name });
            modals.openConfirmModal({
                centered: true,
                title: confirmText,
                labels: {
                    confirm: T('action.confirm'),
                    cancel: T('action.cancel')
                },
                onConfirm: () => {
                    deleteAsset({ assetId: id });
                }
            });
        }
    };

    const items: FileExplorerItem[] = [
        ...directoryList.map(({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: 'directory' as const
        })),
        ...assetList.map(({ id, name, type, directoryId }) => ({
            id,
            name,
            parentId: directoryId,
            type: 'file' as const,
            icon:
                type === 'audio' ? (
                    <HiMusicNote size={25} />
                ) : (
                    <MdOutlineImage size={25} />
                )
        }))
    ];

    return (
        <ContentBox h="65%">
            <ContentBox.Title>{T('entity.assets')}</ContentBox.Title>
            <ContentBox.Content>
                {items.length ? (
                    <FileExplorer
                        sort
                        items={items}
                        directoryId={directoryIds.at(-1)}
                        onDirectoryBack={onDirectoryBack}
                        onDirectoryClick={onDirectoryClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ) : (
                    <Alert
                        w="100%"
                        variant="default"
                        color="gray"
                        title={T('page.assets.noAsset')}
                        icon={<FaInfo />}
                    />
                )}
            </ContentBox.Content>
            <ContentBox.Footer>
                <Button leftSection={<MdFolder />} onClick={onCreateDirectory}>
                    {T('page.assets.newDirectory')}
                </Button>
                {progress ? (
                    <RingProgress
                        sections={[{ value: progress, color: 'blue' }]}
                    />
                ) : (
                    <FileButton
                        multiple
                        onChange={handleFileChange}
                        accept={allowedMimeTypes.join(',')}
                    >
                        {(props) => (
                            <Button {...props} leftSection={<MdUploadFile />}>
                                {T('page.assets.uploadAsset')}
                            </Button>
                        )}
                    </FileButton>
                )}
            </ContentBox.Footer>
        </ContentBox>
    );
};

export default Assets;
