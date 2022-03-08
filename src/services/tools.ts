export const onlyNumbers = (text: string) => (
    text.replaceAll(/[^\d]*/g, '')
);

export const ucfirst = (text: string) => (
    `${text.charAt(0).toUpperCase()}${text.slice(1)}`
);
