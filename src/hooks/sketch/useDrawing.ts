import { useEffect, useRef, useState } from 'react';

import { isMainClick } from '../../services/tools.js';
import { usePlay } from '../../contexts/Play.js';
import {
    coordinatesToPath,
    getMouseEventSvgCoordinates
} from '../../services/sketch.js';
import {
    type SketchDrawingPath,
    type SketchCoordinates
} from '../../types/index.js';

// this hook holds state and event handlers for sketch drawing
// it is meant to be used by the sketch component and sub components
const useDrawing = (
    svgRef: React.MutableRefObject<SVGSVGElement>,
    isMaster: boolean = false
) => {
    const { isFreeDrawing, addSketchDrawPath, drawingColor } = usePlay();

    // list of drawing paths (strings to put directly in path element "d" attribute)
    const [paths, setPaths] = useState<SketchDrawingPath[]>([]);
    // DOMPoint used to calculate transformed coordinates the the svg viewbox
    // const [svgPoint, setSvgPoint] = useState<DOMPoint>();
    // tells if user is currently drawing a path
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    // DOMPoint used to calculate transformed coordinates the the svg viewbox
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();

    // current drawing path coordinates
    const coordinates = useRef<SketchCoordinates[]>([]);

    // handles mouse down on svg container when drawing is enabled
    const handleDrawingContainerMouseDown = (
        e: React.MouseEvent<SVGSVGElement>
    ) => {
        if (isMainClick(e)) {
            if (isMaster && isFreeDrawing && !isDrawing) {
                e.preventDefault();
                // initializes coordinates list for the new drawing path
                coordinates.current = [];
                // set fresh value for the new path in paths state
                setPaths((previous) => [
                    ...previous,
                    {
                        d: '',
                        color: drawingColor
                    }
                ]);
                // set isDrawing state
                setIsDrawing(true);
            }
        }
    };

    // handles mouse move for drawing
    const handleDrawingMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isMaster && isFreeDrawing && isDrawing && svgPoint) {
            // get svg-transformed mouse coordinates
            const { x, y } = getMouseEventSvgCoordinates(
                e,
                svgRef.current,
                svgPoint
            );
            // push coordinates in the current drawing path coordinates
            coordinates.current.push({ x, y });
            // updates current drawing path string in state
            const pathsClone = [...paths];
            pathsClone[pathsClone.length - 1].d = coordinatesToPath(
                coordinates.current
            );
            setPaths(pathsClone);
        }
    };

    // handle mouse up or leave for drawing
    const handleDrawingMouseUpOrLeave = () => {
        if (isMaster && isFreeDrawing && isDrawing) {
            // stops drawing path
            setIsDrawing(false);
            // insert new draw path to context sketchData
            const lastPath = paths.at(-1);
            if (lastPath?.d) {
                addSketchDrawPath(lastPath);
            } else {
                setPaths((prev) => prev.slice(0, -1));
            }
        }
    };

    useEffect(() => {
        // initializes svg DOMPoint in state when reference to svg container is set
        setSvgPoint(svgRef.current.createSVGPoint());
    }, [svgRef]);

    return {
        paths,
        setPaths,
        handleDrawingContainerMouseDown,
        handleDrawingMouseMove,
        handleDrawingMouseUpOrLeave
    };
};

export default useDrawing;