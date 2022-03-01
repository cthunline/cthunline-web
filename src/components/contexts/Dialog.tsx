import React, {
    createContext,
    useState,
    useContext,
    useCallback,
    useMemo
} from 'react';

import { CustomDialog } from '../ui';

interface DialogData {
    open: boolean;
    title: string;
    content: JSX.Element | null;
    onConfirm: (() => void) | null;
}

interface DialogOptions {
    title: string;
    content: JSX.Element;
}

interface DialogContextData {
    confirmDialog: (text: string, onConfirm: () => void) => void;
    openDialog: (options: DialogOptions) => void;
    closeDialog: () => void;
}

const defaultDialogData: DialogContextData = {
    confirmDialog: () => {},
    openDialog: () => {},
    closeDialog: () => {}
};

const DialogContext = createContext<DialogContextData>(defaultDialogData);

export const DialogProvider:React.FC = ({ children }) => {
    const [dialogOptions, setDialogOptions] = useState<DialogData>({
        open: false,
        title: '',
        content: null,
        onConfirm: null
    });

    // opens a simple confirmation dialog
    const confirmDialog = useCallback((title: string, onConfirm: () => void) => {
        setDialogOptions({
            open: true,
            title,
            content: null,
            onConfirm
        });
    }, []);

    // opens a dialog box
    // used when content is more complex than a siple confirmation dialog
    const openDialog = ({ title, content }: DialogOptions) => {
        setDialogOptions({
            open: true,
            title,
            content,
            onConfirm: null
        });
    };

    const closeDialog = () => {
        setDialogOptions((previousOptions) => ({
            ...previousOptions,
            open: false
        }));
    };

    const contextValue = useMemo(() => ({
        confirmDialog,
        openDialog,
        closeDialog
    }), [
        confirmDialog
    ]);

    return (
        <DialogContext.Provider value={contextValue}>
            {children}
            <CustomDialog
                open={dialogOptions.open}
                title={dialogOptions.title}
                content={dialogOptions.content}
                onConfirm={dialogOptions.onConfirm}
                onClose={() => {
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
