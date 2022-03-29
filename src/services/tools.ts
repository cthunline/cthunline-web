export const onlyNumbers = (text: string) => (
    text.replaceAll(/[^\d]*/g, '')
);

export const ucfirst = (text: string) => (
    `${text.charAt(0).toUpperCase()}${text.slice(1)}`
);

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

const computedStyle = window.getComputedStyle(document.body);
export const getCssVar = (name: string) => (
    computedStyle.getPropertyValue(name)
);

export const isClickType = (e: React.MouseEvent | MouseEvent | TouchEvent, code: number) => {
    const eMouse = e as React.MouseEvent;
    return typeof eMouse.button === 'number' && eMouse.button === code;
};

export const isMainClick = (e: React.MouseEvent | MouseEvent | TouchEvent) => (
    isClickType(e, 0)
);

export const isSecondaryClick = (e: React.MouseEvent | MouseEvent | TouchEvent) => (
    isClickType(e, 2)
);
