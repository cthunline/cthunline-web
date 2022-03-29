import { useState, SetStateAction } from 'react';

import {
    PlaySocket,
    SketchData,
    SketchEvent,
    SketchEventType,
    SketchImageData,
    SketchTokenData,
    SketchTokenColor
} from '../../../types';
import {
    forwardImage,
    backwardImage
} from '../../../services/sketch';

type SketchColorUses = Record<SketchTokenColor, number>;

const defaultSketchData: SketchData = {
    displayed: false,
    paths: [],
    images: [],
    tokens: [],
    events: []
};

const defaultImageData: Omit<SketchImageData, 'url'> = {
    width: 300,
    x: 100,
    y: 100
};

const defaultTokenData: Omit<SketchTokenData, 'color'> = {
    user: null,
    x: 50,
    y: 50
};

const useSketch = (socket: PlaySocket | null) => {
    const [sketchData, setSketchData] = useState<SketchData>(defaultSketchData);
    const [isFreeDrawing, setIsFreeDrawing] = useState<boolean>(false);

    const getDefaultImageData = (url: string): SketchImageData => ({
        url,
        ...defaultImageData
    });

    const getNewTokenColor = (currentTokens: SketchTokenData[]): SketchTokenColor => {
        const colorUses = Object.fromEntries(
            Object.values(SketchTokenColor).map((color) => [color, 0])
        ) as SketchColorUses;
        currentTokens.map(({ color }) => color).forEach((color) => {
            colorUses[color] += 1;
        });
        const minUsesCount = Math.min(...Object.values(colorUses));
        const filteredColors: Partial<SketchColorUses> = Object.fromEntries(
            Object.entries(colorUses).filter(([, usesCount]) => (
                usesCount === minUsesCount
            ))
        );
        const pickedColor: SketchTokenColor = (
            (Object.keys(filteredColors) as SketchTokenColor[]).shift()
            ?? Object.values(SketchTokenColor)[0]
        );
        return pickedColor;
    };

    const getDefaultTokenData = (currentTokens: SketchTokenData[]): SketchTokenData => ({
        color: getNewTokenColor(currentTokens),
        ...defaultTokenData
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

    const clearDrawings = () => {
        updateSketch((previous) => ({
            ...previous,
            paths: [],
            events: previous.events.filter(({ type }) => (
                type !== SketchEventType.draw
            ))
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
        imageData?: SketchImageData
    ) => {
        const event: SketchEvent = {
            type: eventType,
            imageIndex
        };
        if (imageData) {
            event.imageData = imageData;
        }
        updateSketch((previous) => ({
            ...previous,
            images,
            events: [...previous.events, event]
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

    const addSketchToken = (emit: boolean = true) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: [
                ...previous.tokens,
                getDefaultTokenData(previous.tokens)
            ],
            events: [...previous.events, {
                type: SketchEventType.tokenAdd,
                tokenIndex: previous.tokens.length
            }]
        }), emit);
    };

    const updateSketchToken = (
        index: number,
        token: SketchTokenData,
        events?: SketchEvent[]
    ) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens.map((tok, idx) => (
                idx === index ? token : tok
            )),
            events: events ?? previous.events
        }));
    };

    const updateSketchTokens = (
        tokens: SketchTokenData[],
        eventType: SketchEventType,
        tokenIndex: number,
        tokenData?: SketchTokenData
    ) => {
        const event: SketchEvent = {
            type: eventType,
            tokenIndex
        };
        if (tokenData) {
            event.tokenData = tokenData;
        }
        updateSketch((previous) => ({
            ...previous,
            tokens,
            events: [...previous.events, event]
        }));
    };

    const clearTokens = () => {
        updateSketch((previous) => ({
            ...previous,
            tokens: [],
            events: previous.events.filter(({ type }) => (
                !type.startsWith('token')
            ))
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
                case SketchEventType.imageForward:
                    if (typeof lastEvent.imageIndex === 'number') {
                        const index = lastEvent.imageIndex;
                        updateSketch((previous) => ({
                            ...previous,
                            images: backwardImage(previous.images, index),
                            events: eventsClone
                        }));
                    }
                    break;
                case SketchEventType.imageBackward:
                    if (typeof lastEvent.imageIndex === 'number') {
                        const index = lastEvent.imageIndex;
                        updateSketch((previous) => ({
                            ...previous,
                            images: forwardImage(previous.images, index),
                            events: eventsClone
                        }));
                    }
                    break;
                case SketchEventType.tokenAdd:
                    if (typeof lastEvent.tokenIndex === 'number') {
                        updateSketch((previous) => ({
                            ...previous,
                            tokens: previous.tokens.filter((i, idx) => (
                                idx !== lastEvent.tokenIndex
                            )),
                            events: eventsClone
                        }));
                    }
                    break;
                case SketchEventType.tokenMove:
                    if (typeof lastEvent.tokenIndex === 'number' && lastEvent.tokenData) {
                        updateSketchToken(
                            lastEvent.tokenIndex,
                            lastEvent.tokenData,
                            eventsClone
                        );
                    }
                    break;
                case SketchEventType.tokenDelete:
                    if (typeof lastEvent.tokenIndex === 'number' && lastEvent.tokenData) {
                        const index = lastEvent.tokenIndex;
                        const data = lastEvent.tokenData;
                        updateSketch((previous) => ({
                            ...previous,
                            tokens: [
                                ...previous.tokens.slice(0, index),
                                data,
                                ...previous.tokens.slice(index)
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
        clearDrawings,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        addSketchToken,
        updateSketchTokens,
        clearTokens,
        undoSketch,
        clearSketch
    };
};

export default useSketch;
