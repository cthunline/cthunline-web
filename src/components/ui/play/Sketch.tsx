import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';

import { usePlay } from '../../contexts/Play';
import SketchImage from './sketch/SketchImage';
import {
    CardinalDirection,
    SketchImageData,
    SketchCoordinates,
    SketchMovingImageData,
    SketchResizingImageData
} from '../../../types';
import {
    viewBox,
    coordinatesToPath,
    getMouseEventSvgCoordinates,
    getMovingImageCoordinates,
    getResizingImageCoordAndPos
} from '../../../services/sketch';

import './Sketch.css';

const Sketch = () => {
    const {
        isFreeDrawing,
        isSketchDisplayed,
        sketchData,
        setSketchData,
        addSketchDrawPath,
        deleteSketchImage
    } = usePlay();

    // list of drawing paths (strings to put directly in path element "d" attribute)
    const [paths, setPaths] = useState<string[]>([]);
    // list of images in the sketch
    const [images, setImages] = useState<SketchImageData[]>([]);
    // current selected image index (index is reffering to the imagesRef array below)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    // index of image currently being moved (index is reffering to the imagesRef array below)
    const [movingImage, setMovingImage] = useState<SketchMovingImageData | null>(null);
    // index of image currently being resized (index is reffering to the imagesRef array below)
    const [resizingImage, setResizingImage] = useState<SketchResizingImageData | null>(null);
    // DOMPoint used to calculate transformed coordinates the the svg viewbox
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();
    // tells if user is currently drawing a path
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    // reference to the main svg container element (#svg-container)
    const svgRef = useRef<SVGSVGElement>() as React.MutableRefObject<SVGSVGElement>;

    // current drawing path coordinates
    const coordinates = useRef<SketchCoordinates[]>([]);

    // array of references to the images in the sketch
    const imagesRef = useRef<(SVGSVGElement | null)[]>([]);

    // helper to change an item of the images state array
    const setImage = (index: number, imageData: SketchImageData) => {
        setImages((previous) => (
            previous.map((img, idx) => (
                idx === index ? imageData : img
            ))
        ));
    };

    // handles mouseDown on the main svg container element
    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        const target = e.target as SVGSVGElement;
        // handles mouse down for drawing
        if (isFreeDrawing && !isDrawing) {
            e.preventDefault();
            // initializes coordinates list for the new drawing path
            coordinates.current = [];
            // set fresh value for the new path in paths state
            setPaths((previous) => (
                [...previous, '']
            ));
            // set isDrawing state
            setIsDrawing(true);
        } else if (selectedImageIndex !== null && !target.classList.contains('sketch-image')) {
            // handles outside click to deselect image
            const selectedImage = imagesRef.current[selectedImageIndex];
            if (selectedImage && !selectedImage.contains(e.target as Node)) {
                // unselect image
                setSelectedImageIndex(null);
            }
        }
    };

    // handles mouseMove on the main svg container element
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        // handles mouse move for drawing
        if (isFreeDrawing && isDrawing && svgPoint) {
            // get svg-transformed mouse coordinates
            const { x, y } = getMouseEventSvgCoordinates(e, svgRef.current, svgPoint);
            // push coordinates in the current drawing path coordinates
            coordinates.current.push({ x, y });
            // updates current drawing path string in state
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
            const imageData = images[index];
            const imageEl = imagesRef.current[index];
            if (imageData && imageEl) {
                // gets moving image new coordinates
                const coord = getMovingImageCoordinates({
                    event: e,
                    svgContainer: svgRef.current,
                    svgPoint,
                    image: imageEl,
                    deltaX,
                    deltaY
                });
                if (coord) {
                    // assign new coordinates
                    setImage(index, {
                        ...imageData,
                        ...coord
                    });
                }
            }
        }
        // handles mouse move for image resizing
        if (resizingImage && svgPoint) {
            const { index } = resizingImage;
            const imageData = images[index];
            const imageEl = imagesRef.current[index];
            if (imageData && imageEl) {
                // gets new coordinates and position for resizing image
                const data = getResizingImageCoordAndPos({
                    event: e,
                    svgContainer: svgRef.current,
                    svgPoint,
                    resizingImageData: resizingImage
                });
                if (data) {
                    // set new image size and position
                    setImage(index, {
                        ...imageData,
                        ...data
                    });
                }
            }
        }
    };

    // handles mouseUp of mouseLeave on the main svg container element
    const handleMouseUpOrLeave = () => {
        // handle mouse up or leave for drawing
        if (isFreeDrawing && isDrawing) {
            // stops drawing path
            setIsDrawing(false);
            // insert new draw path to the context data
            const lastPath = paths.at(-1);
            if (lastPath) {
                addSketchDrawPath(lastPath);
            }
        }
        // handle mouse up or leave for images
        if (movingImage || resizingImage) {
            if (movingImage) {
                // stops movement
                setMovingImage(null);
            }
            if (resizingImage) {
                // stops resizing
                setResizingImage(null);
            }
            // saves images data in play context sketchData
            setSketchData((previous) => ({
                ...previous,
                images
            }));
        }
    };

    // handle mouseDown on images
    const handleImageMouseDown = (e: React.MouseEvent<SVGImageElement>, index: number) => {
        if (!isFreeDrawing && svgPoint) {
            e.preventDefault();
            const imageData = images[index];
            const imageEl = imagesRef.current[index];
            if (imageData && imageEl) {
                // gets image position
                const { x: imageX, y: imageY } = imageData;
                // get svg-transformed mouse coordinates
                const { x, y } = getMouseEventSvgCoordinates(e, svgRef.current, svgPoint);
                // set moving image data in state
                // with delta to keep mouse where it was in the image when moving started
                setMovingImage({
                    index,
                    deltaX: x - imageX,
                    deltaY: y - imageY
                });
                setSelectedImageIndex(index);
            }
        }
    };

    // handle mouseDown on image's resize "buttons"
    const handleResizeMouseDown = (
        e: React.MouseEvent<SVGRectElement>,
        index: number,
        direction: CardinalDirection
    ) => {
        if (!isFreeDrawing && svgPoint) {
            const imageData = images[index];
            const imageEl = imagesRef.current[index];
            if (imageData && imageEl) {
                // gets image position
                const { x: initialX, y: initialY } = imageData;
                // gets image size
                const {
                    width: initialWidth,
                    height: initialHeight
                } = imageEl.getBBox();
                // gets svg-transformed mouse coordinates
                const {
                    x: initialMouseX,
                    y: initialMouseY
                } = getMouseEventSvgCoordinates(e, svgRef.current, svgPoint);
                // set resizing image data in state
                setResizingImage({
                    index,
                    direction,
                    initialX,
                    initialY,
                    initialWidth,
                    initialHeight,
                    initialMouseX,
                    initialMouseY
                });
            }
        }
    };

    // handles deletion of an image
    const handleImageDelete = (index: number) => {
        deleteSketchImage(index);
        setSelectedImageIndex(null);
    };

    // gets image height from its bounding box and set it in image data
    // used because when adding images their height are auto and we want
    // to set a fixed value
    const updateImageHeight = (index: number) => {
        const imageData = images[index];
        const imageEl = imagesRef.current[index];
        if (imageData && imageEl) {
            const { height } = imageEl.getBBox();
            setImage(index, {
                ...imageData,
                height
            });
        }
    };

    useEffect(() => {
        // initializes svg DOMPoint in state when reference to svg container is set
        setSvgPoint(svgRef.current.createSVGPoint());
    }, [svgRef]);

    useEffect(() => {
        // updates local state with context sketch data
        setPaths(sketchData.paths);
        setImages(sketchData.images);
    }, [sketchData]);

    useEffect(() => {
        // when drawing is enabled unselect images
        if (isFreeDrawing) {
            setSelectedImageIndex(null);
        }
    }, [isFreeDrawing]);

    return (
        <Box className={`sketch-container center-text ${isSketchDisplayed ? '' : 'hidden'}`}>
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
                        url={url}
                        width={width}
                        height={height}
                        x={x}
                        y={y}
                        selected={selectedImageIndex === index}
                        moving={movingImage?.index === index}
                        resizing={resizingImage?.index === index}
                        onRef={(el) => {
                            imagesRef.current[index] = el;
                        }}
                        onLoad={() => {
                            updateImageHeight(index);
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
                        onDelete={() => handleImageDelete(index)}
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
        </Box>
    );
};

export default Sketch;
