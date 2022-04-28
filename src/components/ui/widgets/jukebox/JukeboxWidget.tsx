import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { HiMusicNote } from 'react-icons/hi';

import { useApp } from '../../../contexts/App';
import Widget from '../../play/Widget';
import { WidgetType, Asset } from '../../../../types';
import Explorer, {
    ExplorerItem,
    ExplorerItemType
} from '../../explorer/Explorer';
import Api from '../../../../services/api';
import useAsset from '../../../hooks/useAsset';
import useDirectory from '../../../hooks/useDirectory';

import './JukeboxWidget.css';

interface JukeboxWidgetProps {
    onPlay: (asset: Asset, time: number) => void;
    onStop: () => void;
    onClose: (widget: WidgetType) => void;
}

const JukeboxWidget: React.FC<JukeboxWidgetProps> = ({
    onPlay,
    onStop,
    onClose
}) => {
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

    const audioElement = useRef<HTMLAudioElement>() as (
        React.MutableRefObject<HTMLAudioElement>
    );

    const onFileClick = (assetId: number) => {
        const asset = assetList.find(({ id }) => (
            id === assetId
        ));
        if (asset) {
            if (selectedAsset?.id !== asset.id) {
                onStop();
            }
            setSelectedAsset(asset);
        }
    };

    const onAudioPlay = () => {
        if (selectedAsset && audioElement.current) {
            onPlay(
                selectedAsset,
                audioElement.current.currentTime
            );
        }
    };

    const onAudioPause = () => {
        onStop();
    };

    const onDirectoryBack = () => {
        setDirectoryIds((previous) => (
            previous.slice(0, -1)
        ));
    };

    const onDirectoryClick = (dirId: number) => {
        setDirectoryIds((previous) => [...previous, dirId]);
    };

    useEffect(() => onStop);

    const explorerItems: ExplorerItem[] = [
        ...directoryList.map(({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: ExplorerItemType.directory
        })),
        ...assetList.map(({
            id,
            name,
            directoryId
        }) => ({
            id,
            name,
            parentId: directoryId,
            type: ExplorerItemType.file,
            icon: <HiMusicNote size={25} />
        }))
    ];

    return (
        <Widget
            id="widget-jukebox"
            title={T('entity.jukebox')}
            onClose={() => onClose(WidgetType.jukebox)}
        >
            <Box className="jukebox-widget-content">
                <Explorer
                    className="jukebox-explorer scroll"
                    items={explorerItems}
                    directoryId={directoryIds.at(-1)}
                    selectedId={selectedAsset?.id}
                    onDirectoryBack={onDirectoryBack}
                    onDirectoryClick={onDirectoryClick}
                    onFileClick={onFileClick}
                />
                <Box>
                    {selectedAsset ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <audio
                            ref={audioElement}
                            className="jukebox-player full-width mt-10 mb-10"
                            src={Api.getAssetUrl(selectedAsset.path)}
                            controls
                            autoPlay={false}
                            onPlay={onAudioPlay}
                            onPause={onAudioPause}
                        />
                    ) : null}
                </Box>
            </Box>
        </Widget>
    );
};

export default JukeboxWidget;
