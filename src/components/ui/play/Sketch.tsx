import React, { useEffect, useRef } from 'react';
import { Box, ClickAwayListener } from '@mui/material';

import { usePlay } from '../../contexts/Play';
import useItems from '../../hooks/sketch/useItems';
import useDrawing from '../../hooks/sketch/useDrawing';
import { viewBox } from '../../../services/sketch';
import { isMainClick } from '../../../services/tools';
import SketchImage from './sketch/SketchImage';
import SketchToken from './sketch/SketchToken';
import {
    CardinalDirection,
    SessionUser,
    SketchItemType
} from '../../../types';

import './Sketch.css';

interface SketchProps {
    isMaster?: boolean;
}

const Sketch: React.FC<SketchProps> = ({ isMaster }) => {
    // reference to the main svg container element (#svg-container)
    const svgRef = useRef<SVGSVGElement>() as React.MutableRefObject<SVGSVGElement>;

    const {
        isFreeDrawing,
        sketchData,
        assignTokenUser,
        unassignTokenUser
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
        selectedImageIndex,
        setSelectedImageIndex,
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

    // handles mouseDown outside of the sketch
    const handleMouseDownAway = (e: MouseEvent | TouchEvent) => {
        if (isMainClick(e)) {
            // unselect image
            if (isMaster && selectedImageIndex !== null) {
                setSelectedImageIndex(null);
            }
        }
    };

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
    }, [
        sketchData,
        setPaths,
        setImages,
        setTokens
    ]);

    useEffect(() => {
        // when drawing is enabled unselect images
        if (isFreeDrawing) {
            setSelectedImageIndex(null);
        }
    }, [
        isFreeDrawing,
        setSelectedImageIndex
    ]);

    return (
        <Box className="sketch-container center-text">
            <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleMouseDownAway}>
                {/* main svg container */}
                <svg
                    ref={svgRef}
                    id="svg-container"
                    className={`svg-container ${isFreeDrawing ? 'free-drawing' : ''}`}
                    viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    onContextMenu={handleContextMenu}
                >
                    {/* sketch images */}
                    {images.map(({
                        url,
                        width,
                        height,
                        x,
                        y
                    }, index) => (
                        <SketchImage
                            key={`sketch-image-${index.toString()}`}
                            isMaster={isMaster}
                            url={url}
                            width={width}
                            height={height}
                            x={x}
                            y={y}
                            selected={selectedImageIndex === index}
                            moving={(
                                !!movingItem
                                && movingItem.type === SketchItemType.image
                                && movingItem.index === index
                            )}
                            resizing={(
                                resizingItem?.type === SketchItemType.image
                                && resizingItem?.index === index
                            )}
                            onLoad={(element) => {
                                updateImageHeight(index, element);
                            }}
                            onMouseDown={(e) => {
                                handleItemMouseDown(e, index, SketchItemType.image);
                            }}
                            onResizeMouseDown={(
                                e: React.MouseEvent<SVGRectElement>,
                                direction: CardinalDirection
                            ) => {
                                handleResizeMouseDown(e, index, SketchItemType.image, direction);
                            }}
                            onForward={() => handleImageForward(index)}
                            onBackward={() => handleImageBackward(index)}
                            onDelete={() => {
                                handleItemDelete(index, SketchItemType.image);
                            }}
                        />
                    ))}
                    {/* tokens */}
                    {tokens.map(({
                        color,
                        user,
                        x,
                        y
                    }, index) => (
                        <SketchToken
                            key={`sketch-token-${index.toString()}`}
                            isMaster={isMaster}
                            size={50}
                            color={color}
                            user={user}
                            x={x}
                            y={y}
                            onMouseDown={(e) => {
                                handleItemMouseDown(e, index, SketchItemType.token);
                            }}
                            onAssign={(tokenUser: SessionUser) => {
                                assignTokenUser(index, tokenUser);
                            }}
                            onUnassign={() => {
                                unassignTokenUser(index);
                            }}
                            onDelete={() => {
                                handleItemDelete(index, SketchItemType.token);
                            }}
                        />
                    ))}
                    {/* drawing paths */}
                    {paths.map((path, index) => (
                        <path
                            key={`sketch-path-${index.toString()}`}
                            stroke="white"
                            strokeWidth={5}
                            d={path}
                            fill="none"
                        />
                    ))}
                </svg>
            </ClickAwayListener>
        </Box>
    );
};

export default Sketch;
