import { Box, Switch, FormControlLabel, Typography } from '@mui/material';
import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io';
import { MdDelete, MdUndo } from 'react-icons/md';
import { IoPeopleCircle } from 'react-icons/io5';
import { GiSave, GiLoad } from 'react-icons/gi';
import { BsEraserFill } from 'react-icons/bs';
import { GoPencil } from 'react-icons/go';
import React, { useState } from 'react';

import ActionButton, { type ActionButtonData } from './elements/ActionButton';
import UserSketchLoadModal from './elements/UserSketchLoadModal';
import UserSketchSaveModal from './elements/UserSketchSaveModal';
import useUserSketch from '../../../../hooks/useUserSketch';
import useDirectory from '../../../../hooks/useDirectory';
import { useDialog } from '../../../../contexts/Dialog';
import ImageAssetList from './elements/ImageAssetList';
import { usePlay } from '../../../../contexts/Play';
import { useApp } from '../../../../contexts/App';
import useAsset from '../../../../hooks/useAsset';
import Widget from '../../Widget';
import {
    WidgetType,
    type Asset,
    type SketchCreateBody,
    SketchUpdateBody
} from '../../../../../types';
import Explorer, {
    type ExplorerItem,
    ExplorerItemType
} from '../../../explorer/Explorer';

import './SketchWidget.css';

interface SketchWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const SketchWidget = ({ onClose }: SketchWidgetProps) => {
    const { T } = useApp();
    const { confirmDialog } = useDialog();
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
    const {
        userSketchs,
        createUserSketch,
        getUserSketch,
        updateUserSketch,
        deleteUserSketch
    } = useUserSketch(true);

    const [directoryIds, setDirectoryIds] = useState<number[]>([]);

    const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
    const [loadModalOpen, setLoadModalOpen] = useState<boolean>(false);

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
        setSaveModalOpen(false);
        createUserSketch({ data });
    };

    const onUserSketchOverwrite = async (
        sketchId: number,
        data: SketchUpdateBody
    ) => {
        setSaveModalOpen(false);
        updateUserSketch({ sketchId, data });
    };

    const onUserSketchLoad = async (sketchId: number) => {
        setLoadModalOpen(false);
        const { data } = await getUserSketch(sketchId);
        updateSketch(() => ({
            ...data,
            events: []
        }));
    };

    const onUserSketchDelete = async (sketchId: number) => {
        await deleteUserSketch({ sketchId });
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
                handler: () => {
                    confirmDialog(
                        T('widget.sketch.clearDrawingsConfirm'),
                        clearDrawings
                    );
                }
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
                    setSaveModalOpen(true);
                }
            },
            {
                text: T('widget.sketch.loadSketch'),
                icon: <GiLoad size={30} />,
                handler: () => {
                    setLoadModalOpen(true);
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

    const { events, ...data } = sketchData;

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
            <UserSketchSaveModal
                open={saveModalOpen}
                userSketchs={userSketchs}
                data={data}
                onCreate={onUserSketchSave}
                onOverwrite={onUserSketchOverwrite}
                onClose={() => setSaveModalOpen(false)}
            />
            <UserSketchLoadModal
                open={loadModalOpen}
                userSketchs={userSketchs}
                onLoad={onUserSketchLoad}
                onDelete={onUserSketchDelete}
                onClose={() => setLoadModalOpen(false)}
            />
        </Widget>
    );
};

export default SketchWidget;
