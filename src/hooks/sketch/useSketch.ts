import { type SetStateAction, useState } from 'react';

import { widths } from '../../components/common/WidthPicker.js';
import {
    backwardImage,
    forwardImage,
    getNewTokenColor,
    viewBox
} from '../../services/sketch.js';
import { findById, generateId } from '../../services/tools.js';
import type {
    Color,
    PlaySocket,
    SessionUser,
    SketchData,
    SketchDrawingPath,
    SketchEvent,
    SketchEventType,
    SketchImageData,
    SketchTextData,
    SketchTokenAttachedData,
    SketchTokenData
} from '../../types/index.js';

type DrawingState = {
    isDrawing: boolean;
    isErasing: boolean;
};

const defaultDrawingState: DrawingState = {
    isDrawing: false,
    isErasing: false
};

interface UpdateSketchImagesOptions {
    images: SketchImageData[];
    eventType: SketchEventType;
    image: SketchImageData;
}

interface UpdateSketchTextsOptions {
    texts: SketchTextData[];
    eventType: SketchEventType;
    text: SketchTextData;
}

type EventUpdater = (e: SketchEvent[]) => SketchEvent[];

export interface SketchHookExport {
    sketchData: SketchData;
    updateSketch: (
        updater: (previous: SketchData) => SketchData,
        emit?: boolean,
        userAllowed?: boolean
    ) => void;
    setSketchDisplay: (value: boolean) => void;
    drawingState: DrawingState;
    drawingColor: Color;
    setDrawingColor: (color: Color) => void;
    drawingWidth: number;
    setDrawingWidth: (width: number) => void;
    toggleFreeDrawing: () => void;
    toggleDrawingEraser: () => void;
    addSketchDrawPath: (path: SketchDrawingPath) => void;
    deleteSketchDrawPath: (path: SketchDrawingPath) => void;
    clearDrawings: () => void;
    undoSketch: () => void;
    clearSketch: () => void;
    addSketchImage: (url: string, emit?: boolean) => void;
    updateSketchImage: (
        image: SketchImageData,
        updateEvents?: EventUpdater
    ) => void;
    updateSketchImages: (options: UpdateSketchImagesOptions) => void;
    deleteSketchImage: (id: string, imageData: SketchImageData) => void;
    addSketchText: () => void;
    updateSketchText: (text: SketchTextData, event: SketchEvent) => void;
    updateSketchTexts: (options: UpdateSketchTextsOptions) => void;
    changeTextColor: (id: string, color: Color) => void;
    changeTextFontSize: (id: string, fontSize: number) => void;
    duplicateText: (id: string) => void;
    deleteSketchText: (id: string, textData: SketchTextData) => void;
    clearTexts: () => void;
    addSketchToken: () => void;
    addSketchUserTokens: (users: SessionUser[]) => void;
    updateMovingToken: (
        token: SketchTokenData,
        initialToken: SketchTokenData,
        userAllowed?: boolean
    ) => void;
    attachTokenData: (id: string, user: SessionUser) => void;
    unattachTokenData: (id: string) => void;
    duplicateToken: (id: string) => void;
    changeTokenColor: (id: string, color: Color) => void;
    deleteSketchToken: (id: string, tokenData: SketchTokenData) => void;
    clearTokens: () => void;
}

const defaultDrawingColor: Color = 'white';
const defaultTextColor: Color = 'white';
const defaultTextFontSize = 16;
const defaultTextContent = 'ABCDEF';

export const defaultSketchHookExport: SketchHookExport = {
    sketchData: {
        displayed: false,
        paths: [],
        images: [],
        texts: [],
        tokens: [],
        events: []
    },
    updateSketch: () => {
        /* default */
    },
    setSketchDisplay: () => {
        /* default */
    },
    drawingState: defaultDrawingState,
    drawingColor: defaultDrawingColor,
    setDrawingColor: () => {
        /* default */
    },
    drawingWidth: 5,
    setDrawingWidth: () => {
        /* default */
    },
    toggleFreeDrawing: () => {
        /* default */
    },
    toggleDrawingEraser: () => {
        /* default */
    },
    addSketchDrawPath: () => {
        /* default */
    },
    deleteSketchDrawPath: () => {
        /* default */
    },
    clearDrawings: () => {
        /* default */
    },
    undoSketch: () => {
        /* default */
    },
    clearSketch: () => {
        /* default */
    },
    addSketchImage: () => {
        /* default */
    },
    updateSketchImage: () => {
        /* default */
    },
    updateSketchImages: () => {
        /* default */
    },
    deleteSketchImage: () => {
        /* default */
    },
    addSketchText: () => {
        /* default */
    },
    updateSketchText: () => {
        /* default */
    },
    updateSketchTexts: () => {
        /* default */
    },
    changeTextColor: () => {
        /* default */
    },
    changeTextFontSize: () => {
        /* default */
    },
    duplicateText: () => {
        /* default */
    },
    deleteSketchText: () => {
        /* default */
    },
    clearTexts: () => {
        /* default */
    },
    addSketchToken: () => {
        /* default */
    },
    addSketchUserTokens: () => {
        /* default */
    },
    updateMovingToken: () => {
        /* default */
    },
    attachTokenData: () => {
        /* default */
    },
    unattachTokenData: () => {
        /* default */
    },
    duplicateToken: () => {
        /* default */
    },
    changeTokenColor: () => {
        /* default */
    },
    deleteSketchToken: () => {
        /* default */
    },
    clearTokens: () => {
        /* default */
    }
};

const defaultSketchData: SketchData = {
    displayed: false,
    paths: [],
    images: [],
    texts: [],
    tokens: [],
    events: []
};

const defaultImageData: Omit<SketchImageData, 'id' | 'index' | 'url'> = {
    width: 300,
    x: 100,
    y: 100
};

const defaultTokenData: Omit<SketchTokenData, 'id' | 'index' | 'color'> = {
    attachedData: null,
    x: 50,
    y: 50,
    tooltipPlacement: 'bottom'
};

// this hooks holds sketch states and utility functions
// it is meant to be used in play context
const useSketch = (socket: PlaySocket | null) => {
    const [sketchData, setSketchData] = useState<SketchData>(defaultSketchData);
    const [drawingState, setDrawingState] =
        useState<DrawingState>(defaultDrawingState);
    const [drawingColor, setDrawingColor] = useState<Color>('white');
    const [drawingWidth, setDrawingWidth] = useState<number>(widths.sm);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ sketch

    const updateSketch = (
        updater: (previous: SketchData) => SketchData,
        emit = true,
        userAllowed = false
    ) => {
        setSketchData((prev: SketchData) => {
            const nextSketchData = updater(prev);
            if (emit && (socket?.isMaster || userAllowed)) {
                const { events, ...sketchUpdateData } = nextSketchData;
                socket?.emit('sketchUpdate', sketchUpdateData);
            }
            return nextSketchData;
        });
    };

    const setSketchDisplay = (displayed: boolean) => {
        updateSketch((previous) => ({
            ...previous,
            displayed
        }));
    };

    const clearSketch = () => {
        updateSketch((previous) => ({
            ...defaultSketchData,
            displayed: previous.displayed
        }));
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ drawing

    const toggleFreeDrawing = () => {
        setDrawingState((prev) => ({
            isDrawing: !prev.isDrawing,
            isErasing: false
        }));
    };

    const toggleDrawingEraser = () => {
        setDrawingState((prev) => ({
            isDrawing: false,
            isErasing: !prev.isErasing
        }));
    };

    const addSketchDrawPath = (path: SketchDrawingPath) => {
        updateSketch((previous) => ({
            ...previous,
            paths: [...previous.paths, path],
            events: [
                ...previous.events,
                {
                    type: 'drawingAdd',
                    drawing: path
                }
            ]
        }));
    };

    const deleteSketchDrawPath = (path: SketchDrawingPath) => {
        updateSketch((previous) => {
            const pathIndex = previous.paths.findIndex(
                ({ id }) => id === path.id
            );
            return {
                ...previous,
                paths: previous.paths.toSpliced(pathIndex, 1),
                events: [
                    ...previous.events,
                    {
                        type: 'drawingDelete',
                        drawing: {
                            ...path,
                            index: pathIndex
                        }
                    }
                ]
            };
        });
    };

    const clearDrawings = () => {
        updateSketch((previous) => ({
            ...previous,
            paths: [],
            events: previous.events.filter(({ type }) => type !== 'drawingAdd')
        }));
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ images

    const getNewImageData = (url: string, index: number): SketchImageData => ({
        id: generateId(),
        index,
        url,
        ...defaultImageData
    });

    const addSketchImage = (url: string, emit = true) => {
        updateSketch((previous) => {
            const image = getNewImageData(url, previous.images.length);
            return {
                ...previous,
                images: [...previous.images, image],
                events: [
                    ...previous.events,
                    {
                        type: 'imageAdd',
                        image
                    }
                ]
            };
        }, emit);
    };

    const updateSketchImage = (
        image: SketchImageData,
        updateEvents?: EventUpdater
    ) => {
        updateSketch((previous) => ({
            ...previous,
            images: previous.images.map((img) =>
                img.id === image.id ? image : img
            ),
            events: updateEvents?.(previous.events) ?? previous.events
        }));
    };

    const updateSketchImages = ({
        images,
        eventType,
        image
    }: UpdateSketchImagesOptions) => {
        const event: SketchEvent = {
            type: eventType,
            image
        };
        updateSketch((previous) => ({
            ...previous,
            images,
            events: [...previous.events, event]
        }));
    };

    const deleteSketchImage = (id: string, image: SketchImageData) => {
        updateSketch((previous) => ({
            ...previous,
            images: previous.images
                .filter(({ id: imgId }) => id !== imgId)
                .map((img, index) => ({
                    ...img,
                    index
                })),
            events: [
                ...previous.events,
                {
                    type: 'imageDelete',
                    image
                }
            ]
        }));
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ texts

    const addSketchText = () => {
        updateSketch((previous) => {
            const text: SketchTextData = {
                id: generateId(),
                index: previous.texts.length,
                text: defaultTextContent,
                fontSize: defaultTextFontSize,
                color: defaultTextColor,
                x: 75,
                y: 75
            };
            return {
                ...previous,
                texts: [...previous.texts, text],
                events: [
                    ...previous.events,
                    {
                        type: 'textAdd',
                        text
                    }
                ]
            };
        });
    };

    const duplicateText = (id: string) => {
        updateSketch((previous) => {
            const { texts } = previous;
            const text = findById<SketchTextData>(texts, id);
            const newYDelta = text.fontSize + 10;
            const sketchMiddleY = viewBox.height / 2;
            const newY =
                text.y > sketchMiddleY
                    ? text.y - newYDelta
                    : text.y + newYDelta;
            const newText = {
                ...text,
                id: generateId(),
                y: newY
            };
            return {
                ...previous,
                texts: [...texts, newText],
                events: [
                    ...previous.events,
                    {
                        type: 'textAdd',
                        text: newText
                    }
                ]
            };
        });
    };

    const updateSketchText = (text: SketchTextData, event: SketchEvent) => {
        updateSketch((previous) => ({
            ...previous,
            texts: previous.texts.map((txt) =>
                txt.id === text.id ? text : txt
            ),
            events: event ? [...previous.events, event] : previous.events
        }));
    };

    const updateSketchTexts = ({
        texts,
        eventType,
        text
    }: UpdateSketchTextsOptions) => {
        const event: SketchEvent = {
            type: eventType,
            text
        };
        updateSketch((previous) => ({
            ...previous,
            texts,
            events: [...previous.events, event]
        }));
    };

    const changeTextColor = (id: string, color: Color) => {
        updateSketch((previous) => ({
            ...previous,
            texts: previous.texts.map((text) =>
                text.id === id
                    ? {
                          ...text,
                          color
                      }
                    : text
            )
        }));
    };

    const changeTextFontSize = (id: string, fontSize: number) => {
        updateSketch((previous) => ({
            ...previous,
            texts: previous.texts.map((text) =>
                text.id === id
                    ? {
                          ...text,
                          fontSize
                      }
                    : text
            )
        }));
    };

    const deleteSketchText = (id: string, textData: SketchTextData) => {
        updateSketch((previous) => ({
            ...previous,
            texts: previous.texts
                .filter(({ id: txtId }) => id !== txtId)
                .map((txt, index) => ({
                    ...txt,
                    index
                })),
            events: [
                ...previous.events,
                {
                    type: 'textDelete',
                    text: textData
                }
            ]
        }));
    };

    const clearTexts = () => {
        updateSketch((previous) => ({
            ...previous,
            texts: [],
            events: previous.events.filter(
                ({ type }) => !type.startsWith('text')
            )
        }));
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ tokens

    const getNewTokenData = (
        currentTokens: SketchTokenData[]
    ): SketchTokenData => ({
        id: generateId(),
        index: currentTokens.length,
        color: getNewTokenColor(currentTokens),
        ...defaultTokenData
    });

    const addSketchToken = () => {
        updateSketch((previous) => {
            const token = getNewTokenData(previous.tokens);
            return {
                ...previous,
                tokens: [...previous.tokens, token],
                events: [
                    ...previous.events,
                    {
                        type: 'tokenAdd',
                        token
                    }
                ]
            };
        });
    };

    const addSketchUserTokens = (users: SessionUser[]) => {
        updateSketch((previous) => {
            let x = 0;
            let y = 0;
            const tokens = [...previous.tokens];
            const events = [...previous.events];
            for (const { id, name, isMaster, character } of users) {
                if (!isMaster) {
                    const token = getNewTokenData(tokens);
                    if (!x && !y) {
                        x = token.x;
                        y = token.y;
                    } else {
                        y += 75;
                    }
                    tokens.push({
                        ...token,
                        attachedData: {
                            userId: id,
                            userName: name,
                            characterId: character.id,
                            characterName: character.name
                        },
                        x,
                        y
                    });
                    events.push({
                        type: 'tokenAdd',
                        token
                    });
                }
            }
            return {
                ...previous,
                tokens,
                events
            };
        });
    };

    const updateMovingToken = (
        token: SketchTokenData,
        initialToken: SketchTokenData,
        userAllowed?: boolean
    ) => {
        const event: SketchEvent = {
            type: 'tokenMove',
            token: initialToken
        };
        const updater = (previous: SketchData) => ({
            ...previous,
            tokens: previous.tokens.map((tok) =>
                tok.id === token.id ? token : tok
            ),
            events: [...previous.events, event]
        });
        if (socket?.isMaster || userAllowed) {
            socket?.emit('tokenUpdate', token);
        }
        setSketchData(updater as SetStateAction<SketchData>);
    };

    const setTokenAttachedData = (
        id: string,
        attachedData: SketchTokenAttachedData | null
    ) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens.map((token) =>
                token.id === id
                    ? {
                          ...token,
                          attachedData
                      }
                    : token
            )
        }));
    };

    const attachTokenData = (id: string, sessionUser: SessionUser) => {
        setTokenAttachedData(id, {
            userId: sessionUser.id,
            userName: sessionUser.name,
            characterId: sessionUser.character.id,
            characterName: sessionUser.character.name
        });
    };

    const unattachTokenData = (id: string) => {
        setTokenAttachedData(id, null);
    };

    const duplicateToken = (id: string) => {
        updateSketch((previous) => {
            const { tokens } = previous;
            const token = findById<SketchTokenData>(tokens, id);
            // use tooltip placement to calculate new token position
            const newY =
                token.tooltipPlacement === 'bottom'
                    ? token.y + 75
                    : token.y - 75;
            const newToken = {
                ...token,
                id: generateId(),
                y: newY
            };
            return {
                ...previous,
                tokens: [...tokens, newToken],
                events: [
                    ...previous.events,
                    {
                        type: 'tokenAdd',
                        token: newToken
                    }
                ]
            };
        });
    };

    const changeTokenColor = (id: string, color: Color) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens.map((token) =>
                token.id === id
                    ? {
                          ...token,
                          color
                      }
                    : token
            )
        }));
    };

    const deleteSketchToken = (id: string, token: SketchTokenData) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens
                .filter(({ id: tokId }) => id !== tokId)
                .map((tok, index) => ({
                    ...tok,
                    index
                })),
            events: [
                ...previous.events,
                {
                    type: 'tokenDelete',
                    token
                }
            ]
        }));
    };

    const clearTokens = () => {
        updateSketch((previous) => ({
            ...previous,
            tokens: [],
            events: previous.events.filter(
                ({ type }) => !type.startsWith('token')
            )
        }));
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ events

    const removeLastEvent = (events: SketchEvent[]) => events.toSpliced(-1, 1);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ undo

    const undoDrawingAdd = () => {
        const pathsClone = [...sketchData.paths];
        pathsClone.pop();
        updateSketch((previous) => ({
            ...previous,
            paths: pathsClone,
            events: removeLastEvent(previous.events)
        }));
    };

    const undoDrawingDelete = (lastEvent: SketchEvent) => {
        if (lastEvent.drawing) {
            const { index: eventIndex, ...drawing } = lastEvent.drawing;
            updateSketch((previous) => {
                const defaultIndex = previous.paths.length - 1;
                const index = eventIndex ?? defaultIndex;
                return {
                    ...previous,
                    paths: previous.paths.toSpliced(index, 0, drawing),
                    events: removeLastEvent(previous.events)
                };
            });
        }
    };

    const undoImageAdd = (lastEvent: SketchEvent) => {
        if (lastEvent.image) {
            const imageId = lastEvent.image.id;
            updateSketch((previous) => ({
                ...previous,
                images: previous.images
                    .filter(({ id }) => id !== imageId)
                    .map((img, index) => ({
                        ...img,
                        index
                    })),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoImageMoveOrResize = ({ image }: SketchEvent) => {
        if (image) {
            updateSketch((previous) => ({
                ...previous,
                images: previous.images.map((img) =>
                    img.id === image.id ? image : img
                ),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoImageDelete = (lastEvent: SketchEvent) => {
        if (lastEvent.image) {
            const { image } = lastEvent;
            updateSketch((previous) => ({
                ...previous,
                images: [
                    ...previous.images.slice(0, image.index),
                    image,
                    ...previous.images.slice(image.index)
                ].map((img, index) => ({
                    ...img,
                    index
                })),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoImageForwardOrBackward = (lastEvent: SketchEvent) => {
        if (lastEvent.image) {
            const { image } = lastEvent;
            updateSketch((previous) => ({
                ...previous,
                images:
                    lastEvent.type === 'imageForward'
                        ? backwardImage(previous.images, image.index)
                        : forwardImage(previous.images, image.index),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoTextAdd = (lastEvent: SketchEvent) => {
        if (lastEvent.text) {
            const textId = lastEvent.text.id;
            updateSketch((previous) => ({
                ...previous,
                texts: previous.texts
                    .filter(({ id }) => id !== textId)
                    .map((txt, index) => ({
                        ...txt,
                        index
                    })),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoTextUpdate = ({ text }: SketchEvent) => {
        if (text) {
            updateSketch((previous) => ({
                ...previous,
                texts: previous.texts.map((txt) =>
                    txt.id === text.id ? text : txt
                ),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoTextDelete = (lastEvent: SketchEvent) => {
        if (lastEvent.text) {
            const { text } = lastEvent;
            updateSketch((previous) => ({
                ...previous,
                texts: [
                    ...previous.texts.slice(0, text.index),
                    text,
                    ...previous.texts.slice(text.index)
                ].map((txt, index) => ({
                    ...txt,
                    index
                })),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoTokenAdd = (lastEvent: SketchEvent) => {
        if (lastEvent.token) {
            const tokenId = lastEvent.token.id;
            updateSketch((previous) => ({
                ...previous,
                tokens: previous.tokens
                    .filter(({ id }) => id !== tokenId)
                    .map((tok, index) => ({
                        ...tok,
                        index
                    })),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoTokenMove = ({ token }: SketchEvent) => {
        if (token) {
            updateSketch((previous) => ({
                ...previous,
                tokens: previous.tokens.map((tok) =>
                    tok.id === token.id ? token : tok
                ),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    const undoTokenDelete = (lastEvent: SketchEvent) => {
        if (lastEvent.token) {
            const { token } = lastEvent;
            updateSketch((previous) => ({
                ...previous,
                tokens: [
                    ...previous.tokens.slice(0, token.index),
                    token,
                    ...previous.tokens.slice(token.index)
                ].map((tok, index) => ({
                    ...tok,
                    index
                })),
                events: removeLastEvent(previous.events)
            }));
        }
    };

    // handle undo action on sketch
    const undoSketch = () => {
        const lastEvent = sketchData.events.at(-1);
        if (lastEvent) {
            switch (lastEvent.type) {
                case 'drawingAdd':
                    undoDrawingAdd();
                    break;
                case 'drawingDelete':
                    undoDrawingDelete(lastEvent);
                    break;
                case 'imageAdd':
                    undoImageAdd(lastEvent);
                    break;
                case 'imageMove':
                case 'imageResize':
                    undoImageMoveOrResize(lastEvent);
                    break;
                case 'imageDelete':
                    undoImageDelete(lastEvent);
                    break;
                case 'imageForward':
                case 'imageBackward':
                    undoImageForwardOrBackward(lastEvent);
                    break;
                case 'textAdd':
                    undoTextAdd(lastEvent);
                    break;
                case 'textEdit':
                case 'textMove':
                    undoTextUpdate(lastEvent);
                    break;
                case 'textDelete':
                    undoTextDelete(lastEvent);
                    break;
                case 'tokenAdd':
                    undoTokenAdd(lastEvent);
                    break;
                case 'tokenMove':
                    undoTokenMove(lastEvent);
                    break;
                case 'tokenDelete':
                    undoTokenDelete(lastEvent);
                    break;
                default:
            }
        }
    };

    return {
        sketchData,
        setSketchData,
        updateSketch,
        setSketchDisplay,
        drawingState,
        drawingColor,
        setDrawingColor,
        drawingWidth,
        setDrawingWidth,
        toggleFreeDrawing,
        toggleDrawingEraser,
        addSketchDrawPath,
        deleteSketchDrawPath,
        clearDrawings,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        addSketchText,
        updateSketchText,
        updateSketchTexts,
        changeTextColor,
        changeTextFontSize,
        duplicateText,
        deleteSketchText,
        clearTexts,
        addSketchToken,
        addSketchUserTokens,
        updateMovingToken,
        duplicateToken,
        changeTokenColor,
        attachTokenData,
        unattachTokenData,
        deleteSketchToken,
        clearTokens,
        undoSketch,
        clearSketch
    };
};

export default useSketch;
