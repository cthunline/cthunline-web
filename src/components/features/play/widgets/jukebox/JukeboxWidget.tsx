import { Checkbox, Group, Stack } from '@mantine/core';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HiMusicNote } from 'react-icons/hi';

import { WidgetType, type Asset } from '../../../../../types/index.js';
import { shuffleArray } from '../../../../../services/tools.js';
import { getAssetUrl } from '../../../../../services/api.js';
import useDirectory from '../../../../../hooks/api/useDirectory.js';
import useAsset from '../../../../../hooks/api/useAsset.js';
import { useApp } from '../../../../../contexts/App.js';
import Widget from '../../Widget.js';
import FileExplorer, {
    type FileExplorerItem,
    FileExplorerItemType
} from '../../../../common/FileExplorer.js';

interface AudioOptions {
    autoplay: boolean;
    repeat: boolean;
    shuffle: boolean;
}

const defaultAudioOptions: AudioOptions = {
    autoplay: true,
    repeat: true,
    shuffle: false
};

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
    const [audioOptions, updateAudioOptions] = useReducer(
        (
            prev: AudioOptions,
            updateData: Partial<AudioOptions>
        ): AudioOptions => ({
            ...prev,
            ...updateData
        }),
        defaultAudioOptions
    );

    const audioElement =
        useRef<HTMLAudioElement>() as React.MutableRefObject<HTMLAudioElement>;

    const [explorerItems, audioAssets] = useMemo(() => {
        const items: FileExplorerItem[] = [
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
        const currentDirectoryId = directoryIds.at(-1);
        let assets = assetList.filter(({ directoryId }) =>
            currentDirectoryId
                ? directoryId === currentDirectoryId
                : !directoryId
        );
        if (audioOptions.shuffle) {
            assets = shuffleArray(assets);
        }
        return [items, assets];
    }, [directoryIds, directoryList, assetList, audioOptions.shuffle]);

    const autoplayNext = () => {
        if (selectedAsset) {
            const currentAudioAssetIndex = audioAssets.findIndex(
                ({ id }) => selectedAsset.id === id
            );
            if (currentAudioAssetIndex >= 0) {
                let nextIndex = currentAudioAssetIndex + 1;
                if (audioOptions.repeat && nextIndex > audioAssets.length - 1) {
                    nextIndex = 0;
                }
                const nextAsset = audioAssets[nextIndex];
                if (nextAsset) {
                    const asset = assetList.find(
                        ({ id }) => id === nextAsset.id
                    );
                    if (asset) {
                        if (selectedAsset?.id !== asset.id) {
                            onStop();
                        }
                        setSelectedAsset(asset);
                    }
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
        if (audioOptions.autoplay) {
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
        if (audioOptions.autoplay && selectedAsset && audioElement.current) {
            audioElement.current.play();
            onPlay(selectedAsset, audioElement.current.currentTime);
        }
    }, [selectedAsset, audioOptions.autoplay, onPlay]);

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
                <Group justify="end" gap="1rem">
                    <Checkbox
                        checked={audioOptions.shuffle}
                        label={T('widget.jukebox.shuffle')}
                        labelPosition="left"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            updateAudioOptions({ shuffle: e.target.checked });
                        }}
                    />
                    <Checkbox
                        checked={audioOptions.repeat}
                        label={T('widget.jukebox.repeat')}
                        labelPosition="left"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            updateAudioOptions({ repeat: e.target.checked });
                        }}
                    />
                    <Checkbox
                        checked={audioOptions.autoplay}
                        label={T('widget.jukebox.autoplay')}
                        labelPosition="left"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            updateAudioOptions({ autoplay: e.target.checked });
                        }}
                    />
                </Group>
            </Stack>
        </Widget>
    );
};

export default JukeboxWidget;
