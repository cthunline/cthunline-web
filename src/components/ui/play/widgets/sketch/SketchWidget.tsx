import React, { useState } from 'react';
import { Box, Switch, FormControlLabel, Typography } from '@mui/material';
import { GoPencil } from 'react-icons/go';
import { BsEraserFill } from 'react-icons/bs';
import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io';
import { IoPeopleCircle } from 'react-icons/io5';
import { MdDelete, MdUndo } from 'react-icons/md';
import { GiSave, GiLoad } from 'react-icons/gi';

import { useApp } from '../../../../contexts/App';
import Widget from '../../Widget';
import Explorer, {
    ExplorerItem,
    ExplorerItemType
} from '../../../explorer/Explorer';
import { Asset, SketchCreateBody, WidgetType } from '../../../../../types';
import { usePlay } from '../../../../contexts/Play';
import { useDialog } from '../../../../contexts/Dialog';
import useAsset from '../../../../hooks/useAsset';
import useDirectory from '../../../../hooks/useDirectory';
import useUserSketch from '../../../../hooks/useUserSketch';
import {
    ImageAssetList,
    ActionButton,
    ActionButtonData,
    UserSketchForm,
    UserSketchSelector
} from './SketchWidgetElements';

import './SketchWidget.css';

interface SketchWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const SketchWidget: React.FC<SketchWidgetProps> = ({ onClose }) => {
    const { T } = useApp();
    const { confirmDialog, openDialog, closeDialog } = useDialog();
    const {
        users,
        isFreeDrawing,
        setIsFreeDrawing,
        sketchData,
        updateSketch,
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
    const { createUserSketch, getUserSketch } = useUserSketch();

    const [directoryIds, setDirectoryIds] = useState<number[]>([]);

    const onExplorerBack = () => {
        setDirectoryIds((previous) => previous.slice(0, -1));
    };

    const onExplorerDirectory = (dirId: number) => {
        setDirectoryIds((previous) => [...previous, dirId]);
    };

    const toogleIsFreeDrawing = () => {
        setIsFreeDrawing(!isFreeDrawing);
    };

    const onUserSketchSave = async (data: SketchCreateBody) => {
        await createUserSketch({ data });
        closeDialog();
    };

    const onUserSketchLoad = async (sketchId: number) => {
        const { sketch } = await getUserSketch(sketchId);
        updateSketch(() => ({
            ...sketch,
            events: []
        }));
        closeDialog();
    };

    const actionButtons: ActionButtonData[][] = [
        [
            {
                text: T('widget.sketch.drawing'),
                icon: (
                    <GoPencil
                        size={25}
                        className={isFreeDrawing ? '' : 'opacity-half'}
                    />
                ),
                handler: toogleIsFreeDrawing
            },
            {
                text: T('widget.sketch.eraseDrawings'),
                icon: <BsEraserFill size={25} />,
                handler: clearDrawings
            },
            {
                text: T('widget.sketch.addToken'),
                icon: <IoMdAddCircle size={30} />,
                handler: addSketchToken
            },
            {
                text: T('widget.sketch.spawnPlayerTokens'),
                icon: <IoPeopleCircle size={30} />,
                handler: () => addSketchUserTokens(users)
            },
            {
                text: T('action.undo'),
                icon: (
                    <MdUndo
                        size={30}
                        className={
                            sketchData.events.length ? '' : 'opacity-half'
                        }
                    />
                ),
                handler: undoSketch
            }
        ],
        [
            {
                text: T('widget.sketch.removeTokens'),
                icon: <IoMdCloseCircle size={30} />,
                handler: () => {
                    confirmDialog(
                        T('widget.sketch.clearTokensConfirm'),
                        clearTokens
                    );
                }
            },
            {
                text: T('action.clear'),
                icon: <MdDelete size={30} />,
                handler: () => {
                    confirmDialog(
                        T('widget.sketch.clearSketchConfirm'),
                        clearSketch
                    );
                }
            },
            {
                text: T('widget.sketch.saveSketch'),
                icon: <GiSave size={30} />,
                handler: () => {
                    const { events, ...sketch } = sketchData;
                    openDialog({
                        title: T('widget.sketch.saveSketch'),
                        content: (
                            <UserSketchForm
                                sketch={sketch}
                                onSubmit={onUserSketchSave}
                            />
                        )
                    });
                }
            },
            {
                text: T('widget.sketch.loadSketch'),
                icon: <GiLoad size={30} />,
                handler: () => {
                    openDialog({
                        title: T('widget.sketch.loadSketch'),
                        content: (
                            <UserSketchSelector onSelect={onUserSketchLoad} />
                        )
                    });
                }
            }
        ]
    ];

    const explorerItems: ExplorerItem[] = directoryList.map(
        ({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: ExplorerItemType.directory
        })
    );

    const directoryAssets: Asset[] = assetList.filter(({ directoryId }) =>
        directoryIds.length ? directoryId === directoryIds.at(-1) : !directoryId
    );

    return (
        <Widget
            id={`widget-${WidgetType.sketch}`}
            title={T('entity.sketch')}
            onClose={() => onClose(WidgetType.sketch)}
        >
            <Box className="sketch-widget-content">
                <Box className="flex column center">
                    <FormControlLabel
                        label={T('action.display')}
                        labelPlacement="start"
                        control={
                            <Switch
                                checked={sketchData.displayed}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSketchDisplay(e.target.checked);
                                }}
                            />
                        }
                    />
                </Box>
                {sketchData.displayed
                    ? [
                          actionButtons.map((buttonsRow, idx) => (
                              <Box
                                  key={`scketch-actions-${idx.toString()}`}
                                  className="flex row center"
                              >
                                  {buttonsRow.map(
                                      ({ text, icon, handler }, index) => (
                                          <ActionButton
                                              key={`scketch-action-${index.toString()}`}
                                              text={text}
                                              icon={icon}
                                              handler={handler}
                                          />
                                      )
                                  )}
                              </Box>
                          )),
                          <Box key="scketch-assets">
                              <Typography variant="h6" gutterBottom>
                                  {T('entity.assets')}
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
                                  onAdd={(src: string) =>
                                      addSketchImage(src, false)
                                  }
                              />
                          </Box>
                      ]
                    : null}
            </Box>
        </Widget>
    );
};

export default SketchWidget;
