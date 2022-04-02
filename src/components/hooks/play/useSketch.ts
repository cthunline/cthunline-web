import { useState, SetStateAction } from 'react';

import {
    PlaySocket,
    SketchData,
    SketchEvent,
    SketchEventType,
    SketchImageData,
    SketchTokenData,
    SketchTokenColor,
    SessionUser,
    SketchTokenUserData
} from '../../../types';
import {
    forwardImage,
    backwardImage
} from '../../../services/sketch';
import { randomItem } from '../../../services/tools';

export interface SketchHookExport {
    sketchData: SketchData;
    setSketchDisplay: (value: boolean) => void;
    isFreeDrawing: boolean;
    setIsFreeDrawing: (value: boolean) => void;
    addSketchDrawPath: (path: string) => void;
    clearDrawings: () => void;
    undoSketch: () => void;
    clearSketch: () => void;
    addSketchImage: (url: string, emit?: boolean) => void;
    updateSketchImage: (index: number, image: SketchImageData) => void;
    updateSketchImages: (
        images: SketchImageData[],
        eventType: SketchEventType,
        imageIndex: number,
        imageData?: SketchImageData
    ) => void;
    deleteSketchImage: (index: number, imageData: SketchImageData) => void;
    addSketchToken: () => void;
    addSketchUserTokens: (users: SessionUser[]) => void;
    updateSketchTokens: (
        tokens: SketchTokenData[],
        eventType: SketchEventType,
        tokenIndex: number,
        tokenData?: SketchTokenData,
        userAllowed?: boolean
    ) => void;
    assignTokenUser: (index: number, user: SessionUser) => void;
    unassignTokenUser: (index: number) => void;
    deleteSketchToken: (index: number, tokenData: SketchTokenData) => void;
    clearTokens: () => void;
}

export const defaultSketchHookExport: SketchHookExport = {
    sketchData: {
        displayed: false,
        paths: [],
        images: [],
        tokens: [],
        events: []
    },
    setSketchDisplay: () => { /* default */ },
    isFreeDrawing: false,
    setIsFreeDrawing: () => { /* default */ },
    addSketchDrawPath: () => { /* default */ },
    clearDrawings: () => { /* default */ },
    undoSketch: () => { /* default */ },
    clearSketch: () => { /* default */ },
    addSketchImage: () => { /* default */ },
    updateSketchImage: () => { /* default */ },
    updateSketchImages: () => { /* default */ },
    deleteSketchImage: () => { /* default */ },
    addSketchToken: () => { /* default */ },
    addSketchUserTokens: () => { /* default */ },
    updateSketchTokens: () => { /* default */ },
    assignTokenUser: () => { /* default */ },
    unassignTokenUser: () => { /* default */ },
    deleteSketchToken: () => { /* default */ },
    clearTokens: () => { /* default */ }
};

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
            randomItem(Object.keys(filteredColors) as SketchTokenColor[])
            ?? randomItem(Object.values(SketchTokenColor))
        );
        return pickedColor;
    };

    const getDefaultTokenData = (currentTokens: SketchTokenData[]): SketchTokenData => ({
        color: getNewTokenColor(currentTokens),
        ...defaultTokenData
    });

    const updateSketch = (
        updater: (previous: SketchData) => SketchData,
        emit: boolean = true,
        useAllowed: boolean = false
    ) => {
        if (emit && (socket?.isMaster || useAllowed)) {
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

    const addSketchToken = () => {
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
        }));
    };

    const addSketchUserTokens = (users: SessionUser[]) => {
        updateSketch((previous) => {
            let x = 0;
            let y = 0;
            const tokens = [...previous.tokens];
            const events = [...previous.events];
            users.forEach(({ id, name }) => {
                const token = getDefaultTokenData(tokens);
                if (!x && !y) {
                    x = token.x;
                    y = token.y;
                } else {
                    y += 75;
                }
                tokens.push({
                    ...token,
                    user: { id, name },
                    x,
                    y
                });
                events.push({
                    type: SketchEventType.tokenAdd,
                    tokenIndex: tokens.length - 1
                });
            });
            return {
                ...previous,
                tokens,
                events
            };
        });
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
        tokenData?: SketchTokenData,
        userAllowed?: boolean
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
        }), true, userAllowed);
    };

    const setTokenUser = (index: number, tokenUser: SketchTokenUserData | null) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens.map((tok, idx) => (
                idx === index ? {
                    ...tok,
                    user: tokenUser
                } : tok
            ))
        }));
    };

    const assignTokenUser = (index: number, { id, name }: SessionUser) => {
        setTokenUser(index, { id, name });
    };

    const unassignTokenUser = (index: number) => {
        setTokenUser(index, null);
    };

    const deleteSketchToken = (index: number, tokenData: SketchTokenData) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens.filter((t, idx) => (
                idx !== index
            )),
            events: [...previous.events, {
                type: SketchEventType.tokenDelete,
                tokenIndex: index,
                tokenData
            }]
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

    const popEvents = () => {
        const eventsClone = [...sketchData.events];
        eventsClone.pop();
        return eventsClone;
    };

    const undoDrawing = () => {
        const pathsClone = [...sketchData.paths];
        pathsClone.pop();
        updateSketch((previous) => ({
            ...previous,
            paths: pathsClone,
            events: popEvents()
        }));
    };

    const undoImageAdd = (lastEvent: SketchEvent) => {
        if (typeof lastEvent.imageIndex === 'number') {
            updateSketch((previous) => ({
                ...previous,
                images: previous.images.filter((i, idx) => (
                    idx !== lastEvent.imageIndex
                )),
                events: popEvents()
            }));
        }
    };

    const undoImageMoreOrResize = (lastEvent: SketchEvent) => {
        if (typeof lastEvent.imageIndex === 'number' && lastEvent.imageData) {
            updateSketchImage(
                lastEvent.imageIndex,
                lastEvent.imageData,
                popEvents()
            );
        }
    };

    const undoImageDelete = (lastEvent: SketchEvent) => {
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
                events: popEvents()
            }));
        }
    };

    const undoImageForwardOrBackward = (lastEvent: SketchEvent) => {
        if (typeof lastEvent.imageIndex === 'number') {
            const index = lastEvent.imageIndex;
            updateSketch((previous) => ({
                ...previous,
                images: lastEvent.type === SketchEventType.imageForward ? (
                    backwardImage(previous.images, index)
                ) : (
                    forwardImage(previous.images, index)
                ),
                events: popEvents()
            }));
        }
    };

    const undoTokenAdd = (lastEvent: SketchEvent) => {
        if (typeof lastEvent.tokenIndex === 'number') {
            updateSketch((previous) => ({
                ...previous,
                tokens: previous.tokens.filter((i, idx) => (
                    idx !== lastEvent.tokenIndex
                )),
                events: popEvents()
            }));
        }
    };

    const undoTokenMove = (lastEvent: SketchEvent) => {
        if (typeof lastEvent.tokenIndex === 'number' && lastEvent.tokenData) {
            updateSketchToken(
                lastEvent.tokenIndex,
                lastEvent.tokenData,
                popEvents()
            );
        }
    };

    const undoTokenDelete = (lastEvent: SketchEvent) => {
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
                events: popEvents()
            }));
        }
    };

    // handle undo action on sketch
    const undoSketch = () => {
        const lastEvent = sketchData.events.at(-1);
        if (lastEvent) {
            switch (lastEvent.type) {
                case SketchEventType.draw:
                    undoDrawing();
                    break;
                case SketchEventType.imageAdd:
                    undoImageAdd(lastEvent);
                    break;
                case SketchEventType.imageMove:
                case SketchEventType.imageResize:
                    undoImageMoreOrResize(lastEvent);
                    break;
                case SketchEventType.imageDelete:
                    undoImageDelete(lastEvent);
                    break;
                case SketchEventType.imageForward:
                case SketchEventType.imageBackward:
                    undoImageForwardOrBackward(lastEvent);
                    break;
                case SketchEventType.tokenAdd:
                    undoTokenAdd(lastEvent);
                    break;
                case SketchEventType.tokenMove:
                    undoTokenMove(lastEvent);
                    break;
                case SketchEventType.tokenDelete:
                    undoTokenDelete(lastEvent);
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
        addSketchUserTokens,
        updateSketchTokens,
        assignTokenUser,
        unassignTokenUser,
        deleteSketchToken,
        clearTokens,
        undoSketch,
        clearSketch
    };
};

export default useSketch;
