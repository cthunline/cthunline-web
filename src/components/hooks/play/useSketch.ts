import { useState, SetStateAction } from 'react';

import {
    PlaySocket,
    SketchData,
    SketchEvent,
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
        if (emit) {
            const { events, ...socketData } = updater(sketchData);
            socket?.emit('sketchUpdate', socketData);
        }
        setSketchData(updater as SetStateAction<SketchData>);
    };

    const setSketchDisplay = (displayed: boolean, emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            displayed
        }), emit);
    };

    const addSketchDrawPath = (path: string, emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            paths: [...previous.paths, path],
            events: [
                ...previous.events,
                SketchEvent.draw
            ]
        }), emit);
    };

    const addSketchImage = (url: string, emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            images: [
                ...previous.images,
                getDefaultImageData(url)
            ],
            events: [
                ...previous.events,
                SketchEvent.imageAdd
            ]
        }), emit);
    };

    const updateSketchImage = (
        index: number,
        image: SketchImageData,
        emit: boolean = true
    ) => {
        updateSketch((previous) => ({
            ...previous,
            images: previous.images.map((img, idx) => (
                idx === index ? image : img
            ))
        }), emit);
    };

    const updateSketchImages = (images: SketchImageData[], emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            images
        }), emit);
    };

    const deleteSketchImage = (index: number, emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            images: previous.images.filter((i, idx) => (
                idx !== index
            ))
        }), emit);
    };

    // TODO TODO TODO
    // handle undo for image add / delete / move / resize
    const undoSketch = (emit: boolean = true) => {
        const lastEvent = sketchData.events.at(-1);
        if (lastEvent) {
            const pathsClone = [...sketchData.paths];
            const eventsClone = [...sketchData.events];
            switch (lastEvent) {
                case SketchEvent.draw:
                    pathsClone.pop();
                    eventsClone.pop();
                    updateSketch((previous) => ({
                        ...previous,
                        paths: pathsClone,
                        events: eventsClone
                    }), emit);
                    break;
                default:
            }
        }
    };

    const clearSketch = (emit: boolean = true) => {
        updateSketch((previous) => ({
            ...defaultSketchData,
            displayed: previous.displayed
        }), emit);
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
