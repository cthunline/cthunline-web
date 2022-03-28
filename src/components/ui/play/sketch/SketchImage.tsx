import React, { useState } from 'react';

import { CardinalDirection } from '../../../../types';
import SketchImageContextMenu from './SketchImageContextMenu';

import './SketchImage.css';

const resizeRects: CardinalDirection[] = [
    CardinalDirection.nw,
    CardinalDirection.ne,
    CardinalDirection.se,
    CardinalDirection.sw
];

interface ContextMenuData {
    left: number;
    top: number;
}

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
    onMouseDown?: (e: React.MouseEvent<SVGSVGElement>) => void;
    onImageMouseDown?: (e: React.MouseEvent<SVGImageElement>) => void;
    onResizeMouseDown?: (
        e: React.MouseEvent<SVGRectElement>,
        direction: CardinalDirection
    ) => void;
    onLoad?: () => void;
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
    onImageMouseDown,
    onResizeMouseDown,
    onLoad,
    onForward,
    onBackward,
    onDelete
}) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);

    const onContextMenuOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu(contextMenu ? null : {
            left: e.clientX,
            top: e.clientY
        });
    };

    const onContextMenuClose = () => {
        setContextMenu(null);
    };

    const onContextMenuSelect = (action: string) => {
        switch (action) {
            case 'onForward':
                onForward?.();
                break;
            case 'onBackward':
                onBackward?.();
                break;
            case 'onDelete':
                onDelete?.();
                break;
            default:
        }
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
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenuOpen}
        >
            {/* image element */}
            <image
                className="sketch-image"
                width="100%"
                xlinkHref={url}
                onLoad={onLoad}
                onMouseDown={onImageMouseDown}
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
            <SketchImageContextMenu
                open={!!contextMenu}
                position={contextMenu ?? undefined}
                onSelect={onContextMenuSelect}
                onClose={onContextMenuClose}
            />
        </svg>
    );
};

export default SketchImage;
