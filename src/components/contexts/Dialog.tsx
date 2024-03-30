import { Box } from '@mui/material';
import {
    createContext,
    useState,
    useContext,
    useCallback,
    useMemo,
    useRef,
    createRef
} from 'react';

// do not import from ui index to avoid circular dependency
import CustomDialog from '../ui/dialog/CustomDialog';

interface DialogProviderProps {
    children: JSX.Element | JSX.Element[];
}

interface DialogData {
    open: boolean;
    title?: string;
    content?: React.ReactNode;
    onConfirm?: () => void;
}

interface DialogOptions {
    title?: string;
    content?: React.ReactNode;
}

interface DialogContextData {
    confirmDialog: (text: string, onConfirm: () => void) => void;
    openDialog: (options: DialogOptions) => void;
    closeDialog: () => void;
    dialogPortalRef: React.RefObject<HTMLDivElement>;
}

const defaultDialogData: DialogContextData = {
    confirmDialog: () => {
        /* default */
    },
    openDialog: () => {
        /* default */
    },
    closeDialog: () => {
        /* default */
    },
    dialogPortalRef: createRef()
};

const DialogContext = createContext<DialogContextData>(defaultDialogData);

export const DialogProvider = ({ children }: DialogProviderProps) => {
    const [dialogOptions, setDialogOptions] = useState<DialogData>({
        open: false
    });

    const dialogPortalRef = useRef<HTMLDivElement>(null);

    // opens a simple confirmation dialog
    const confirmDialog = useCallback(
        (title: string, onConfirm: () => void) => {
            setDialogOptions({
                open: true,
                title,
                onConfirm
            });
        },
        []
    );

    // opens a dialog box
    // used when content is more complex than a siple confirmation dialog
    const openDialog = ({ title, content }: DialogOptions) => {
        setDialogOptions({
            open: true,
            title,
            content
        });
    };

    const closeDialog = () => {
        setDialogOptions((previousOptions) => ({
            ...previousOptions,
            open: false
        }));
    };

    const contextValue = useMemo(
        () => ({
            confirmDialog,
            openDialog,
            closeDialog,
            dialogPortalRef
        }),
        [confirmDialog]
    );

    return (
        <DialogContext.Provider value={contextValue}>
            {children}
            <Box id="dialog-portal" ref={dialogPortalRef} />
            <CustomDialog
                open={dialogOptions.open}
                title={dialogOptions.title}
                content={dialogOptions.content}
                onConfirm={dialogOptions.onConfirm}
                onClose={() => closeDialog()}
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
