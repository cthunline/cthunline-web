import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';

import Widget from '../play/Widget';
import { WidgetType, Asset } from '../../../types';

import Api from '../../../services/api';
import useAsset from '../../hooks/useAsset';

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
    const { assetList } = useAsset({
        loadList: true,
        type: 'audio'
    });

    const [selectedAsset, setSelectedAsset] = useState<Asset>();

    const audioElement = useRef<HTMLAudioElement>() as (
        React.MutableRefObject<HTMLAudioElement>
    );

    const onSelect = (asset: Asset) => {
        if (selectedAsset?.id !== asset.id) {
            onStop();
        }
        setSelectedAsset(asset);
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

    useEffect(() => onStop);

    return (
        <Widget
            title="Dices"
            onClose={() => onClose(WidgetType.jukebox)}
        >
            <Box className="jukebox-widget-content">
                <List className="jukebox-assets">
                    {assetList.map((asset: Asset) => (
                        <ListItem key={`asset-${asset.id}`} disablePadding>
                            <ListItemButton
                                selected={selectedAsset?.id === asset.id}
                                onClick={() => onSelect(asset)}
                            >
                                <ListItemText primary={asset.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box>
                {selectedAsset ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <audio
                        ref={audioElement}
                        className="jukebox-player"
                        src={Api.getAssetUrl(selectedAsset.path)}
                        crossOrigin="anonymous"
                        controls
                        autoPlay={false}
                        onPlay={onAudioPlay}
                        onPause={onAudioPause}
                    />
                ) : null}
            </Box>
        </Widget>
    );
};

export default JukeboxWidget;
