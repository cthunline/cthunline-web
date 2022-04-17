import React from 'react';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Tooltip
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';

import Api from '../../../../services/api';
import { Asset } from '../../../../types';

import './SketchWidget.css';

export interface ActionButtonData {
    text: string;
    icon: JSX.Element;
    handler: () => void;
}

export const ActionButton: React.FC<ActionButtonData> = ({
    text,
    handler,
    icon
}) => (
    <Tooltip
        placement="bottom"
        title={text}
    >
        <IconButton
            className="sketch-action-button ml-5 mr-5"
            size="medium"
            onClick={handler}
        >
            {icon}
        </IconButton>
    </Tooltip>
);

interface ImageListProps {
    assets: Asset[];
    onAdd: (src: string) => void;
}

export const ImageAssetList: React.FC<ImageListProps> = ({ assets, onAdd }) => (
    assets.length ? (
        <ImageList
            className="sketch-widget-assets full-width"
            cols={3}
            gap={5}
        >
            {assets.map(({ name, path }, index) => {
                const src = Api.getAssetUrl(path);
                return (
                    <ImageListItem key={`asset-${index.toString()}`}>
                        <img
                            src={`${src}?w=248&fit=crop&auto=format`}
                            alt={name}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={name}
                            actionIcon={(
                                <IconButton onClick={() => onAdd(src)}>
                                    <HiPlus />
                                </IconButton>
                            )}
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>
    ) : null
);
