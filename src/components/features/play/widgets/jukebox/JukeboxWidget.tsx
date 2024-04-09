import { Checkbox, Group, Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { HiMusicNote } from 'react-icons/hi';

import { WidgetType, type Asset } from '../../../../../types/index.js';
import { getAssetUrl } from '../../../../../services/api.js';
import useDirectory from '../../../../hooks/useDirectory.js';
import useAsset from '../../../../hooks/useAsset.js';
import { useApp } from '../../../../contexts/App.js';
import Widget from '../../Widget.js';
import FileExplorer, {
    type FileExplorerItem,
    FileExplorerItemType
} from '../../../../common/FileExplorer.js';

interface JukeboxWidgetProps {
    onPlay: (asset: Asset, time: number) => void;
    onStop: () => void;
    onClose: (widget: WidgetType) => void;
}

const JukeboxWidget = ({ onPlay, onStop, onClose }: JukeboxWidgetProps) => {
    const { T } = useApp();
    const { assetList } = useAsset({
        loadList: true,
        type: 'audio'
    });
    const { directoryList } = useDirectory({
        loadList: true
    });

    const [directoryIds, setDirectoryIds] = useState<number[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [autoplay, setAutoplay] = useState<boolean>(true);

    const audioElement =
        useRef<HTMLAudioElement>() as React.MutableRefObject<HTMLAudioElement>;

    const explorerItems: FileExplorerItem[] = [
        ...directoryList.map(({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: FileExplorerItemType.directory
        })),
        ...assetList.map(({ id, name, directoryId }) => ({
            id,
            name,
            parentId: directoryId,
            type: FileExplorerItemType.file,
            icon: <HiMusicNote size={25} />
        }))
    ];

    const autoplayNext = () => {
        if (selectedAsset) {
            const currentDirectoryId = directoryIds.at(-1);
            const currentItems = explorerItems.filter(({ parentId }) =>
                currentDirectoryId ? parentId === currentDirectoryId : !parentId
            );
            const currentItemIndex = currentItems.findIndex(
                ({ id }) => selectedAsset.id === id
            );
            if (currentItemIndex >= 0 && currentItems[currentItemIndex + 1]) {
                const asset = assetList.find(
                    ({ id }) => id === currentItems[currentItemIndex + 1].id
                );
                if (asset) {
                    if (selectedAsset?.id !== asset.id) {
                        onStop();
                    }
                    setSelectedAsset(asset);
                }
            }
        }
    };

    const onFileClick = (assetId: number) => {
        const asset = assetList.find(({ id }) => id === assetId);
        if (asset) {
            if (selectedAsset?.id !== asset.id) {
                onStop();
            }
            setSelectedAsset(asset);
        }
    };

    const onAudioPlay = () => {
        if (selectedAsset && audioElement.current) {
            onPlay(selectedAsset, audioElement.current.currentTime);
        }
    };

    const onAudioPause = () => {
        onStop();
    };

    const onAudioEnded = () => {
        if (autoplay) {
            autoplayNext();
        }
    };

    const onDirectoryBack = () => {
        setDirectoryIds((previous) => previous.slice(0, -1));
    };

    const onDirectoryClick = (dirId: number) => {
        setDirectoryIds((previous) => [...previous, dirId]);
    };

    useEffect(() => {
        if (autoplay && selectedAsset && audioElement.current) {
            audioElement.current.play();
            onPlay(selectedAsset, audioElement.current.currentTime);
        }
    }, [selectedAsset, autoplay, onPlay]);

    useEffect(() => onStop, [onStop]);

    return (
        <Widget
            id={`widget-${WidgetType.jukebox}`}
            title={T('entity.jukebox')}
            onClose={() => onClose(WidgetType.jukebox)}
        >
            <Stack w="400px" gap="0.5rem">
                <FileExplorer
                    scroll
                    mah="300px"
                    items={explorerItems}
                    directoryId={directoryIds.at(-1)}
                    selectedId={selectedAsset?.id}
                    onDirectoryBack={onDirectoryBack}
                    onDirectoryClick={onDirectoryClick}
                    onFileClick={onFileClick}
                />
                {selectedAsset ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <audio
                        ref={audioElement}
                        style={{ width: '100%' }}
                        src={getAssetUrl(selectedAsset.path)}
                        controls // eslint-disable-line react/no-unknown-property
                        autoPlay={false}
                        onPlay={onAudioPlay} // eslint-disable-line react/no-unknown-property
                        onPause={onAudioPause} // eslint-disable-line react/no-unknown-property
                        onEnded={onAudioEnded} // eslint-disable-line react/no-unknown-property
                    />
                ) : null}
                <Group justify="end">
                    <Checkbox
                        checked={autoplay}
                        label={T('widget.jukebox.autoplay')}
                        labelPosition="left"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setAutoplay(e.target.checked);
                        }}
                    />
                </Group>
            </Stack>
        </Widget>
    );
};

export default JukeboxWidget;
