import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import { useApp } from '../../contexts/App';

import './CustomDialog.css';

interface CustomDialogProps {
    open: boolean;
    title?: string;
    content?: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose: () => void;
}

const CustomDialog = ({
    open,
    title,
    content,
    onConfirm,
    onCancel,
    onClose
}: CustomDialogProps) => {
    const { T } = useApp();
    return (
        <Dialog
            transitionDuration={0}
            PaperProps={{
                className: 'custom-dialog'
            }}
            open={open}
            onClose={onClose}
        >
            {!!title && <DialogTitle>{title}</DialogTitle>}
            {!!content && <DialogContent>{content}</DialogContent>}
            {!!onConfirm && (
                <DialogActions>
                    <Button onClick={onCancel ?? onClose}>
                        {T('action.cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {T('action.confirm')}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default CustomDialog;
