import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import { MdMenu } from 'react-icons/md';

import SvgIconButton from './SvgIconButton';
import { CardinalDirection } from '../../../../types';

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
    const [menuAnchor, setMenuAnchor] = useState<SVGCircleElement | null>(null);

    const onMenuOpen = (e: React.MouseEvent<SVGCircleElement>) => {
        setMenuAnchor(e.currentTarget);
    };

    const onMenuClose = () => {
        setMenuAnchor(null);
    };

    const onMenuSelect = (eventToCall?: Function) => {
        eventToCall?.();
        setMenuAnchor(null);
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
                resizeRects.map((direcion, index) => (
                    <rect
                        key={`sketch-image-resize-button-${index.toString()}`}
                        className={`sketch-image sketch-image-resizer ${direcion}`}
                        width="20px"
                        height="20px"
                        x="0"
                        y="0"
                        onMouseDown={(e) => {
                            onResizeMouseDown?.(e, direcion);
                        }}
                    />
                ))
            ) : null}
            {/* delete button */}
            {isMaster ? (
                <SvgIconButton
                    className={`sketch-image-menu-button ${menuAnchor ? 'open' : ''}`}
                    icon={<MdMenu />}
                    size={40}
                    onClick={onMenuOpen}
                />
            ) : null}
            {/* image context menu */}
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={onMenuClose}>
                <MenuItem onClick={() => onMenuSelect(onForward)}>
                    Forward
                </MenuItem>
                <MenuItem onClick={() => onMenuSelect(onBackward)}>
                    Backward
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => onMenuSelect(onDelete)}>
                    Delete
                </MenuItem>
            </Menu>
        </svg>
    );
};

export default SketchImage;
