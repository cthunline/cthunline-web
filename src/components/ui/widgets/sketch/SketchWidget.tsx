import React, { useState } from 'react';
import {
    Box,
    Switch,
    FormControlLabel,
    Typography
} from '@mui/material';
import { GoPencil } from 'react-icons/go';
import { MdOutlineDeleteOutline, MdUndo } from 'react-icons/md';
import { BsEraserFill } from 'react-icons/bs';
import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io';
import { IoPeopleCircle } from 'react-icons/io5';

import Widget from '../../play/Widget';
import Explorer, {
    ExplorerItem,
    ExplorerItemType
} from '../../explorer/Explorer';
import { Asset, WidgetType } from '../../../../types';
import { usePlay } from '../../../contexts/Play';
import { useDialog } from '../../../contexts/Dialog';
import useAsset from '../../../hooks/useAsset';
import useDirectory from '../../../hooks/useDirectory';
import {
    ImageAssetList,
    ActionButton,
    ActionButtonData
} from './SketchWidgetElements';

import './SketchWidget.css';

interface SketchWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const SketchWidget: React.FC<SketchWidgetProps> = ({ onClose }) => {
    const { confirmDialog } = useDialog();
    const {
        users,
        isFreeDrawing,
        setIsFreeDrawing,
        sketchData,
        setSketchDisplay,
        undoSketch,
        clearSketch,
        addSketchImage,
        clearDrawings,
        addSketchToken,
        addSketchUserTokens,
        clearTokens
    } = usePlay();
    const { assetList } = useAsset({
        loadList: true,
        type: 'image'
    });
    const { directoryList } = useDirectory({
        loadList: true
    });

    const [directoryIds, setDirectoryIds] = useState<string[]>([]);

    const onExplorerBack = () => {
        setDirectoryIds((previous) => (
            previous.slice(0, -1)
        ));
    };

    const onExplorerDirectory = (id: string) => {
        setDirectoryIds((previous) => [...previous, id]);
    };

    const toogleIsFreeDrawing = () => {
        setIsFreeDrawing(!isFreeDrawing);
    };

    const actionButtons: ActionButtonData[] = [{
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
        handler: () => addSketchUserTokens(users)
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

    const explorerItems: ExplorerItem[] = (
        directoryList.map(({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: ExplorerItemType.directory
        }))
    );

    const directoryAssets: Asset[] = (
        assetList.filter(({ directoryId }) => (
            directoryIds.length ? directoryId === directoryIds.at(-1) : !directoryId
        ))
    );

    return (
        <Widget
            id="widget-sketch"
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
                {sketchData.displayed ? [
                    <Box key="scketch-actions" className="flex row center">
                        {actionButtons.map(({
                            text,
                            icon,
                            handler
                        }, index) => (
                            <ActionButton
                                key={`scketch-action-${index.toString()}`}
                                text={text}
                                icon={icon}
                                handler={handler}
                            />
                        ))}
                    </Box>,
                    <Box key="scketch-assets">
                        <Typography variant="h6" gutterBottom>
                            Assets
                        </Typography>
                        <Explorer
                            className="scroll sketch-widget-explorer full-width"
                            items={explorerItems}
                            directoryId={directoryIds.at(-1)}
                            onDirectoryBack={onExplorerBack}
                            onDirectoryClick={onExplorerDirectory}
                        />
                        <ImageAssetList
                            assets={directoryAssets}
                            onAdd={(src: string) => (
                                addSketchImage(src, false)
                            )}
                        />
                    </Box>
                ] : null}
            </Box>
        </Widget>
    );
};

export default SketchWidget;