import { IoMdAddCircle, IoMdCloseCircle } from 'react-icons/io';
import { Group, Stack, Switch, Title } from '@mantine/core';
import { MdDelete, MdUndo } from 'react-icons/md';
import { IoPeopleCircle } from 'react-icons/io5';
import { GiSave, GiLoad } from 'react-icons/gi';
import { BsEraserFill } from 'react-icons/bs';
import { GoPencil } from 'react-icons/go';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import type React from 'react';

import useUserSketch from '../../../../hooks/useUserSketch.js';
import useDirectory from '../../../../hooks/useDirectory.js';
import ImageAssetList from './elements/ImageAssetList.js';
import UserSketchLoad from './elements/UserSketchLoad.js';
import UserSketchSave from './elements/UserSketchSave.js';
import { usePlay } from '../../../../contexts/Play.js';
import { useApp } from '../../../../contexts/App.js';
import useAsset from '../../../../hooks/useAsset.js';
import Widget from '../../Widget.js';
import ActionButton, {
    type ActionButtonData
} from './elements/ActionButton.js';
import {
    WidgetType,
    type Asset,
    type SketchCreateBody,
    type SketchUpdateBody
} from '../../../../../types/index.js';
import FileExplorer, {
    type FileExplorerItem,
    FileExplorerItemType
} from '../../../../common/FileExplorer.js';

interface SketchWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const saveSketchModalId = 'save-sketch-modal';
const loadSketchModalId = 'load-sketch-modal';

const SketchWidget = ({ onClose }: SketchWidgetProps) => {
    const { T } = useApp();
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

    const { events, ...sketch } = sketchData;

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
        modals.close(saveSketchModalId);
        createUserSketch({ data });
    };

    const onUserSketchOverwrite = async (
        sketchId: number,
        data: SketchUpdateBody
    ) => {
        modals.close(saveSketchModalId);
        updateUserSketch({ sketchId, data });
    };

    const onUserSketchLoad = async (sketchId: number) => {
        modals.close(loadSketchModalId);
        const { data } = await getUserSketch(sketchId);
        updateSketch(() => ({
            ...data,
            events: []
        }));
    };

    const onUserSketchDelete = async (sketchId: number) => {
        modals.close(loadSketchModalId);
        await deleteUserSketch({ sketchId });
    };

    const actionButtons: ActionButtonData[][] = [
        [
            {
                text: T('widget.sketch.drawing'),
                icon: <GoPencil size="1.25rem" />,
                variant: isFreeDrawing ? 'filled' : undefined,
                handler: toogleIsFreeDrawing
            },
            {
                text: T('widget.sketch.eraseDrawings'),
                icon: <BsEraserFill size="1.25rem" />,
                handler: () => {
                    modals.openConfirmModal({
                        centered: true,
                        title: T('widget.sketch.clearDrawingsConfirm'),
                        labels: {
                            confirm: T('action.confirm'),
                            cancel: T('action.cancel')
                        },
                        onConfirm: clearDrawings
                    });
                }
            },
            {
                text: T('widget.sketch.addToken'),
                icon: <IoMdAddCircle size="1.5rem" />,
                handler: addSketchToken
            },
            {
                text: T('widget.sketch.spawnPlayerTokens'),
                icon: <IoPeopleCircle size="1.5rem" />,
                handler: () => addSketchUserTokens(users)
            },
            {
                text: T('action.undo'),
                icon: <MdUndo size="1.5rem" />,
                disabled: !sketchData.events.length,
                handler: undoSketch
            }
        ],
        [
            {
                text: T('widget.sketch.removeTokens'),
                icon: <IoMdCloseCircle size="1.5rem" />,
                handler: () => {
                    modals.openConfirmModal({
                        centered: true,
                        title: T('widget.sketch.clearTokensConfirm'),
                        labels: {
                            confirm: T('action.confirm'),
                            cancel: T('action.cancel')
                        },
                        onConfirm: clearTokens
                    });
                }
            },
            {
                text: T('action.clear'),
                icon: <MdDelete size="1.5rem" />,
                handler: () => {
                    modals.openConfirmModal({
                        centered: true,
                        title: T('widget.sketch.clearSketchConfirm'),
                        labels: {
                            confirm: T('action.confirm'),
                            cancel: T('action.cancel')
                        },
                        onConfirm: clearSketch
                    });
                }
            },
            {
                text: T('widget.sketch.saveSketch'),
                icon: <GiSave size="1.5rem" />,
                handler: () => {
                    modals.open({
                        modalId: saveSketchModalId,
                        title: T('widget.sketch.saveSketch'),
                        children: (
                            <UserSketchSave
                                userSketchs={userSketchs}
                                data={sketch}
                                onCreate={onUserSketchSave}
                                onOverwrite={onUserSketchOverwrite}
                            />
                        )
                    });
                }
            },
            {
                text: T('widget.sketch.loadSketch'),
                icon: <GiLoad size="1.5rem" />,
                handler: () => {
                    modals.open({
                        modalId: loadSketchModalId,
                        title: T('widget.sketch.loadSketch'),
                        children: (
                            <UserSketchLoad
                                userSketchs={userSketchs}
                                onLoad={onUserSketchLoad}
                                onDelete={onUserSketchDelete}
                            />
                        )
                    });
                }
            }
        ]
    ];

    const explorerItems: FileExplorerItem[] = directoryList.map(
        ({ id, name, parentId }) => ({
            id,
            name,
            parentId,
            type: FileExplorerItemType.directory
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
            <Stack align="center" w="450px" gap="0.5rem">
                <Switch
                    label={T('action.display')}
                    labelPosition="left"
                    checked={sketchData.displayed}
                    my="0.5rem"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSketchDisplay(e.target.checked);
                    }}
                />
                {sketchData.displayed
                    ? [
                          actionButtons.map((buttonsRow, idx) => (
                              <Group
                                  key={`scketch-actions-${idx.toString()}`}
                                  justify="center"
                                  gap="2rem"
                              >
                                  {buttonsRow.map(
                                      (
                                          {
                                              text,
                                              icon,
                                              variant,
                                              disabled,
                                              handler
                                          },
                                          index
                                      ) => (
                                          <ActionButton
                                              key={`scketch-action-${index.toString()}`}
                                              text={text}
                                              icon={icon}
                                              variant={variant}
                                              disabled={disabled}
                                              handler={handler}
                                          />
                                      )
                                  )}
                              </Group>
                          )),
                          <Stack key="scketch-assets" w="100%" gap="0.5rem">
                              <Title order={6}>{T('entity.assets')}</Title>
                              <FileExplorer
                                  scroll
                                  mah="200px"
                                  items={explorerItems}
                                  directoryId={directoryIds.at(-1)}
                                  onDirectoryBack={onExplorerBack}
                                  onDirectoryClick={onExplorerDirectory}
                              />
                              <ImageAssetList
                                  scroll
                                  mah="300px"
                                  assets={directoryAssets}
                                  onAdd={(src: string) =>
                                      addSketchImage(src, false)
                                  }
                              />
                          </Stack>
                      ]
                    : null}
            </Stack>
        </Widget>
    );
};

export default SketchWidget;