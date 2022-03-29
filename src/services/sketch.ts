import {
    SketchImageData,
    SketchCoordinates,
    SketchSize,
    CardinalDirection,
    SketchResizingImageData
} from '../types';

// main svg container viewbox size
export const viewBox: SketchSize = {
    width: 1920,
    height: 1080
};

// minimum size for an image
const imageMinSize: SketchSize = {
    width: 100,
    height: 100
};

// convert path coordinate data to path d attribute string
export const coordinatesToPath = (coords: SketchCoordinates[]): string => {
    if (coords.length) {
        let path = `M ${coords[0].x} ${coords[0].y}`;
        let p1; let p2; let end;
        for (let i = 1; i < coords.length - 2; i += 2) {
            p1 = coords[i];
            p2 = coords[i + 1];
            end = coords[i + 2];
            path += ` C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
        }
        return path;
    }
    return '';
};

// gets coordinates of a mouse event transformed
export const getMouseEventSvgCoordinates = (
    e: React.MouseEvent,
    svgContainer: SVGSVGElement,
    domPoint: DOMPoint
) => {
    const point = domPoint;
    point.x = e.clientX;
    point.y = e.clientY;
    const { x, y } = point.matrixTransform(
        svgContainer.getScreenCTM()?.inverse()
    );
    return { x, y };
};

interface GetMovingItemCoordinatesOptions {
    event: React.MouseEvent<SVGSVGElement>;
    svgContainer: SVGSVGElement;
    svgPoint: DOMPoint;
    item: SVGSVGElement;
    deltaX: number;
    deltaY: number;
}

// gets new coordinates for moving item (image or token)
export const getMovingItemCoordinates = ({
    event,
    svgContainer,
    svgPoint,
    item,
    deltaX,
    deltaY
}: GetMovingItemCoordinatesOptions): SketchCoordinates | null => {
    // current size of the item
    const { width, height } = item.getBBox();
    // get svg-transformed mouse coordinates
    const { x, y } = getMouseEventSvgCoordinates(event, svgContainer, svgPoint);
    // get new item position
    // delta values are subtracted so we keep the mouse pointer
    // where it was in the item at the beginning of the movement
    const newX = x - deltaX;
    const newY = y - deltaY;
    // controls item does not move outside the svg container
    if (
        newX >= 0 && newX + width <= viewBox.width
        && newY >= 0 && newY + height <= viewBox.height
    ) {
        return { x: newX, y: newY };
    }
    return null;
};

interface GetResizingImageCoordAndPosOptions {
    event: React.MouseEvent<SVGSVGElement>;
    svgContainer: SVGSVGElement;
    svgPoint: DOMPoint;
    resizingImageData: SketchResizingImageData;
}

type GetResizingImageCoordAndPosResult = (
    SketchSize & Partial<SketchCoordinates> | null
);

// gets new coordinates and position for resizing image
export const getResizingImageCoordAndPos = ({
    event,
    svgContainer,
    svgPoint,
    resizingImageData
}: GetResizingImageCoordAndPosOptions): GetResizingImageCoordAndPosResult => {
    const {
        direction,
        initialX,
        initialY,
        initialWidth,
        initialHeight,
        initialMouseX,
        initialMouseY
    } = resizingImageData;
    // get svg-transformed mouse coordinates
    const { x, y } = getMouseEventSvgCoordinates(event, svgContainer, svgPoint);
    // difference between the current mouse position and initial mouse position
    const mouseDiffX = x - initialMouseX;
    const mouseDiffY = y - initialMouseY;
    // ratio between image width and height
    const sizeRatio = initialWidth / initialHeight;
    // if image X position should be moving while resizing (NW and SW resize buttons)
    const movingX = (
        direction === CardinalDirection.nw
        || direction === CardinalDirection.sw
    );
    // if image Y position should be moving while resizing (NW and NE resize buttons)
    const movingY = (
        direction === CardinalDirection.nw
        || direction === CardinalDirection.ne
    );
    let newWidth;
    let newHeight;
    let newX = initialX;
    let newY = initialY;
    // calculates new image size
    if (mouseDiffX > mouseDiffY) {
        newWidth = initialWidth + (mouseDiffX * (movingX ? -1 : 1));
        newHeight = newWidth / sizeRatio;
    } else {
        newHeight = initialHeight + mouseDiffY * (movingY ? -1 : 1);
        newWidth = newHeight * sizeRatio;
    }
    // calculates image movement if needed
    if (movingX) {
        newX = initialX - (newWidth - initialWidth);
    }
    if (movingY) {
        newY = initialY - (newHeight - initialHeight);
    }
    // controls if image does not move outside the svg container
    const controlPositionX = initialX + newWidth;
    const controlPositionY = initialY + newHeight;
    if (
        newWidth >= imageMinSize.width
        && newHeight >= imageMinSize.height
        && newX >= 0
        && newY >= 0
        && controlPositionX <= viewBox.width
        && controlPositionY <= viewBox.height
    ) {
        const data: GetResizingImageCoordAndPosResult = {
            width: newWidth,
            height: newHeight
        };
        if (movingX) {
            data.x = newX;
        }
        if (movingY) {
            data.y = newY;
        }
        return data;
    }
    return null;
};

// swap images in images list so the given index is increased by 1
// used to bring image forward in the sketch image stack
export const forwardImage = (images: SketchImageData[], index: number) => ([
    ...images.slice(0, index),
    images[index + 1],
    images[index],
    ...images.slice(index + 2)
]);

// swap images in images list so the given index is decreased by 1
// used to send image backward in the sketch image stack
export const backwardImage = (images: SketchImageData[], index: number) => ([
    ...images.slice(0, index - 1),
    images[index],
    images[index - 1],
    ...images.slice(index + 1)
]);
