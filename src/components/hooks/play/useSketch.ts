import { useState, SetStateAction } from 'react';

import {
    PlaySocket,
    SketchData,
    SketchEvent,
    SketchEventType,
    SketchImageData
} from '../../../types';

const defaultSketchData: SketchData = {
    displayed: false,
    paths: [],
    images: [],
    events: []
};

const defaultImageData: Omit<SketchImageData, 'url'> = {
    width: 300,
    x: 100,
    y: 100
};

const useSketch = (socket: PlaySocket | null) => {
    const [sketchData, setSketchData] = useState<SketchData>(defaultSketchData);
    const [isFreeDrawing, setIsFreeDrawing] = useState<boolean>(false);

    const getDefaultImageData = (url: string): SketchImageData => ({
        url,
        ...defaultImageData
    });

    const updateSketch = (
        updater: (previous: SketchData) => SketchData,
        emit: boolean = true
    ) => {
        if (emit && socket?.isMaster) {
            socket?.emit('sketchUpdate', updater(sketchData));
        }
        setSketchData(updater as SetStateAction<SketchData>);
    };

    const setSketchDisplay = (displayed: boolean) => {
        updateSketch((previous) => ({
            ...previous,
            displayed
        }));
    };

    const addSketchDrawPath = (path: string) => {
        updateSketch((previous) => ({
            ...previous,
            paths: [...previous.paths, path],
            events: [...previous.events, {
                type: SketchEventType.draw
            }]
        }));
    };

    const addSketchImage = (url: string, emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            images: [
                ...previous.images,
                getDefaultImageData(url)
            ],
            events: [...previous.events, {
                type: SketchEventType.imageAdd,
                imageIndex: previous.images.length
            }]
        }), emit);
    };

    const updateSketchImage = (
        index: number,
        image: SketchImageData,
        events?: SketchEvent[]
    ) => {
        updateSketch((previous) => ({
            ...previous,
            images: previous.images.map((img, idx) => (
                idx === index ? image : img
            )),
            events: events ?? previous.events
        }));
    };

    const updateSketchImages = (
        images: SketchImageData[],
        eventType: SketchEventType,
        imageIndex: number,
        imageData: SketchImageData
    ) => {
        updateSketch((previous) => ({
            ...previous,
            images,
            events: [...previous.events, {
                type: eventType,
                imageIndex,
                imageData
            }]
        }));
    };

    const deleteSketchImage = (index: number, imageData: SketchImageData) => {
        updateSketch((previous) => ({
            ...previous,
            images: previous.images.filter((i, idx) => (
                idx !== index
            )),
            events: [...previous.events, {
                type: SketchEventType.imageDelete,
                imageIndex: index,
                imageData
            }]
        }));
    };

    // handle undo for image add / delete / move / resize
    const undoSketch = () => {
        const lastEvent = sketchData.events.at(-1);
        if (lastEvent) {
            const pathsClone = [...sketchData.paths];
            const eventsClone = [...sketchData.events];
            eventsClone.pop();
            switch (lastEvent.type) {
                case SketchEventType.draw:
                    pathsClone.pop();
                    updateSketch((previous) => ({
                        ...previous,
                        paths: pathsClone,
                        events: eventsClone
                    }));
                    break;
                case SketchEventType.imageAdd:
                    if (typeof lastEvent.imageIndex === 'number') {
                        updateSketch((previous) => ({
                            ...previous,
                            images: previous.images.filter((i, idx) => (
                                idx !== lastEvent.imageIndex
                            )),
                            events: eventsClone
                        }));
                    }
                    break;
                case SketchEventType.imageMove:
                case SketchEventType.imageResize:
                    if (typeof lastEvent.imageIndex === 'number' && lastEvent.imageData) {
                        updateSketchImage(
                            lastEvent.imageIndex,
                            lastEvent.imageData,
                            eventsClone
                        );
                    }
                    break;
                case SketchEventType.imageDelete:
                    if (typeof lastEvent.imageIndex === 'number' && lastEvent.imageData) {
                        const index = lastEvent.imageIndex;
                        const data = lastEvent.imageData;
                        updateSketch((previous) => ({
                            ...previous,
                            images: [
                                ...previous.images.slice(0, index),
                                data,
                                ...previous.images.slice(index)
                            ],
                            events: eventsClone
                        }));
                    }
                    break;
                default:
            }
        }
    };

    const clearSketch = () => {
        updateSketch((previous) => ({
            ...defaultSketchData,
            displayed: previous.displayed
        }));
    };

    return {
        sketchData,
        setSketchData,
        setSketchDisplay,
        isFreeDrawing,
        setIsFreeDrawing,
        addSketchDrawPath,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        undoSketch,
        clearSketch
    };
};

export default useSketch;
