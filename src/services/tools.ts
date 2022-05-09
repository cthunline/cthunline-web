import { customAlphabet } from 'nanoid';

// generate new random id
export const generateId = customAlphabet('1234567890abcdef', 16);

// find an object in an array of objects based on the id of object
// throws an error if object is not found
export const findById = <ObjectType extends { id: string }>(
    list: ObjectType[],
    id: string
): ObjectType => {
    const object = list.find(({ id: objectId }) => (
        id === objectId
    ));
    if (object) {
        return object;
    }
    throw new Error('Could not find object by Id');
};

export const findIndexById = (list: any[], id: string): number => {
    const index = list.findIndex(({ id: objectId }) => (
        id === objectId
    ));
    if (index >= 0) {
        return index;
    }
    throw new Error('Could not find object index by Id');
};

// remove anything but numbers in a string
export const onlyNumbers = (text: string) => (
    text.replaceAll(/[^\d]*/g, '')
);

// uppercase the first char of a string
export const ucfirst = (text: string) => (
    `${text.charAt(0).toUpperCase()}${text.slice(1)}`
);

// convert input file content to base64
export const getInputFileBase64 = async (file: File): Promise<string> => (
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(String(reader.result));
        };
        reader.onerror = (err) => {
            reject(err);
        };
    })
);

// same as nodejs Path.join
export const pathJoin = (...parts: string[]) => (
    parts.map((part, index) => {
        if (index) {
            return part.replace(/^\//, '');
        }
        if (index !== parts.length - 1) {
            return part.replace(/\/$/, '');
        }
        return part;
    }).join('/')
);

// check if event click match the given key
type MixedEvent = React.MouseEvent | MouseEvent | TouchEvent;
export const isClickType = (e: MixedEvent, code: number) => {
    const eMouse = e as React.MouseEvent;
    return typeof eMouse.button === 'number' && eMouse.button === code;
};

// check if event click is primary click
export const isMainClick = (e: React.MouseEvent | MouseEvent | TouchEvent) => (
    isClickType(e, 0)
);

// check if event click is secondary click
export const isSecondaryClick = (e: React.MouseEvent | MouseEvent | TouchEvent) => (
    isClickType(e, 2)
);

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

// get css variable value
const computedStyle = window.getComputedStyle(document.body);
export const getCssVar = (name: string) => (
    computedStyle.getPropertyValue(name)
);

// get text color (white or black) depending on background color
export const getTextColor = (hexColor: string): 'white' | 'black' => {
    const threshold = 130;
    const cutHex = (h: string) => h.replace(/^#/, '');
    const hRed = parseInt(cutHex(hexColor).substring(0, 2), 16);
    const hGreen = parseInt(cutHex(hexColor).substring(2, 4), 16);
    const hBlue = parseInt(cutHex(hexColor).substring(4, 6), 16);
    const brightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    return brightness > threshold ? 'black' : 'white';
};
