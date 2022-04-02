import {
    useState,
    useEffect,
    useRef
} from 'react';

import { usePlay } from '../../contexts/Play';
import {
    SketchImageData,
    SketchMovingItemData,
    SketchResizingItemData,
    CardinalDirection,
    SketchEventType,
    SketchTokenData,
    SketchItemType
} from '../../../types';
import {
    getMouseEventSvgCoordinates,
    getMovingItemCoordinates,
    getResizingItemCoordAndPos,
    forwardImage,
    backwardImage
} from '../../../services/sketch';
import { isMainClick } from '../../../services/tools';

const useItems = (
    svgRef: React.MutableRefObject<SVGSVGElement>,
    isMaster: boolean = false
) => {
    const {
        isFreeDrawing,
        updateSketchImage,
        updateSketchImages,
        deleteSketchImage,
        updateSketchTokens,
        deleteSketchToken
    } = usePlay();

    // list of images in the sketch
    const [images, setImages] = useState<SketchImageData[]>([]);
    // list of tokens in the sketch
    const [tokens, setTokens] = useState<SketchTokenData[]>([]);
    // current selected image index
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    // data of item (image or token) currently being moved
    // (index property is reffering to the imagesRef array below)
    const [movingItem, setMovingItem] = useState<SketchMovingItemData | null>(null);
    // data of item (image or token) currently being resized
    const [resizingItem, setResizingItem] = useState<SketchResizingItemData | null>(null);
    // DOMPoint used to calculate transformed coordinates the the svg viewbox
    const [svgPoint, setSvgPoint] = useState<DOMPoint>();

    // ref boolean to check if an item has been moved or reisized
    // it is used so items are not uselessly updated if we
    // mouseDown on an item without moving or resizing it
    const itemHasMovedOfResized = useRef<boolean>(false);

    // gets item data from index and item type
    const getItemData = (index: number, type: SketchItemType) => {
        switch (type) {
            case SketchItemType.image:
                return images[index];
            case SketchItemType.token:
                return tokens[index];
            default:
                return null;
        }
    };

    // helper to set an image in the images state array
    const setImage = (index: number, data: SketchImageData) => {
        setImages((previous) => (
            previous.map((img, idx) => (
                idx === index ? data : img
            ))
        ));
    };

    // helper to set a token in the tokens state array
    const setToken = (index: number, data: SketchTokenData) => {
        setTokens((previous) => (
            previous.map((tok, idx) => (
                idx === index ? data : tok
            ))
        ));
    };

    // handles outside click to deselect image
    const handleItemContainerMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        const target = e.target as SVGSVGElement;
        if (
            isMainClick(e)
            && isMaster
            && !isFreeDrawing
            && selectedImageIndex !== null
            && !target.classList.contains('sketch-image')
            && !target.closest('.sketch-image')
        ) {
            // unselect image
            setSelectedImageIndex(null);
        }
    };

    // handles mouse move for moving item
    const handleMovingItemMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (movingItem && (isMaster || movingItem.userAllowed) && svgPoint) {
            const {
                type,
                index,
                deltaX,
                deltaY
            } = movingItem;
            const itemData = getItemData(index, type);
            if (itemData) {
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
                    // assign new coordinates
                    switch (type) {
                        case SketchItemType.image:
                            setImage(index, {
                                ...(itemData as SketchImageData),
                                ...coord
                            });
                            break;
                        case SketchItemType.token:
                            setToken(index, {
                                ...(itemData as SketchTokenData),
                                ...coord
                            });
                            break;
                        default:
                    }
                }
            }
        }
    };

    // handles mouse move for resizing item
    const handleResizingItemMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isMaster && resizingItem && svgPoint) {
            const { type, index } = resizingItem;
            const itemData = getItemData(index, type);
            if (itemData) {
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
                    setImage(index, {
                        ...(itemData as SketchImageData),
                        ...data
                    });
                }
            }
        }
    };

    //  handle mouse up or leave for moving items
    const handleMovingItemMouseUpOrLeave = () => {
        if (movingItem && (isMaster || movingItem.userAllowed)) {
            if (itemHasMovedOfResized.current) {
                // updates items data in play context sketchData
                const { type, initialX: x, initialY: y } = movingItem;
                if (type === SketchItemType.image) {
                    updateSketchImages(
                        images,
                        SketchEventType.imageMove,
                        movingItem.index,
                        { ...images[movingItem.index], x, y }
                    );
                } else if (type === SketchItemType.token) {
                    updateSketchTokens(
                        tokens,
                        SketchEventType.tokenMove,
                        movingItem.index,
                        { ...tokens[movingItem.index], x, y },
                        movingItem.userAllowed
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
                    updateSketchImages(
                        images,
                        SketchEventType.imageResize,
                        resizingItem.index,
                        {
                            ...images[resizingItem.index],
                            x,
                            y,
                            width,
                            height
                        }
                    );
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
        index: number,
        type: SketchItemType,
        userAllowed?: boolean
    ) => {
        if (isMainClick(e)) {
            if ((isMaster || userAllowed) && !isFreeDrawing && svgPoint) {
                e.preventDefault();
                const element = e.currentTarget.closest('svg');
                const itemData = getItemData(index, type);
                if (itemData && element) {
                    itemHasMovedOfResized.current = false;
                    // gets item position
                    const { x: itemX, y: itemY } = itemData;
                    // get svg-transformed mouse coordinates
                    const { x, y } = getMouseEventSvgCoordinates(e, svgRef.current, svgPoint);
                    // set moving item data in state
                    // with delta to keep mouse where it was in the item when moving started
                    setMovingItem({
                        type,
                        element,
                        index,
                        deltaX: x - itemX,
                        deltaY: y - itemY,
                        initialX: itemX,
                        initialY: itemY,
                        userAllowed
                    });
                    if (type === SketchItemType.image) {
                        setSelectedImageIndex(index);
                    }
                }
            }
        }
    };

    // handle mouseDown on image's resize "buttons"
    const handleResizeMouseDown = (
        e: React.MouseEvent<SVGRectElement>,
        index: number,
        type: SketchItemType,
        direction: CardinalDirection
    ) => {
        if (isMainClick(e)) {
            if (isMaster && !isFreeDrawing && svgPoint) {
                const element = e.currentTarget.closest('svg');
                const itemData = getItemData(index, type);
                if (itemData && element) {
                    itemHasMovedOfResized.current = false;
                    // gets item position
                    const { x: initialX, y: initialY } = itemData;
                    // gets item size
                    const {
                        width: initialWidth,
                        height: initialHeight
                    } = element.getBBox();
                    // gets svg-transformed mouse coordinates
                    const {
                        x: initialMouseX,
                        y: initialMouseY
                    } = getMouseEventSvgCoordinates(e, svgRef.current, svgPoint);
                    // set resizing item data in state
                    setResizingItem({
                        type,
                        index,
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
    const handleItemDelete = (index: number, type: SketchItemType) => {
        if (type === SketchItemType.image) {
            const imageData = images[index];
            deleteSketchImage(index, imageData);
            setSelectedImageIndex(null);
        }
        if (type === SketchItemType.token) {
            const tokenData = tokens[index];
            deleteSketchToken(index, tokenData);
        }
    };

    // handles bringing image foward
    const handleImageForward = (index: number) => {
        if (images.length > 1 && index < images.length - 1) {
            updateSketchImages(
                forwardImage(images, index),
                SketchEventType.imageForward,
                index + 1
            );
        }
    };

    // handles sending image backward
    const handleImageBackward = (index: number) => {
        if (images.length > 1 && index > 0) {
            updateSketchImages(
                backwardImage(images, index),
                SketchEventType.imageBackward,
                index - 1
            );
        }
    };

    // gets image height from its bounding box and set it in image data
    // used because when adding images the height is auto and we want
    // to set a fixed value
    const updateImageHeight = (index: number, element: SVGSVGElement | null) => {
        const imageData = images[index];
        const heightAttr = element?.getAttributeNS(null, 'height');
        if (imageData && element && heightAttr === 'auto') {
            const { height } = element.getBBox();
            updateSketchImage(index, {
                ...imageData,
                height
            });
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
        selectedImageIndex,
        setSelectedImageIndex,
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
