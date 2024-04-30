import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ActionIcon, Group, Stack, Tooltip } from '@mantine/core';
import { BsRepeat, BsRepeat1, BsShuffle } from 'react-icons/bs';
import { HiMusicNote } from 'react-icons/hi';

import { WidgetType, type Asset } from '../../../../../types/index.js';
import useDirectory from '../../../../../hooks/api/useDirectory.js';
import { shuffleArray } from '../../../../../services/tools.js';
import { getAssetUrl } from '../../../../../services/api.js';
import useAsset from '../../../../../hooks/api/useAsset.js';
import { useApp } from '../../../../../contexts/App.js';
import Widget from '../../Widget.js';
import FileExplorer, {
    type FileExplorerItem,
    FileExplorerItemType
} from '../../../../common/FileExplorer.js';

interface AudioOptions {
    repeatPlaylist: boolean;
    repeatTrack: boolean;
    shuffle: boolean;
}

const defaultAudioOptions: AudioOptions = {
    repeatPlaylist: true,
    repeatTrack: false,
    shuffle: false
};

interface AudioOptionButtonProps {
    tooltip: string;
    active: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
}

const AudioOptionButton = ({
    tooltip,
    active,
    onToggle,
    icon
}: AudioOptionButtonProps) => (
    <Tooltip label={tooltip} position="bottom">
        <ActionIcon
            variant={active ? 'filled' : 'subtle'}
            size="sm"
            onClick={onToggle}
        >
            {icon}
        </ActionIcon>
    </Tooltip>
);

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

    const restart = () => {
        if (selectedAsset) {
            audioElement.current.currentTime = 0;
            audioElement.current.play();
            onPlay(selectedAsset, audioElement.current.currentTime);
        }
    };

    const playNext = () => {
        if (selectedAsset) {
            const currentAudioAssetIndex = audioAssets.findIndex(
                ({ id }) => selectedAsset.id === id
            );
            if (currentAudioAssetIndex >= 0) {
                if (audioOptions.repeatTrack) {
                    restart();
                } else {
                    let nextIndex = currentAudioAssetIndex + 1;
                    if (
                        audioOptions.repeatPlaylist &&
                        nextIndex > audioAssets.length - 1
                    ) {
                        nextIndex = 0;
                    }
                    if (nextIndex === currentAudioAssetIndex) {
                        restart();
                    } else {
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
        playNext();
    };

    const onDirectoryBack = () => {
        setDirectoryIds((previous) => previous.slice(0, -1));
    };

    const onDirectoryClick = (dirId: number) => {
        setDirectoryIds((previous) => [...previous, dirId]);
    };

    useEffect(() => {
        if (selectedAsset && audioElement.current) {
            audioElement.current.play();
            onPlay(selectedAsset, audioElement.current.currentTime);
        }
    }, [selectedAsset, onPlay]);

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
                    <>
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
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
                        <Group justify="end" gap="1rem">
                            <AudioOptionButton
                                tooltip={T('widget.jukebox.shuffle')}
                                active={audioOptions.shuffle}
                                icon={<BsShuffle />}
                                onToggle={() => {
                                    updateAudioOptions({
                                        shuffle: !audioOptions.shuffle
                                    });
                                }}
                            />
                            <AudioOptionButton
                                tooltip={T('widget.jukebox.repeatTrack')}
                                active={audioOptions.repeatTrack}
                                icon={<BsRepeat1 />}
                                onToggle={() => {
                                    const newValue = !audioOptions.repeatTrack;
                                    updateAudioOptions({
                                        repeatTrack: newValue,
                                        ...(newValue
                                            ? {
                                                  repeatPlaylist: false
                                              }
                                            : {})
                                    });
                                }}
                            />
                            <AudioOptionButton
                                tooltip={T('widget.jukebox.repeatPlaylist')}
                                active={audioOptions.repeatPlaylist}
                                icon={<BsRepeat />}
                                onToggle={() => {
                                    const newValue =
                                        !audioOptions.repeatPlaylist;
                                    updateAudioOptions({
                                        repeatPlaylist: newValue,
                                        ...(newValue
                                            ? {
                                                  repeatTrack: false
                                              }
                                            : {})
                                    });
                                }}
                            />
                        </Group>
                    </>
                ) : null}
            </Stack>
        </Widget>
    );
};

export default JukeboxWidget;
