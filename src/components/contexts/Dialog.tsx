import React, {
    createContext,
    useState,
    useContext,
    useCallback
} from 'react';

import { ConfirmDialog } from '../ui';

interface ConfirmDialogData {
    open: boolean;
    text: string;
    onConfirm: () => void;
}

const DialogContext = createContext(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (text: string, onConfirm: () => void) => {}
);

export const DialogProvider:React.FC = ({ children }) => {
    const [dialogOptions, setDialogOptions] = useState<ConfirmDialogData>({
        open: false,
        text: '',
        onConfirm: () => {}
    });

    const openDialog = useCallback((text: string, onConfirm: () => void) => {
        setDialogOptions({
            open: true,
            text,
            onConfirm
        });
    }, []);

    const closeDialog = () => {
        setDialogOptions((previousOptions) => ({
            ...previousOptions,
            open: false
        }));
    };

    return (
        <DialogContext.Provider value={openDialog}>
            {children}
            <ConfirmDialog
                open={dialogOptions.open}
                text={dialogOptions.text}
                onConfirm={() => {
                    closeDialog();
                    dialogOptions.onConfirm();
                }}
                onCancel={() => {
                    closeDialog();
                }}
            />
        </DialogContext.Provider>
    );
};

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within an DialogProvider');
    }
    return context;
}
