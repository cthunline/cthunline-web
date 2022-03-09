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
