import { useState } from 'react';

import { SketchData, SketchEvent } from '../../../types';

const defaultSketchData: SketchData = {
    paths: [],
    images: [],
    events: []
};

const useSketch = () => {
    const [sketchData, setSketchData] = useState<SketchData>(defaultSketchData);
    const [isSketchDisplayed, setIsSketchDisplayed] = useState<boolean>(false);
    const [isFreeDrawing, setIsFreeDrawing] = useState<boolean>(false);

    const addSketchDrawPath = (path: string) => {
        setSketchData((previous) => ({
            ...previous,
            paths: [...previous.paths, path],
            events: [
                ...previous.events,
                SketchEvent.draw
            ]
        }));
    };

    const addSketchImage = (url: string) => {
        setSketchData((previous) => ({
            ...previous,
            images: [...previous.images, {
                url,
                width: 200,
                x: 0,
                y: 0
            }],
            events: [
                ...previous.events,
                SketchEvent.imageAdd
            ]
        }));
    };

    const undoSketch = () => {
        const lastEvent = sketchData.events.at(-1);
        if (lastEvent) {
            const pathsClone = [...sketchData.paths];
            const eventsClone = [...sketchData.events];
            switch (lastEvent) {
                case SketchEvent.draw:
                    pathsClone.pop();
                    eventsClone.pop();
                    setSketchData((previous) => ({
                        ...previous,
                        paths: pathsClone,
                        events: eventsClone
                    }));
                    break;
                default:
            }
        }
    };

    const clearSketch = () => {
        setSketchData(defaultSketchData);
    };

    return {
        sketchData,
        setSketchData,
        isSketchDisplayed,
        setIsSketchDisplayed,
        isFreeDrawing,
        setIsFreeDrawing,
        addSketchDrawPath,
        addSketchImage,
        undoSketch,
        clearSketch
    };
};

export default useSketch;
