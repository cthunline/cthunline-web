import React from 'react';
import {
    Box,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Switch,
    FormControlLabel,
    Typography,
    Tooltip
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import { GoPencil } from 'react-icons/go';
import { MdOutlineDeleteOutline, MdUndo } from 'react-icons/md';
import { BsEraserFill } from 'react-icons/bs';
import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io';
import { IoPeopleCircle } from 'react-icons/io5';

import Api from '../../../services/api';
import Widget from '../play/Widget';
import { WidgetType } from '../../../types';

import { usePlay } from '../../contexts/Play';
import { useDialog } from '../../contexts/Dialog';
import useAsset from '../../hooks/useAsset';

import './SketchWidget.css';

interface ActionButton {
    text: string;
    icon: JSX.Element;
    handler: () => void;
}

interface SketchWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const SketchWidget: React.FC<SketchWidgetProps> = ({ onClose }) => {
    const { confirmDialog } = useDialog();
    const {
        isFreeDrawing,
        setIsFreeDrawing,
        sketchData,
        setSketchDisplay,
        undoSketch,
        clearSketch,
        addSketchImage,
        clearDrawings,
        addSketchToken,
        clearTokens
    } = usePlay();
    const { assetList } = useAsset({
        loadList: true,
        type: 'image'
    });

    const toogleIsFreeDrawing = () => {
        setIsFreeDrawing(!isFreeDrawing);
    };

    const actionButtons: ActionButton[] = [{
        text: 'Drawing',
        icon: <GoPencil size={25} className={isFreeDrawing ? '' : 'opacity-half'} />,
        handler: toogleIsFreeDrawing
    }, {
        text: 'Erase drawings',
        icon: <BsEraserFill size={25} />,
        handler: clearDrawings
    }, {
        text: 'Add token',
        icon: <IoMdAddCircle size={30} />,
        handler: addSketchToken
    }, {
        text: 'Spawn player tokens',
        icon: <IoPeopleCircle size={30} />,
        handler: () => {}
    }, {
        text: 'Remove tokens',
        icon: <IoMdCloseCircle size={30} />,
        handler: () => {
            confirmDialog('Clear the tokens ?', clearTokens);
        }
    }, {
        text: 'Undo',
        icon: <MdUndo size={30} className={sketchData.events.length ? '' : 'opacity-half'} />,
        handler: undoSketch
    }, {
        text: 'Clear',
        icon: <MdOutlineDeleteOutline size={30} />,
        handler: () => {
            confirmDialog('Clear the sketch ?', clearSketch);
        }
    }];

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
                                checked={sketchData.displayed}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSketchDisplay(e.target.checked);
                                }}
                            />
                        )}
                    />
                </Box>
                {sketchData.displayed ? (
                    <Box className="flex row center">
                        {actionButtons.map(({
                            text,
                            icon,
                            handler
                        }, index) => (
                            <Tooltip
                                placement="bottom"
                                title={text}
                                key={`scketch-action-${index.toString()}`}
                            >
                                <IconButton
                                    className="sketch-action-button"
                                    size="medium"
                                    onClick={handler}
                                >
                                    {icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Box>
                ) : null}
                {sketchData.displayed ? (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Assets
                        </Typography>
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
                                            alt={name}
                                            loading="lazy"
                                        />
                                        <ImageListItemBar
                                            title={name}
                                            actionIcon={(
                                                <IconButton
                                                    onClick={() => (
                                                        addSketchImage(src, false)
                                                    )}
                                                >
                                                    <HiPlus />
                                                </IconButton>
                                            )}
                                        />
                                    </ImageListItem>
                                );
                            })}
                        </ImageList>
                    </Box>
                ) : null}
            </Box>
        </Widget>
    );
};

export default SketchWidget;