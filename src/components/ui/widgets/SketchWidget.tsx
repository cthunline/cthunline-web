import React from 'react';
import {
    Box,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Switch,
    FormControlLabel
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';

import Api from '../../../services/api';
import Widget from '../play/Widget';
import { WidgetType } from '../../../types';

import { usePlay } from '../../contexts/Play';
import useAsset from '../../hooks/useAsset';

import './SketchWidget.css';

interface SketchWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const SketchWidget: React.FC<SketchWidgetProps> = ({ onClose }) => {
    const {
        isSketchDisplayed,
        setIsSketchDisplayed,
        isFreeDrawing,
        setIsFreeDrawing
    } = usePlay();
    const { assetList } = useAsset({
        loadList: true,
        type: 'image'
    });

    return (
        <Widget
            title="Sketch"
            onClose={() => onClose(WidgetType.sketch)}
        >
            <Box className="sketch-widget-content">
                <Box className="flex column center">
                    <FormControlLabel
                        label="Display sketch"
                        labelPlacement="start"
                        control={(
                            <Switch
                                checked={isSketchDisplayed}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setIsSketchDisplayed(e.target.checked);
                                }}
                            />
                        )}
                    />
                    {isSketchDisplayed ? (
                        <FormControlLabel
                            label="Free drawing"
                            labelPlacement="start"
                            control={(
                                <Switch
                                    checked={isFreeDrawing}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setIsFreeDrawing(e.target.checked);
                                    }}
                                />
                            )}
                        />
                    ) : null}
                </Box>
                <Box>
                    <ImageList
                        className="sketch-widget-assets"
                        cols={2}
                        gap={5}
                    >
                        {assetList.map(({ name, path }, index) => {
                            const src = Api.getAssetUrl(path);
                            return (
                                <ImageListItem key={`asset-${index.toString()}`}>
                                    <img
                                        src={`${src}?w=248&fit=crop&auto=format`}
                                        srcSet={`${src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={name}
                                        loading="lazy"
                                        crossOrigin="anonymous"
                                    />
                                    <ImageListItemBar
                                        title={name}
                                        actionIcon={(
                                            <IconButton>
                                                <HiPlus />
                                            </IconButton>
                                        )}
                                    />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </Box>
            </Box>
        </Widget>
    );
};

export default SketchWidget;
