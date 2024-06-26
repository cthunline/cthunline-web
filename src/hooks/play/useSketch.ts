import { useState, type SetStateAction } from 'react';

import { widths } from '../../components/common/WidthPicker.js';
import { generateId, findById } from '../../services/tools.js';
import {
    forwardImage,
    backwardImage,
    getNewTokenColor
} from '../../services/sketch.js';
import {
    type PlaySocket,
    type SketchData,
    type SketchEvent,
    SketchEventType,
    type SketchImageData,
    type SketchTokenData,
    type SessionUser,
    type SketchTokenAttachedData,
    type Color,
    TooltipPlacement,
    type SketchDrawingPath
} from '../../types/index.js';

interface UpdateSketchImagesOptions {
    images: SketchImageData[];
    eventType: SketchEventType;
    image: SketchImageData;
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
    isFreeDrawing: boolean;
    drawingColor: Color;
    setDrawingColor: (color: Color) => void;
    drawingWidth: number;
    setDrawingWidth: (width: number) => void;
    toggleFreeDrawing: () => void;
    addSketchDrawPath: (path: SketchDrawingPath) => void;
    clearDrawings: () => void;
    undoSketch: () => void;
    clearSketch: () => void;
    addSketchImage: (url: string, emit?: boolean) => void;
    updateSketchImage: (
        image: SketchImageData,
        newEvents?: SketchEvent[] | EventUpdater
    ) => void;
    updateSketchImages: (options: UpdateSketchImagesOptions) => void;
    deleteSketchImage: (id: string, imageData: SketchImageData) => void;
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

export const defaultSketchHookExport: SketchHookExport = {
    sketchData: {
        displayed: false,
        paths: [],
        images: [],
        tokens: [],
        events: []
    },
    updateSketch: () => {
        /* default */
    },
    setSketchDisplay: () => {
        /* default */
    },
    isFreeDrawing: false,
    drawingColor: 'white',
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
    addSketchDrawPath: () => {
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
    tooltipPlacement: TooltipPlacement.bottom
};

// this hooks holds sketch states and utility functions
// it is meant to be used in play context
const useSketch = (socket: PlaySocket | null) => {
    const [sketchData, setSketchData] = useState<SketchData>(defaultSketchData);
    const [isFreeDrawing, setIsFreeDrawing] = useState<boolean>(false);
    const [drawingColor, setDrawingColor] = useState<Color>('white');
    const [drawingWidth, setDrawingWidth] = useState<number>(widths.sm);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ sketch

    const updateSketch = (
        updater: (previous: SketchData) => SketchData,
        emit: boolean = true,
        userAllowed: boolean = false
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
        setIsFreeDrawing((prev) => !prev);
    };

    const addSketchDrawPath = (path: SketchDrawingPath) => {
        updateSketch((previous) => ({
            ...previous,
            paths: [...previous.paths, path],
            events: [
                ...previous.events,
                {
                    type: SketchEventType.draw
                }
            ]
        }));
    };

    const clearDrawings = () => {
        updateSketch((previous) => ({
            ...previous,
            paths: [],
            events: previous.events.filter(
                ({ type }) => type !== SketchEventType.draw
            )
        }));
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ images

    const getNewImageData = (url: string, index: number): SketchImageData => ({
        id: generateId(),
        index,
        url,
        ...defaultImageData
    });

    const addSketchImage = (url: string, emit: boolean = true) => {
        updateSketch((previous) => {
            const image = getNewImageData(url, previous.images.length);
            return {
                ...previous,
                images: [...previous.images, image],
                events: [
                    ...previous.events,
                    {
                        type: SketchEventType.imageAdd,
                        image
                    }
                ]
            };
        }, emit);
    };

    const updateSketchImage = (
        image: SketchImageData,
        newEvents?: SketchEvent[] | EventUpdater
    ) => {
        updateSketch((previous) => {
            let { events } = previous;
            if (newEvents && Array.isArray(newEvents)) {
                events = newEvents;
            } else if (newEvents && typeof newEvents === 'function') {
                events = newEvents(previous.events);
            }
            return {
                ...previous,
                images: previous.images.map((img) =>
                    img.id === image.id ? image : img
                ),
                events
            };
        });
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
                    type: SketchEventType.imageDelete,
                    image
                }
            ]
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
                        type: SketchEventType.tokenAdd,
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
            users.forEach(({ id, name, isMaster, character }) => {
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
                        type: SketchEventType.tokenAdd,
                        token
                    });
                }
            });
            return {
                ...previous,
                tokens,
                events
            };
        });
    };

    const updateSketchToken = (
        token: SketchTokenData,
        events?: SketchEvent[]
    ) => {
        updateSketch((previous) => ({
            ...previous,
            tokens: previous.tokens.map((tok) =>
                tok.id === token.id ? token : tok
            ),
            events: events ?? previous.events
        }));
    };

    const updateMovingToken = (
        token: SketchTokenData,
        initialToken: SketchTokenData,
        userAllowed?: boolean
    ) => {
        const event: SketchEvent = {
            type: SketchEventType.tokenMove,
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
                token.tooltipPlacement === TooltipPlacement.bottom
                    ? token.y + 75
                    : token.y - 75;
            return {
                ...previous,
                tokens: [
                    ...tokens,
                    {
                        ...token,
                        id: generateId(),
                        y: newY
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
                    type: SketchEventType.tokenDelete,
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

    const popEvents = () => {
        const eventsClone = [...sketchData.events];
        eventsClone.pop();
        return eventsClone;
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ undo

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
                events: popEvents()
            }));
        }
    };

    const undoImageMoveOrResize = (lastEvent: SketchEvent) => {
        if (lastEvent.image) {
            updateSketchImage(lastEvent.image, popEvents());
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
                events: popEvents()
            }));
        }
    };

    const undoImageForwardOrBackward = (lastEvent: SketchEvent) => {
        if (lastEvent.image) {
            const { image } = lastEvent;
            updateSketch((previous) => ({
                ...previous,
                images:
                    lastEvent.type === SketchEventType.imageForward
                        ? backwardImage(previous.images, image.index)
                        : forwardImage(previous.images, image.index),
                events: popEvents()
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
                events: popEvents()
            }));
        }
    };

    const undoTokenMove = (lastEvent: SketchEvent) => {
        if (lastEvent.token) {
            updateSketchToken(lastEvent.token, popEvents());
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
                    undoImageMoveOrResize(lastEvent);
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

    return {
        sketchData,
        setSketchData,
        updateSketch,
        setSketchDisplay,
        isFreeDrawing,
        drawingColor,
        setDrawingColor,
        drawingWidth,
        setDrawingWidth,
        toggleFreeDrawing,
        addSketchDrawPath,
        clearDrawings,
        addSketchImage,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
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
