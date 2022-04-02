import React, { useState } from 'react';

import { CardinalDirection } from '../../../../types';
import SketchItemContextMenu, { ContextMenuData } from './SketchItemContextMenu';

import './SketchImage.css';

const resizeRects: CardinalDirection[] = [
    CardinalDirection.nw,
    CardinalDirection.ne,
    CardinalDirection.se,
    CardinalDirection.sw
];

interface SketchImageProps {
    isMaster?: boolean;
    url: string;
    width: number;
    height?: number;
    x: number;
    y: number;
    selected?: boolean;
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

const SketchImage: React.FC<SketchImageProps> = ({
    isMaster,
    url,
    width,
    height,
    x,
    y,
    selected,
    moving,
    resizing,
    onRef,
    onMouseDown,
    onResizeMouseDown,
    onLoad,
    onForward,
    onBackward,
    onDelete
}) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);

    const onContextMenuOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isMaster) {
            setContextMenu(contextMenu ? null : {
                left: e.clientX,
                top: e.clientY
            });
        }
    };

    const onContextMenuClose = () => {
        setContextMenu(null);
    };

    return (
        // image container
        <svg
            className={
                `sketch-image container ${
                    isMaster ? 'selectable' : ''
                } ${
                    selected ? 'selected' : ''
                } ${
                    moving ? 'moving' : ''
                } ${
                    resizing ? 'resizing' : ''
                }`
            }
            ref={onRef}
            width={width}
            height={height ?? 'auto'}
            x={x}
            y={y}
            onContextMenu={onContextMenuOpen}
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
            {isMaster && selected ? (
                resizeRects.map((direction, index) => (
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
            ) : null}
            {isMaster ? (
                <SketchItemContextMenu
                    open={!!contextMenu}
                    position={contextMenu ?? undefined}
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
