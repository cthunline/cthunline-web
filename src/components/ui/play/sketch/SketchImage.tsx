import React from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import SvgIconButton from './SvgIconButton';
import { CardinalDirection } from '../../../../types';

import './SketchImage.css';

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
    onDelete?: () => void;
}

const resizeRects: CardinalDirection[] = [
    CardinalDirection.nw,
    CardinalDirection.ne,
    CardinalDirection.se,
    CardinalDirection.sw
];

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
    onDelete
}) => (
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
        width={width.toString()}
        height={height ? height.toString() : 'auto'}
        x={x.toString()}
        y={y.toString()}
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
                className="sketch-image-delete-button"
                icon={<MdOutlineDeleteOutline />}
                size={45}
                onClick={onDelete}
            />
        ) : null}
    </svg>
);

export default SketchImage;
