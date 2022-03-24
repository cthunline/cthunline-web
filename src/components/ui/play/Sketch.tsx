import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';

import { usePlay } from '../../contexts/Play';
import { CardinalDirection, SketchImageData } from '../../../types';
import SketchImage from './sketch/SketchImage';

import './Sketch.css';

interface Coordinates {
    x: number;
    y: number;
}

interface MovingImageData {
    index: number;
    deltaX: number;
    deltaY: number;
}

interface ResizingImageData {
    index: number;
    direction: CardinalDirection;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
    initialMouseX: number;
    initialMouseY: number;
}

const imageMinSize = 100;

const viewBox = {
    width: 1920,
    height: 1080
};

const Sketch = () => {
    const {
        isFreeDrawing,
        isSketchDisplayed,
        sketchData,
        addSketchDrawPath
    } = usePlay();

    const [paths, setPaths] = useState<string[]>([]);
    const [images, setImages] = useState<SketchImageData[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [movingImage, setMovingImage] = useState<MovingImageData | null>(null);
    const [resizingImage, setResizingImage] = useState<ResizingImageData | null>(null);
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const svgRef = useRef<SVGSVGElement>() as (
        React.MutableRefObject<SVGSVGElement>
    );

    const coordinates = useRef<Coordinates[]>([]);

    const imagesRef = useRef<(SVGSVGElement | null)[]>([]);

    // convert path coordinate data to path d attribute string
    const coordinatesToPath = (coords: Coordinates[]): string => {
        if (coords.length) {
            let path = `M ${coords[0].x} ${coords[0].y}`;
            let p1; let p2; let end;
            for (let i = 1; i < coords.length - 2; i += 2) {
                p1 = coords[i];
                p2 = coords[i + 1];
                end = coords[i + 2];
                path += ` C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
            }
            return path;
        }
        return '';
    };

    // gets coordinates of a mouse event transformed
    const getMouseSvgCoordinates = (e: React.MouseEvent, domPoint: DOMPoint) => {
        const point = domPoint;
        point.x = e.clientX;
        point.y = e.clientY;
        const { x, y } = point.matrixTransform(
            svgRef.current.getScreenCTM()?.inverse()
        );
        return { x, y };
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        const target = e.target as SVGSVGElement;
        // handles mouse down for drawing
        if (isFreeDrawing && !isDrawing) {
            e.preventDefault();
            coordinates.current = [];
            setPaths((previous) => (
                [...previous, '']
            ));
            setIsDrawing(true);
        } else if (selectedImageIndex !== null && !target.classList.contains('sketch-image')) {
            // handles outside click to deselect image
            const selectedImage = imagesRef.current[selectedImageIndex];
            if (selectedImage && !selectedImage.contains(e.target as Node)) {
                setSelectedImageIndex(null);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        // handles mouse move for drawing
        if (isFreeDrawing && isDrawing && svgPoint) {
            const { x, y } = getMouseSvgCoordinates(e, svgPoint);
            coordinates.current.push({ x, y });
            const pathsClone = [...paths];
            pathsClone[pathsClone.length - 1] = (
                coordinatesToPath(coordinates.current)
            );
            setPaths(pathsClone);
        }
        // handles mouse move for moving image
        if (movingImage && svgPoint) {
            const {
                index,
                deltaX,
                deltaY
            } = movingImage;
            const imageEl = imagesRef.current[index];
            if (imageEl) {
                const { width, height } = imageEl.getBBox();
                const { x, y } = getMouseSvgCoordinates(e, svgPoint);
                const newX = x - deltaX;
                const newY = y - deltaY;
                if (
                    newX >= 0 && newX + width <= viewBox.width
                    && newY >= 0 && newY + height <= viewBox.height
                ) {
                    imageEl.setAttributeNS(null, 'x', newX.toString());
                    imageEl.setAttributeNS(null, 'y', newY.toString());
                }
            }
        }
        // handles mouse move for image resizing
        if (resizingImage && svgPoint) {
            const {
                index,
                direction,
                initialX,
                initialY,
                initialWidth,
                initialHeight,
                initialMouseX,
                initialMouseY
            } = resizingImage;
            const imageEl = imagesRef.current[index];
            if (imageEl) {
                const { x, y } = getMouseSvgCoordinates(e, svgPoint);
                const mouseDiffX = x - initialMouseX;
                const mouseDiffY = y - initialMouseY;
                const sizeRatio = initialWidth / initialHeight;
                const movingX = (
                    direction === CardinalDirection.nw
                    || direction === CardinalDirection.sw
                );
                const movingY = (
                    direction === CardinalDirection.nw
                    || direction === CardinalDirection.ne
                );
                let newWidth;
                let newHeight;
                let newX = initialX;
                let newY = initialY;
                if (mouseDiffX > mouseDiffY) {
                    newWidth = initialWidth + (mouseDiffX * (movingX ? -1 : 1));
                    newHeight = newWidth / sizeRatio;
                } else {
                    newHeight = initialHeight + mouseDiffY * (movingY ? -1 : 1);
                    newWidth = newHeight * sizeRatio;
                }
                if (movingX) {
                    newX = initialX - (newWidth - initialWidth);
                }
                if (movingY) {
                    newY = initialY - (newHeight - initialHeight);
                }
                const controlPositionX = initialX + newWidth;
                const controlPositionY = initialY + newHeight;
                if (
                    newWidth >= imageMinSize
                    && newHeight >= imageMinSize
                    && newX >= 0
                    && newY >= 0
                    && controlPositionX <= viewBox.width
                    && controlPositionY <= viewBox.height
                ) {
                    imageEl.setAttribute('width', newWidth.toString());
                    imageEl.setAttribute('height', newHeight.toString());
                    if (movingX) {
                        imageEl.setAttributeNS(null, 'x', newX.toString());
                    }
                    if (movingY) {
                        imageEl.setAttributeNS(null, 'y', newY.toString());
                    }
                }
            }
        }
    };

    const handleMouseUpOrLeave = () => {
        // handle mouse up or leave for drawing
        if (isFreeDrawing && isDrawing) {
            setIsDrawing(false);
            const lastPath = paths.at(-1);
            if (lastPath) {
                addSketchDrawPath(lastPath);
            }
        }
        // handle mouse up or leave for images
        if (movingImage) {
            setMovingImage(null);
        }
        if (resizingImage) {
            setResizingImage(null);
        }
    };

    // handle mouse down for image move
    const handleImageMouseDown = (e: React.MouseEvent<SVGImageElement>, index: number) => {
        if (!isFreeDrawing && svgPoint) {
            e.preventDefault();
            const imageEl = imagesRef.current[index];
            if (imageEl) {
                const imageX = parseInt(imageEl.getAttributeNS(null, 'x') ?? '');
                const imageY = parseInt(imageEl.getAttributeNS(null, 'y') ?? '');
                const { x, y } = getMouseSvgCoordinates(e, svgPoint);
                setMovingImage({
                    index,
                    deltaX: x - imageX,
                    deltaY: y - imageY
                });
                setSelectedImageIndex(index);
            }
        }
    };

    // handle mouse down for image resize
    const handleResizeMouseDown = (
        e: React.MouseEvent<SVGRectElement>,
        index: number,
        direction: CardinalDirection
    ) => {
        if (!isFreeDrawing && svgPoint) {
            const imageEl = imagesRef.current[index];
            if (imageEl) {
                const imageX = parseInt(imageEl.getAttributeNS(null, 'x') ?? '');
                const imageY = parseInt(imageEl.getAttributeNS(null, 'y') ?? '');
                const { width, height } = imageEl.getBBox();
                const { x, y } = getMouseSvgCoordinates(e, svgPoint);
                setResizingImage({
                    index,
                    direction,
                    initialX: imageX,
                    initialY: imageY,
                    initialWidth: width,
                    initialHeight: height,
                    initialMouseX: x,
                    initialMouseY: y
                });
            }
        }
    };

    useEffect(() => {
        setSvgPoint(svgRef.current.createSVGPoint());
    }, [svgRef]);

    useEffect(() => {
        setPaths(sketchData.paths);
        setImages(sketchData.images);
    }, [sketchData]);

    useEffect(() => {
        if (isFreeDrawing) {
            setSelectedImageIndex(null);
        }
    }, [isFreeDrawing]);

    return (
        <Box className={`sketch-container center-text ${isSketchDisplayed ? '' : 'hidden'}`}>
            <svg
                ref={svgRef}
                className="svg-container"
                viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                {images.map(({
                    url,
                    width,
                    x,
                    y
                }, index) => (
                    <SketchImage
                        key={`sketch-image-${index.toString()}`}
                        url={url}
                        width={width}
                        x={x}
                        y={y}
                        selected={selectedImageIndex === index}
                        moving={movingImage?.index === index}
                        onRef={(el) => {
                            imagesRef.current[index] = el;
                        }}
                        onImageMouseDown={(e) => {
                            handleImageMouseDown(e, index);
                        }}
                        onResizeMouseDown={(
                            e: React.MouseEvent<SVGRectElement>,
                            direction: CardinalDirection
                        ) => {
                            handleResizeMouseDown(e, index, direction);
                        }}
                    />
                ))}
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
        </Box>
    );
};

export default Sketch;
