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

const Sketch = () => {
    const {
        isFreeDrawing,
        isSketchDisplayed,
        sketchData,
        addSketchDrawPath
    } = usePlay();

    const [paths, setPaths] = useState<string[]>([]);
    const [images, setImages] = useState<SketchImage[]>([]);
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const coordinates = useRef<Coordinates[]>([]);

    const svgRef = useRef<SVGSVGElement>() as (
        React.MutableRefObject<SVGSVGElement>
    );

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

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isFreeDrawing && !isDrawing) {
            e.preventDefault();
            coordinates.current = [];
            setPaths((previous) => (
                [...previous, '']
            ));
            setIsDrawing(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isFreeDrawing && isDrawing && svgPoint) {
            svgPoint.x = e.clientX;
            svgPoint.y = e.clientY;
            const { x, y } = svgPoint.matrixTransform(
                svgRef.current.getScreenCTM()?.inverse()
            );
            coordinates.current.push({ x, y });
            const pathsClone = [...paths];
            pathsClone[pathsClone.length - 1] = (
                coordinatesToPath(coordinates.current)
            );
            setPaths(pathsClone);
        }
    };

    const handleMouseUpOrLeave = () => {
        if (isFreeDrawing && isDrawing) {
            setIsDrawing(false);
            const lastPath = paths.at(-1);
            if (lastPath) {
                addSketchDrawPath(lastPath);
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

    return (
        <Box className={`sketch-container ${isSketchDisplayed ? '' : 'hidden'}`}>
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 1920 1080"
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
                    <image
                        key={`sketch-image-${index.toString()}`}
                        xlinkHref={url}
                        x={x.toString()}
                        y={y.toString()}
                        width={width.toString()}
                        visibility="visible"
                        // crossOrigin="use-credentials"
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
