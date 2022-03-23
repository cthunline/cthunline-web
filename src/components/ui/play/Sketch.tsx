import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';

import { usePlay } from '../../contexts/Play';
import { SketchImage } from '../../../types';

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
    const [images, setImages] = useState<SketchImage[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const svgRef = useRef<SVGSVGElement>() as (
        React.MutableRefObject<SVGSVGElement>
    );

    const coordinates = useRef<Coordinates[]>([]);

    const movingImage = useRef<MovingImageData | null>(null);

    const imagesRef = useRef<(SVGImageElement | null)[]>([]);

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
        const target = e.target as Element;
        // handles mouse down for drawing
        if (isFreeDrawing && !isDrawing) {
            e.preventDefault();
            coordinates.current = [];
            setPaths((previous) => (
                [...previous, '']
            ));
            setIsDrawing(true);
        } else if (
            selectedImageIndex !== null
            && !target.classList.contains('sketch-image')
        ) {
            // handles outside click to deselect image
            const selectedImage = imagesRef.current[selectedImageIndex];
            if (selectedImage && e.target !== selectedImage) {
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
        // handles mouse move for images
        if (movingImage.current && svgPoint) {
            const {
                index,
                deltaX,
                deltaY
            } = movingImage.current;
            const imageEl = imagesRef.current[index];
            if (imageEl) {
                const { x, y } = getMouseSvgCoordinates(e, svgPoint);
                const newX = x - deltaX;
                const newY = y - deltaY;
                imageEl.setAttributeNS(null, 'x', newX.toString());
                imageEl.setAttributeNS(null, 'y', newY.toString());
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
        if (movingImage.current) {
            movingImage.current = null;
        }
    };

    // handle mouse down for images
    const handleImageMouseDown = (e: React.MouseEvent<SVGImageElement>, index: number) => {
        if (!isFreeDrawing && svgPoint) {
            e.preventDefault();
            const imageEl = imagesRef.current[index];
            if (imageEl) {
                const imageX = parseInt(imageEl.getAttributeNS(null, 'x') ?? '');
                const imageY = parseInt(imageEl.getAttributeNS(null, 'y') ?? '');
                const { x, y } = getMouseSvgCoordinates(e, svgPoint);
                movingImage.current = {
                    index,
                    deltaX: x - imageX,
                    deltaY: y - imageY
                };
                setSelectedImageIndex(index);
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
        <Box className={`sketch-container ${isSketchDisplayed ? '' : 'hidden'}`}>
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                <defs>
                    {/* filter that puts the "selected" border on images */}
                    <filter id="selected">
                        {/* Make four copies of the image alpha,
                        each moved to a different corner */}
                        <feOffset result="nw" in="SourceAlpha" dx="-5" dy="-5" />
                        <feOffset result="ne" in="SourceAlpha" dx="5" dy="-5" />
                        <feOffset result="se" in="SourceAlpha" dx="5" dy="5" />
                        <feOffset result="sw" in="SourceAlpha" dx="-5" dy="5" />
                        {/* Merge those four copies together */}
                        <feMerge result="border">
                            <feMergeNode in="nw" />
                            <feMergeNode in="ne" />
                            <feMergeNode in="se" />
                            <feMergeNode in="sw" />
                        </feMerge>
                        {/* Create a filter primitive that is just a solid
                        block of what will be the new border colour */}
                        <feFlood floodColor="var(--palette-lightblue)" />
                        {/* Use the "in" operator to merge the blackborder with the
                        colored fill. Any parts of the colored fill that are"in"-side
                        the back shape will remain. The rest will me masked out. */}
                        <feComposite in2="border" operator="in" result="colored-border" />
                        {/* Finally, merge the new colored border with the original image */}
                        <feMerge>
                            <feMergeNode in="colored-border" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {images.map(({
                    url,
                    width,
                    x,
                    y
                }, index) => (
                    <image
                        key={`sketch-image-${index.toString()}`}
                        ref={(el) => {
                            imagesRef.current[index] = el;
                        }}
                        className="sketch-image"
                        filter={selectedImageIndex === index ? (
                            'url(#selected)'
                        ) : ''}
                        xlinkHref={url}
                        x={x.toString()}
                        y={y.toString()}
                        width={width.toString()}
                        visibility="visible"
                        onMouseDown={(e) => handleImageMouseDown(e, index)}
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
