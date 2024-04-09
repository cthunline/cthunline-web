import { useClickOutside } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import { Box } from '@mantine/core';

import useDrawing from '../../hooks/sketch/useDrawing.js';
import useItems from '../../hooks/sketch/useItems.js';
import { viewBox } from '../../../services/sketch.js';
import SketchImage from './sketch/SketchImage.js';
import SketchToken from './sketch/SketchToken.js';
import { usePlay } from '../../contexts/Play.js';
import {
    type CardinalDirection,
    type Color,
    type SessionUser,
    SketchItemType
} from '../../../types/index.js';

interface SketchProps {
    isMaster?: boolean;
}

const Sketch = ({ isMaster }: SketchProps) => {
    // reference to the main svg container element (#svg-container)
    const svgRef =
        useRef<SVGSVGElement>() as React.MutableRefObject<SVGSVGElement>;

    const {
        isFreeDrawing,
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

    // handles mouseClick outside of the sketch
    const sketchContainerRef = useClickOutside(() => {
        if (isMaster && selectedImageId) {
            setSelectedImageId(null);
        }
    });

    // handles mouseDown on the main svg container element
    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        handleDrawingContainerMouseDown(e);
        handleItemContainerMouseDown(e);
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

    // handles context menu on main sketch container
    const handleContextMenu = (e: React.MouseEvent) => {
        // disables context menu on sketch
        e.preventDefault();
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
        <Box
            ref={sketchContainerRef}
            w="100%"
            h="100%"
            ta="center"
            style={{ userSelect: 'none' }}
        >
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
                    maxHeight: '100%',
                    maxWidth: '100%',
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
                        stroke="var(--palette-font)"
                        strokeWidth={5}
                        d={path}
                        fill="none" // eslint-disable-line react/no-unknown-property
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
        </Box>
    );
};

export default Sketch;
