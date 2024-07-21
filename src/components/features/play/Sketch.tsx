import { Group } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import { usePlay } from '../../../contexts/Play.js';
import useDrawing from '../../../hooks/sketch/useDrawing.js';
import useItems from '../../../hooks/sketch/useItems.js';
import { viewBox } from '../../../services/sketch.js';
import {
    type CardinalDirection,
    type Color,
    type SessionUser,
    SketchItemType
} from '../../../types/index.js';
import CharacterPortraits from './CharacterPortraits.js';
import SketchContextMenu, {
    type ContextMenuPosition,
    contextMenuHandler
} from './sketch/SketchContextMenu.js';
import SketchImage from './sketch/SketchImage.js';
import SketchToken from './sketch/SketchToken.js';

interface SketchProps {
    isMaster?: boolean;
}

const Sketch = ({ isMaster }: SketchProps) => {
    // reference to the main svg container element (#svg-container)
    const svgRef =
        useRef<SVGSVGElement>() as React.MutableRefObject<SVGSVGElement>;

    const {
        users,
        isFreeDrawing,
        setDrawingColor,
        setDrawingWidth,
        sketchData,
        attachTokenData,
        unattachTokenData,
        duplicateToken,
        changeTokenColor
    } = usePlay();
    const {
        paths,
        setPaths,
        handleDrawingContainerMouseDown,
        handleDrawingMouseMove,
        handleDrawingMouseUpOrLeave
    } = useDrawing(svgRef, isMaster);
    const {
        images,
        setImages,
        tokens,
        setTokens,
        movingItem,
        resizingItem,
        selectedImageId,
        setSelectedImageId,
        updateImageHeight,
        handleItemContainerMouseDown,
        handleItemMouseDown,
        handleMovingItemMouseMove,
        handleResizingItemMouseMove,
        handleItemMouseUpOrLeave,
        handleResizeMouseDown,
        handleItemDelete,
        handleImageForward,
        handleImageBackward
    } = useItems(svgRef, isMaster);

    const [contextMenuPosition, setContextMenuPosition] =
        useState<ContextMenuPosition | null>(null);

    const players = useMemo(
        () => users.filter(({ isMaster: isUserMaster }) => !isUserMaster),
        [users]
    );

    // handles mouseClick outside of the sketch
    const sketchContainerRef = useClickOutside(() => {
        if (isMaster && selectedImageId) {
            setSelectedImageId(null);
        }
    });

    const onContextMenu = (pos: ContextMenuPosition) => {
        if (isMaster) {
            setContextMenuPosition(pos);
        }
    };

    const onContextMenuClose = () => {
        setContextMenuPosition(null);
    };

    // handles context menu on main sketch container
    const handleContextMenu = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isFreeDrawing) {
            contextMenuHandler<SVGSVGElement>(
                onContextMenu,
                onContextMenuClose
            )(e);
        } else {
            e.preventDefault();
        }
    };

    // handles mouseDown on the main svg container element
    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button !== 2) {
            setContextMenuPosition(null);
            if (e.button === 0) {
                handleDrawingContainerMouseDown(e);
                handleItemContainerMouseDown(e);
            } else {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    // handles mouseMove on the main svg container element
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        // handles mouse move for drawing
        handleDrawingMouseMove(e);
        // handles mouse move for moving item
        handleMovingItemMouseMove(e);
        // handles mouse move for resizing item
        handleResizingItemMouseMove(e);
    };

    // handles mouseUp of mouseLeave on the main svg container element
    const handleMouseUpOrLeave = () => {
        // handle mouse up or leave for drawing
        handleDrawingMouseUpOrLeave();
        // handle mouse up or leave for items
        handleItemMouseUpOrLeave();
    };

    const onWidthPick = (width: number) => {
        setDrawingWidth(width);
    };

    const onColorPick = (color: Color) => {
        setDrawingColor(color);
    };

    useEffect(() => {
        // updates local state with context sketch data
        setPaths(sketchData.paths);
        setImages(sketchData.images);
        setTokens(sketchData.tokens);
    }, [sketchData, setPaths, setImages, setTokens]);

    useEffect(() => {
        // when drawing is enabled unselect images
        if (isFreeDrawing) {
            setSelectedImageId(null);
        }
    }, [isFreeDrawing, setSelectedImageId]);

    return (
        <Group
            ref={sketchContainerRef}
            w="100%"
            h="100%"
            align="start"
            justify="center"
            style={{ userSelect: 'none' }}
            wrap="nowrap"
        >
            {/* character portraits */}
            <CharacterPortraits players={players} />
            {/* main svg container */}
            <svg
                ref={svgRef}
                id="svg-container"
                className={`svg-container ${
                    isFreeDrawing ? 'free-drawing' : ''
                }`}
                viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onContextMenu={handleContextMenu}
                style={{
                    background: 'var(--palette-background-secondary)',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    cursor: isFreeDrawing ? 'crosshair' : undefined
                }}
            >
                {/* sketch images */}
                {images.map(({ id, url, width, height, x, y }) => (
                    <SketchImage
                        key={`sketch-image-${id}`}
                        id={id}
                        isMaster={isMaster}
                        url={url}
                        width={width}
                        height={height}
                        x={x}
                        y={y}
                        selected={selectedImageId === id}
                        isDrawing={isFreeDrawing}
                        moving={
                            movingItem?.type === SketchItemType.image &&
                            movingItem?.id === id
                        }
                        resizing={
                            resizingItem?.type === SketchItemType.image &&
                            resizingItem?.id === id
                        }
                        onLoad={(element) => {
                            updateImageHeight(id, element);
                        }}
                        onMouseDown={(e) => {
                            handleItemMouseDown(e, id, SketchItemType.image);
                        }}
                        onResizeMouseDown={(
                            e: React.MouseEvent<SVGRectElement>,
                            direction: CardinalDirection
                        ) => {
                            handleResizeMouseDown(
                                e,
                                id,
                                SketchItemType.image,
                                direction
                            );
                        }}
                        onForward={() => handleImageForward(id)}
                        onBackward={() => handleImageBackward(id)}
                        onDelete={() => {
                            handleItemDelete(id, SketchItemType.image);
                        }}
                    />
                ))}
                {/* drawing paths */}
                {paths.map((path, index) => (
                    <path
                        key={`sketch-path-${index.toString()}`}
                        stroke={`var(--palette-${path.color})`}
                        strokeWidth={path.width ?? 5}
                        d={path.d}
                        fill="none"
                    />
                ))}
                {/* tokens */}
                {tokens.map(
                    ({ id, color, attachedData, x, y, tooltipPlacement }) => {
                        const isMoving =
                            movingItem?.type === SketchItemType.token &&
                            movingItem?.id === id;
                        return (
                            <SketchToken
                                key={`sketch-token-${id}`}
                                id={id}
                                isMaster={isMaster}
                                size={50}
                                color={color}
                                attachedData={attachedData}
                                x={x}
                                y={y}
                                tooltipPlacement={tooltipPlacement}
                                isDrawing={isFreeDrawing}
                                isMoving={isMoving}
                                onMouseDown={(e, isMovable) => {
                                    handleItemMouseDown(
                                        e,
                                        id,
                                        SketchItemType.token,
                                        isMovable
                                    );
                                }}
                                onAttach={
                                    !attachedData
                                        ? (sessionUser: SessionUser) => {
                                              attachTokenData(id, sessionUser);
                                          }
                                        : undefined
                                }
                                onUnattach={
                                    attachedData
                                        ? () => {
                                              unattachTokenData(id);
                                          }
                                        : undefined
                                }
                                onDuplicate={() => {
                                    duplicateToken(id);
                                }}
                                onColorChange={(tokenColor: Color) => {
                                    changeTokenColor(id, tokenColor);
                                }}
                                onDelete={() => {
                                    handleItemDelete(id, SketchItemType.token);
                                }}
                            />
                        );
                    }
                )}
            </svg>
            {/* empty character portraits container to compensate the one on the left */}
            <CharacterPortraits players={[]} />
            {isMaster ? (
                <SketchContextMenu
                    position={contextMenuPosition}
                    onWidthPick={onWidthPick}
                    onColorPick={onColorPick}
                    onClose={onContextMenuClose}
                />
            ) : null}
        </Group>
    );
};

export default Sketch;
