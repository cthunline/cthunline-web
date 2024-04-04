import { MdFolder, MdOutlineImage, MdUploadFile } from 'react-icons/md';
import { Button, FileButton, RingProgress } from '@mantine/core';
import { HiMusicNote } from 'react-icons/hi';
import { modals } from '@mantine/modals';
import { useState } from 'react';

import useDirectory from '../../hooks/useDirectory';
import ContentBox from '../../common/ContentBox';
import { toast } from '../../../services/toast';
import { useApp } from '../../contexts/App';
import useAsset from '../../hooks/useAsset';
import DirectoryForm from './DirectoryForm';
import FileExplorer, {
    type FileExplorerItem,
    FileExplorerItemType
} from '../../common/FileExplorer';

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'audio/mpeg'
];

const limitSizeInMb = 20;

const createDirModalId = 'create-directory-modal';

const Assets = () => {
    const { T } = useApp();
    const { assetList, uploadAssets, deleteAsset } = useAsset({
        loadList: true
    });
    const { directoryList, createDirectory, deleteDirectory } = useDirectory({
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

    const onSubmitDirectory = (name: string) => {
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
            children: <DirectoryForm onSubmit={onSubmitDirectory} />
        });
    };

    const handleFileChange = async (files: File[]) => {
        if (files.length) {
            let valid = true;
            files.forEach((file) => {
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
            });
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

    const onDelete = (type: FileExplorerItemType, id: number, name: string) => {
        if (type === FileExplorerItemType.directory) {
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
        if (type === FileExplorerItemType.file) {
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
            type: FileExplorerItemType.directory
        })),
        ...assetList.map(({ id, name, type, directoryId }) => ({
            id,
            name,
            parentId: directoryId,
            type: FileExplorerItemType.file,
            icon:
                type === 'audio' ? (
                    <HiMusicNote size={25} />
                ) : (
                    <MdOutlineImage size={25} />
                )
        }))
    ];

    return (
        <ContentBox>
            <ContentBox.Title>{T('entity.assets')}</ContentBox.Title>
            <ContentBox.Content>
                <FileExplorer
                    items={items}
                    directoryId={directoryIds.at(-1)}
                    onDirectoryBack={onDirectoryBack}
                    onDirectoryClick={onDirectoryClick}
                    onDelete={onDelete}
                />
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
