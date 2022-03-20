import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';

import { usePlay } from '../../contexts/Play';

import './Sketch.css';

interface Coordinates {
    x: number;
    y: number;
}

const Sketch = () => {
    const {
        isFreeDrawing,
        isSketchDisplayed
    } = usePlay();

    const [paths, setPaths] = useState<Coordinates[][]>([]);
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const svgRef = useRef<SVGSVGElement>() as (
        React.MutableRefObject<SVGSVGElement>
    );

    useEffect(() => {
        setSvgPoint(svgRef.current.createSVGPoint());
    }, [svgRef]);

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isFreeDrawing && !isDrawing) {
            e.preventDefault();
            setPaths((previous) => [...previous, []]);
            setIsDrawing(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isFreeDrawing && isDrawing && svgPoint) {
            const activePath = paths.pop();
            if (activePath) {
                svgPoint.x = e.clientX;
                svgPoint.y = e.clientY;
                const { x, y } = svgPoint.matrixTransform(
                    svgRef.current.getScreenCTM()?.inverse()
                );
                const newCoord = { x, y };
                setPaths((previous) => ([
                    ...previous,
                    [...activePath, newCoord]
                ]));
            }
        }
    };

    const handleMouseUpOrLeave = () => {
        if (isFreeDrawing && isDrawing) {
            setIsDrawing(false);
        }
    };

    const getSvgPaths = () => (
        paths.map((coords) => {
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
        }).filter((p) => p)
    );

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
                <image x={0} y={0} height={500} width={500} />
                {getSvgPaths().map((path, index) => (
                    <path
                        key={`path-${index.toString()}`}
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
