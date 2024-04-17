import { customAlphabet } from 'nanoid';

// generate new random id
export const generateId = customAlphabet('1234567890abcdef', 16);

// find an object in an array of objects based on the id of object
// throws an error if object is not found
export const findById = <ObjectType extends { id: string }>(
    list: ObjectType[],
    id: string
): ObjectType => {
    const object = list.find(({ id: objectId }) => id === objectId);
    if (object) {
        return object;
    }
    throw new Error('Could not find object by Id');
};

export const findIndexById = (list: any[], id: string): number => {
    const index = list.findIndex(({ id: objectId }) => id === objectId);
    if (index >= 0) {
        return index;
    }
    throw new Error('Could not find object index by Id');
};

// remove anything but numbers in a string
export const onlyNumbers = (text: string) => text.replaceAll(/[^\d]*/g, '');

// uppercase the first char of a string
export const ucfirst = (text: string) =>
    `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

// same as nodejs Path.join
export const pathJoin = (...parts: string[]) =>
    parts
        .map((part, index) => {
            if (index) {
                return part.replace(/^\//, '');
            }
            if (index !== parts.length - 1) {
                return part.replace(/\/$/, '');
            }
            return part;
        })
        .join('/');

// check if event click match the given key
type MixedEvent = React.MouseEvent | MouseEvent | TouchEvent;
export const isClickType = (e: MixedEvent, code: number) => {
    const eMouse = e as React.MouseEvent;
    return typeof eMouse.button === 'number' && eMouse.button === code;
};

// check if event click is primary click
export const isMainClick = (e: React.MouseEvent | MouseEvent | TouchEvent) =>
    isClickType(e, 0);

// check if event click is secondary click
export const isSecondaryClick = (
    e: React.MouseEvent | MouseEvent | TouchEvent
) => isClickType(e, 2);

// get random number between min and max
export const randomNumber = (min: number, max: number) => {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const random = randomBuffer[0] / (0xffffffff + 1);
    return Math.floor(random * (max - min + 1)) + min;
};

// pick random item from array
export const randomItem = (array: any[]): any => {
    if (!array.length) {
        return null;
    }
    const randomIndex = randomNumber(0, array.length - 1);
    return array[randomIndex];
};

// shuffle an array (randomize items order)
export const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], array[i]];
    }
    return shuffled;
};

// get css variable value
const computedStyle = window.getComputedStyle(document.body);
export const getCssVar = (name: string) => computedStyle.getPropertyValue(name);

// force hex color on 6 characters
export const forceFullHexColor = (hexColor: string) =>
    hexColor.replaceAll(
        /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])$/g,
        '#$1$1$2$2$3$3'
    );

// get text color (white or black) depending on background color
export const getTextColor = (hexColor: string): 'white' | 'black' => {
    const threshold = 130;
    const cutHex = (h: string) => h.replace(/^#/, '');
    const fullHexColor = forceFullHexColor(hexColor);
    const hRed = parseInt(cutHex(fullHexColor).substring(0, 2), 16);
    const hGreen = parseInt(cutHex(fullHexColor).substring(2, 4), 16);
    const hBlue = parseInt(cutHex(fullHexColor).substring(4, 6), 16);
    const brightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    return brightness > threshold ? 'black' : 'white';
};

// check if a variable is an object
export const isObject = (val: any): val is Record<string, any> =>
    val !== null && typeof val === 'object' && !Array.isArray(val);

// deep equality check
export const deepEqual = (val1: any, val2: any): boolean => {
    if (val1 === val2) {
        return true;
    }
    if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) {
            return false;
        }
        for (let i = 0; i < val1.length; i += 1) {
            if (!deepEqual(val1[i], val2[i])) {
                return false;
            }
        }
        return true;
    }
    if (isObject(val1) && isObject(val2)) {
        const val1Keys = Object.keys(val1);
        const val2Keys = Object.keys(val2);
        if (val1Keys.length !== val2Keys.length) {
            return false;
        }
        for (let i = 0; i < val1Keys.length; i += 1) {
            const key = val1Keys[i];
            if (!val2Keys.includes(key) || !deepEqual(val1[key], val2[key])) {
                return false;
            }
        }
        return true;
    }
    return false;
};

/**
Sorts an array of objets by object property.
*/
export const sortObjectsBy = <T>(objects: T[], property: keyof T) => {
    objects.sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];
        const properAVal =
            typeof aVal === 'string' ? aVal.toLocaleLowerCase() : aVal;
        const properBVal =
            typeof bVal === 'string' ? bVal.toLocaleLowerCase() : bVal;
        if (properAVal < properBVal) {
            return -1;
        }
        if (properAVal > properBVal) {
            return 1;
        }
        return 0;
    });
};

/**
Moves an array item from an index to another index.
*/
export const arrayMove = <T extends any>(
    array: T[],
    fromIndex: number,
    toIndex: number
) => {
    const newArray = [...array];
    const startIndex = fromIndex < 0 ? newArray.length + fromIndex : fromIndex;
    if (startIndex >= 0 && startIndex < newArray.length) {
        const endIndex = toIndex < 0 ? newArray.length + toIndex : toIndex;
        const [item] = newArray.splice(fromIndex, 1);
        newArray.splice(endIndex, 0, item);
    }
    return newArray;
};

export type MoveAction = 'up' | 'down';

/**
Moves an array item up or down. Moving an item 'up' means decreasing 
its index, moving an item 'down' means increasing its index. If the
move is invalid then returns false.
*/
export const arrayMoveUpDown = <T extends any>(
    array: T[],
    index: number,
    action: MoveAction
): T[] | false => {
    const { length } = array;
    const newIndex = action === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < length) {
        return arrayMove(array, index, newIndex);
    }
    return false;
};
