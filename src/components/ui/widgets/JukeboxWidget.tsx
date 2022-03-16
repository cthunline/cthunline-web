import React, { useState } from 'react';
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
    onPlay: (assetId: string) => void;
    // onStop: () => void;
    onClose: (widget: WidgetType) => void;
}

const JukeboxWidget: React.FC<JukeboxWidgetProps> = ({
    onPlay,
    // onStop,
    onClose
}) => {
    const { assetList } = useAsset({
        loadList: true,
        type: 'audio'
    });

    const [selectedAsset, setSelectedAsset] = useState<Asset>();

    const onSelect = (asset: Asset) => {
        setSelectedAsset(asset);
        onPlay(asset.id);
    };

    return (
        <Widget
            title="Dices"
            onClose={() => onClose(WidgetType.dices)}
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
                        className="jukebox-player"
                        controls
                        src={new URL(
                            `/static/${selectedAsset.path}`,
                            Api.baseUrl
                        ).href}
                    />
                ) : null}
            </Box>
        </Widget>
    );
};

export default JukeboxWidget;
