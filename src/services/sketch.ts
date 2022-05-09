import {
    Color,
    colors,
    SketchImageData,
    SketchCoordinates,
    SketchSize,
    CardinalDirection,
    SketchResizingItemData,
    SketchTokenData,
    TooltipPlacement
} from '../types';
import { randomItem } from './tools';

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
    itemElement: SVGSVGElement;
    deltaX: number;
    deltaY: number;
}

// gets new coordinates for moving item (image or token)
export const getMovingItemCoordinates = ({
    event,
    svgContainer,
    svgPoint,
    itemElement,
    deltaX,
    deltaY
}: GetMovingItemCoordinatesOptions): SketchCoordinates | null => {
    // current size of the item
    const { width, height } = itemElement.getBBox();
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
        // calculate tooltip placement
        const tooltipPlacement = newY > (viewBox.height / 2)
            ? TooltipPlacement.top
            : TooltipPlacement.bottom;
        // return coordinates data
        return {
            x: newX,
            y: newY,
            tooltipPlacement
        };
    }
    return null;
};

interface GetResizingItemCoordAndPosOptions {
    event: React.MouseEvent<SVGSVGElement>;
    svgContainer: SVGSVGElement;
    svgPoint: DOMPoint;
    resizingItemData: SketchResizingItemData;
}

type GetResizingItemCoordAndPosResult = (
    SketchSize & Partial<SketchCoordinates> | null
);

// gets new coordinates and position for resizing item
export const getResizingItemCoordAndPos = ({
    event,
    svgContainer,
    svgPoint,
    resizingItemData
}: GetResizingItemCoordAndPosOptions): GetResizingItemCoordAndPosResult => {
    const {
        direction,
        initialX,
        initialY,
        initialWidth,
        initialHeight,
        initialMouseX,
        initialMouseY
    } = resizingItemData;
    // get svg-transformed mouse coordinates
    const { x, y } = getMouseEventSvgCoordinates(event, svgContainer, svgPoint);
    // difference between the current mouse position and initial mouse position
    const mouseDiffX = x - initialMouseX;
    const mouseDiffY = y - initialMouseY;
    // ratio between item width and height
    const sizeRatio = initialWidth / initialHeight;
    // if item X position should be moving while resizing (NW and SW resize buttons)
    const movingX = (
        direction === CardinalDirection.nw
        || direction === CardinalDirection.sw
    );
    // if item Y position should be moving while resizing (NW and NE resize buttons)
    const movingY = (
        direction === CardinalDirection.nw
        || direction === CardinalDirection.ne
    );
    let newWidth;
    let newHeight;
    let newX = initialX;
    let newY = initialY;
    // calculates new item size
    if (mouseDiffX > mouseDiffY) {
        newWidth = initialWidth + mouseDiffX * (movingX ? -1 : 1);
        newHeight = newWidth / sizeRatio;
    } else {
        newHeight = initialHeight + mouseDiffY * (movingY ? -1 : 1);
        newWidth = newHeight * sizeRatio;
    }
    // calculates item movement if needed
    if (movingX) {
        newX = initialX - (newWidth - initialWidth);
    }
    if (movingY) {
        newY = initialY - (newHeight - initialHeight);
    }
    // controls if item does not move outside the svg container
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
        const data: GetResizingItemCoordAndPosResult = {
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
export const forwardImage = (images: SketchImageData[], index: number) => (
    [
        ...images.slice(0, index),
        images[index + 1],
        images[index],
        ...images.slice(index + 2)
    ].map((image, idx) => ({
        ...image,
        index: idx
    }))
);

// swap images in images list so the given index is decreased by 1
// used to send image backward in the sketch image stack
export const backwardImage = (images: SketchImageData[], index: number) => (
    [
        ...images.slice(0, index - 1),
        images[index],
        images[index - 1],
        ...images.slice(index + 1)
    ].map((image, idx) => ({
        ...image,
        index: idx
    }))
);

type SketchColorUses = Record<Color, number>;
// pick a color for a new token based on colors already used
export const getNewTokenColor = (currentTokens: SketchTokenData[]): Color => {
    const colorUses = Object.fromEntries(
        colors.map((color) => [color, 0])
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
    const pickedColor: Color = (
        randomItem(Object.keys(filteredColors))
        ?? randomItem(colors as unknown as any[])
    );
    return pickedColor;
};
