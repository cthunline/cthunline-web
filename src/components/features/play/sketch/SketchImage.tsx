import { useCallback, useEffect, useState } from 'react';

import { CardinalDirection } from '../../../../types/index.js';
import SketchContextMenu, {
    contextMenuHandler,
    type ContextMenuPosition
} from './SketchContextMenu.js';

import './SketchImage.css';

const resizeRects: CardinalDirection[] = [
    CardinalDirection.nw,
    CardinalDirection.ne,
    CardinalDirection.se,
    CardinalDirection.sw
];

interface SketchImageProps {
    id: string;
    isMaster?: boolean;
    url: string;
    width: number;
    height?: number;
    x: number;
    y: number;
    selected?: boolean;
    isDrawing: boolean;
    moving?: boolean;
    resizing?: boolean;
    onRef?: (el: SVGSVGElement | null) => void;
    onMouseDown?: (e: React.MouseEvent<SVGImageElement>) => void;
    onResizeMouseDown?: (
        e: React.MouseEvent<SVGRectElement>,
        direction: CardinalDirection
    ) => void;
    onLoad?: (element: SVGSVGElement | null) => void;
    onForward?: () => void;
    onBackward?: () => void;
    onDelete?: () => void;
}

const SketchImage = ({
    id,
    isMaster,
    url,
    width,
    height,
    x,
    y,
    selected,
    isDrawing,
    moving,
    resizing,
    onRef,
    onMouseDown,
    onResizeMouseDown,
    onLoad,
    onForward,
    onBackward,
    onDelete
}: SketchImageProps) => {
    const [contextMenuPosition, setContextMenuPosition] =
        useState<ContextMenuPosition | null>(null);

    const onContextMenu = (pos: ContextMenuPosition) => {
        if (isMaster && !isDrawing) {
            setContextMenuPosition(pos);
        }
    };

    const onContextMenuClose = useCallback(() => {
        setContextMenuPosition(null);
    }, []);

    useEffect(() => {
        if (moving || isDrawing) {
            onContextMenuClose();
        }
    }, [moving, isDrawing, onContextMenuClose]);

    return (
        // image container
        <svg
            id={`sketch-image-${id}`}
            className={`sketch-image container ${
                isMaster ? 'selectable' : ''
            } ${selected ? 'selected' : ''} ${moving ? 'moving' : ''} ${
                resizing ? 'resizing' : ''
            }`}
            ref={onRef}
            width={width}
            height={height ?? 'auto'}
            x={x}
            y={y}
            onContextMenu={contextMenuHandler<SVGSVGElement>(
                onContextMenu,
                onContextMenuClose
            )}
        >
            {/* image element */}
            <image
                className="sketch-image"
                width="100%"
                xlinkHref={url}
                onLoad={(e) => onLoad?.(e.currentTarget.closest('svg'))}
                onMouseDown={onMouseDown}
            />
            {/* resize rectangles buttons */}
            {isMaster && selected
                ? resizeRects.map((direction, index) => (
                      <rect
                          key={`sketch-image-resize-button-${index.toString()}`}
                          className={`sketch-image sketch-image-resizer ${direction}`}
                          width="20px"
                          height="20px"
                          x="0"
                          y="0"
                          onMouseDown={(e) => {
                              onResizeMouseDown?.(e, direction);
                          }}
                      />
                  ))
                : null}
            {isMaster ? (
                <SketchContextMenu
                    position={contextMenuPosition}
                    onForward={onForward}
                    onBackward={onBackward}
                    onDelete={onDelete}
                    onClose={onContextMenuClose}
                />
            ) : null}
        </svg>
    );
};

export default SketchImage;
