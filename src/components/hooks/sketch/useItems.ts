import { useState, useEffect, useRef } from 'react';

import { sketchContextMenuId } from '../../features/play/sketch/SketchContextMenu.js';
import { usePlay } from '../../contexts/Play.js';
import {
    findById,
    findIndexById,
    isMainClick
} from '../../../services/tools.js';
import {
    getMouseEventSvgCoordinates,
    getMovingItemCoordinates,
    getResizingItemCoordAndPos,
    forwardImage,
    backwardImage
} from '../../../services/sketch.js';
import {
    type SketchImageData,
    type SketchMovingItemData,
    type SketchResizingItemData,
    type CardinalDirection,
    SketchEventType,
    type SketchTokenData,
    SketchItemType,
    TooltipPlacement,
    type SketchEvent
} from '../../../types/index.js';

// this hook holds states and event handlers for sketch items (images and tokens)
// it is meant to be used by the sketch component and sub components
const useItems = (
    svgRef: React.MutableRefObject<SVGSVGElement>,
    isMaster: boolean = false
) => {
    const {
        isFreeDrawing,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        updateMovingToken,
        deleteSketchToken
    } = usePlay();

    // list of images in the sketch
    const [images, setImages] = useState<SketchImageData[]>([]);
    // list of tokens in the sketch
    const [tokens, setTokens] = useState<SketchTokenData[]>([]);
    // current selected image index
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    // data of item (image or token) currently being moved
    // (index property is reffering to the imagesRef array below)
    const [movingItem, setMovingItem] = useState<SketchMovingItemData | null>(
        null
    );
    // data of item (image or token) currently being resized
    const [resizingItem, setResizingItem] =
        useState<SketchResizingItemData | null>(null);
    // DOMPoint used to calculate transformed coordinates the the svg viewbox
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();

    // ref boolean to check if an item has been moved or reisized
    // it is used so items are not uselessly updated if we
    // mouseDown on an item without moving or resizing it
    const itemHasMovedOfResized = useRef<boolean>(false);

    // gets item data from id and item type
    const getItemData = (id: string, type: SketchItemType) => {
        if (type === SketchItemType.image) {
            return findById<SketchImageData>(images, id);
        }
        if (type === SketchItemType.token) {
            return findById<SketchTokenData>(tokens, id);
        }
        throw new Error('Could not get item data');
    };

    // helper to set an image in the images state array
    const setImage = (id: string, data: SketchImageData) => {
        setImages((previous) =>
            previous.map((image) => (image.id === id ? data : image))
        );
    };

    // helper to set a token in the tokens state array
    const setToken = (id: string, data: SketchTokenData) => {
        setTokens((previous) =>
            previous.map((token) => (token.id === id ? data : token))
        );
    };

    // handles outside click to deselect image
    const handleItemContainerMouseDown = (
        e: React.MouseEvent<SVGSVGElement>
    ) => {
        const target = e.target as SVGSVGElement;
        if (
            isMainClick(e) &&
            isMaster &&
            !isFreeDrawing &&
            selectedImageId &&
            !target.classList.contains('sketch-image') &&
            !target.closest('.sketch-image')
        ) {
            // unselect image
            setSelectedImageId(null);
        }
    };

    // handles mouse move for moving item
    const handleMovingItemMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (movingItem && (isMaster || movingItem.movableByUser) && svgPoint) {
            const { type, id, deltaX, deltaY } = movingItem;
            const itemData = getItemData(id, type);
            // gets moving item new coordinates
            const coord = getMovingItemCoordinates({
                event: e,
                svgContainer: svgRef.current,
                svgPoint,
                itemElement: movingItem.element,
                deltaX,
                deltaY
            });
            if (coord) {
                itemHasMovedOfResized.current = true;
                const { x, y, tooltipPlacement } = coord;
                // attach new coordinates
                if (type === SketchItemType.image) {
                    setImage(id, {
                        ...(itemData as SketchImageData),
                        x,
                        y
                    });
                } else if (type === SketchItemType.token) {
                    setToken(id, {
                        ...(itemData as SketchTokenData),
                        x,
                        y,
                        tooltipPlacement:
                            tooltipPlacement ?? TooltipPlacement.bottom
                    });
                }
            }
        }
    };

    // handles mouse move for resizing item
    const handleResizingItemMouseMove = (
        e: React.MouseEvent<SVGSVGElement>
    ) => {
        if (isMaster && resizingItem && svgPoint) {
            const { type, id } = resizingItem;
            const itemData = getItemData(id, type);
            // gets new coordinates and position for resizing item
            const data = getResizingItemCoordAndPos({
                event: e,
                svgContainer: svgRef.current,
                svgPoint,
                resizingItemData: resizingItem
            });
            // set new size and position
            if (data && type === SketchItemType.image) {
                itemHasMovedOfResized.current = true;
                setImage(id, {
                    ...(itemData as SketchImageData),
                    ...data
                });
            }
        }
    };

    //  handle mouse up or leave for moving items
    const handleMovingItemMouseUpOrLeave = () => {
        if (movingItem && (isMaster || movingItem.movableByUser)) {
            if (itemHasMovedOfResized.current) {
                // updates items data in play context sketchData
                const { type, initialX: x, initialY: y } = movingItem;
                if (type === SketchItemType.image) {
                    const image = findById<SketchImageData>(
                        images,
                        movingItem.id
                    );
                    updateSketchImages({
                        images,
                        eventType: SketchEventType.imageMove,
                        image: { ...image, x, y }
                    });
                } else if (type === SketchItemType.token) {
                    const token = findById<SketchTokenData>(
                        tokens,
                        movingItem.id
                    );
                    updateMovingToken(
                        token,
                        { ...token, x, y },
                        movingItem.movableByUser
                    );
                }
            }
            // stops moving
            setMovingItem(null);
            itemHasMovedOfResized.current = false;
        }
    };

    //  handle mouse up or leave for resizing items
    const handleResizingItemMouseUpOrLeave = () => {
        // handle mouse up or leave for items
        if (isMaster && resizingItem) {
            if (itemHasMovedOfResized.current) {
                // updates items data in play context sketchData
                const {
                    type,
                    initialX: x,
                    initialY: y,
                    initialWidth: width,
                    initialHeight: height
                } = resizingItem;
                if (type === SketchItemType.image) {
                    const image = findById<SketchImageData>(
                        images,
                        resizingItem.id
                    );
                    updateSketchImages({
                        images,
                        eventType: SketchEventType.imageResize,
                        image: {
                            ...image,
                            x,
                            y,
                            width,
                            height
                        }
                    });
                }
            }
            // stops resizing
            setResizingItem(null);
            itemHasMovedOfResized.current = false;
        }
    };

    // handle mouse up or leave for items
    const handleItemMouseUpOrLeave = () => {
        handleMovingItemMouseUpOrLeave();
        handleResizingItemMouseUpOrLeave();
    };

    // handle mouseDown on items (images or tokens)
    const handleItemMouseDown = (
        e: React.MouseEvent<SVGImageElement | SVGSVGElement>,
        id: string,
        type: SketchItemType,
        movableByUser?: boolean
    ) => {
        if (isMainClick(e)) {
            if ((isMaster || movableByUser) && !isFreeDrawing && svgPoint) {
                e.preventDefault();
                const itemData = getItemData(id, type);
                // check if we clicked in the svg element
                const element = e.currentTarget.closest('svg');
                // check if we click on a context menu or context menu backdrop
                const isContextMenu =
                    (e.target as Element).id === sketchContextMenuId ||
                    !!(e.target as Element).closest(`#${sketchContextMenuId}`);
                if (element && !isContextMenu) {
                    itemHasMovedOfResized.current = false;
                    // gets item position
                    const { x: itemX, y: itemY } = itemData;
                    // get svg-transformed mouse coordinates
                    const { x, y } = getMouseEventSvgCoordinates(
                        e,
                        svgRef.current,
                        svgPoint
                    );
                    // set moving item data in state
                    // with delta to keep mouse where it was in the item when moving started
                    setMovingItem({
                        type,
                        element,
                        id,
                        deltaX: x - itemX,
                        deltaY: y - itemY,
                        initialX: itemX,
                        initialY: itemY,
                        movableByUser
                    });
                    if (type === SketchItemType.image) {
                        setSelectedImageId(id);
                    }
                }
            }
        }
    };

    // handle mouseDown on image's resize "buttons"
    const handleResizeMouseDown = (
        e: React.MouseEvent<SVGRectElement>,
        id: string,
        type: SketchItemType,
        direction: CardinalDirection
    ) => {
        if (isMainClick(e)) {
            if (isMaster && !isFreeDrawing && svgPoint) {
                const itemData = getItemData(id, type);
                const element = e.currentTarget.closest('svg');
                if (element) {
                    itemHasMovedOfResized.current = false;
                    // gets item position
                    const { x: initialX, y: initialY } = itemData;
                    // gets item size
                    const { width: initialWidth, height: initialHeight } =
                        element.getBBox();
                    // gets svg-transformed mouse coordinates
                    const { x: initialMouseX, y: initialMouseY } =
                        getMouseEventSvgCoordinates(
                            e,
                            svgRef.current,
                            svgPoint
                        );
                    // set resizing item data in state
                    setResizingItem({
                        type,
                        id,
                        element,
                        direction,
                        initialX,
                        initialY,
                        initialWidth,
                        initialHeight,
                        initialMouseX,
                        initialMouseY
                    });
                }
            }
        }
    };

    // handles deletion of an item
    const handleItemDelete = (id: string, type: SketchItemType) => {
        if (type === SketchItemType.image) {
            const imageData = findById<SketchImageData>(images, id);
            deleteSketchImage(id, imageData);
            setSelectedImageId(null);
        } else if (type === SketchItemType.token) {
            const tokenData = findById<SketchTokenData>(tokens, id);
            deleteSketchToken(id, tokenData);
        }
    };

    // handles bringing image foward
    const handleImageForward = (id: string) => {
        const currentIndex = findIndexById(images, id);
        if (images.length > 1 && currentIndex < images.length - 1) {
            const updatedImages = forwardImage(images, currentIndex);
            updateSketchImages({
                images: updatedImages,
                eventType: SketchEventType.imageForward,
                image: findById(updatedImages, id)
            });
        }
    };

    // handles sending image backward
    const handleImageBackward = (id: string) => {
        const currentIndex = findIndexById(images, id);
        if (images.length > 1 && currentIndex > 0) {
            const updatedImages = backwardImage(images, currentIndex);
            updateSketchImages({
                images: updatedImages,
                eventType: SketchEventType.imageBackward,
                image: findById(updatedImages, id)
            });
        }
    };

    // gets image height from its bounding box and set it in image data
    // used because when adding images the height is auto and we want
    // to set a fixed value
    const updateImageHeight = (id: string, element: SVGSVGElement | null) => {
        const image = findById<SketchImageData>(images, id);
        const heightAttr = element?.getAttributeNS(null, 'height');
        if (image && element && heightAttr === 'auto') {
            const { height } = element.getBBox();
            const updatedImage = { ...image, height };
            updateSketchImage(updatedImage, (events: SketchEvent[]) =>
                events.map((event) =>
                    event.type === SketchEventType.imageAdd &&
                    event.image?.id === image.id
                        ? { ...event, image: updatedImage }
                        : event
                )
            );
        }
    };

    useEffect(() => {
        // initializes svg DOMPoint in state when reference to svg container is set
        setSvgPoint(svgRef.current.createSVGPoint());
    }, [svgRef]);

    return {
        images,
        setImages,
        tokens,
        setTokens,
        movingItem,
        resizingItem,
        selectedImageId,
        setSelectedImageId,
        updateImageHeight,
        handleItemContainerMouseDown,
        handleItemMouseDown,
        handleMovingItemMouseMove,
        handleResizingItemMouseMove,
        handleItemMouseUpOrLeave,
        handleResizeMouseDown,
        handleItemDelete,
        handleImageForward,
        handleImageBackward
    };
};

export default useItems;
