import React, { useRef } from 'react';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import SvgIconButton from './SvgIconButton';
import { CardinalDirection } from '../../../../types';

import './SketchImage.css';

interface SketchImageProps {
    url: string;
    width: number;
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
    url,
    width,
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
}) => {
    const imageRef = useRef<SVGSVGElement | null>(null);

    // set height of an image container (calculated from current bounding box)
    const updateImageHeight = (imageEl: SVGSVGElement | null) => {
        if (imageEl) {
            const { height } = imageEl.getBBox();
            imageEl.setAttribute('height', height.toString());
        }
    };

    return (
        <svg
            className={
                `sketch-image container ${
                    selected ? 'selected' : ''
                } ${
                    moving ? 'moving' : ''
                } ${
                    resizing ? 'resizing' : ''
                }`
            }
            ref={(el) => {
                imageRef.current = el;
                onRef?.(el);
            }}
            width={width.toString()}
            x={x.toString()}
            y={y.toString()}
            onMouseDown={onMouseDown}
        >
            <image
                className="sketch-image"
                width="100%"
                xlinkHref={url}
                onLoad={() => {
                    updateImageHeight(imageRef.current);
                    onLoad?.();
                }}
                onMouseDown={onImageMouseDown}
            />
            {selected ? (
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
            <SvgIconButton
                className="sketch-image-delete-button"
                icon={<MdOutlineDeleteOutline />}
                size={45}
                onClick={onDelete}
            />
        </svg>
    );
};

export default SketchImage;
