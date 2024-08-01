import { Stack } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { HiMusicNote } from 'react-icons/hi';

import { useApp } from '../../../../../contexts/App.js';
import { useAudioMaster } from '../../../../../contexts/AudioMaster.js';
import useAsset from '../../../../../hooks/api/useAsset.js';
import useDirectory from '../../../../../hooks/api/useDirectory.js';
import { shuffleArray } from '../../../../../services/tools.js';
import { WidgetType } from '../../../../../types/index.js';
import AudioPlayer from '../../../../common/AudioPlayer.js';
import FileExplorer, {
    type FileExplorerItem,
    FileExplorerItemType
} from '../../../../common/FileExplorer.js';
import Widget from '../../Widget.js';

interface JukeboxWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const JukeboxWidget = ({ onClose }: JukeboxWidgetProps) => {
    const { setPlaylist, selectTrack, track, options } = useAudioMaster();

    const { T } = useApp();
    const { assetList } = useAsset({
        loadList: true,
        type: 'audio'
    });
    const { directoryList } = useDirectory({
        loadList: true
    });

    const [directoryIds, setDirectoryIds] = useState<number[]>([]);

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
        if (options.shuffle) {
            assets = shuffleArray(assets);
        }
        return [items, assets];
    }, [directoryIds, directoryList, assetList, options.shuffle]);

    const onFileClick = (assetId: number) => {
        const asset = assetList.find(({ id }) => id === assetId);
        if (asset) {
            selectTrack(asset);
        }
    };

    const onDirectoryBack = () => {
        setDirectoryIds((previous) => previous.slice(0, -1));
    };

    const onDirectoryClick = (dirId: number) => {
        setDirectoryIds((previous) => [...previous, dirId]);
    };

    useEffect(() => {
        setPlaylist(audioAssets);
    }, [setPlaylist, audioAssets]);

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
                    sort
                    directoryId={directoryIds.at(-1)}
                    selectedId={track?.id}
                    onDirectoryBack={onDirectoryBack}
                    onDirectoryClick={onDirectoryClick}
                    onFileClick={onFileClick}
                />
                {track ? <AudioPlayer /> : null}
            </Stack>
        </Widget>
    );
};

export default JukeboxWidget;
