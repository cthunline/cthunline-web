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
    title: string;
    content: JSX.Element | null;
    onConfirm: (() => void) | null;
    onClose: () => void;
}

const CustomDialog = ({
    open,
    title,
    content,
    onConfirm,
    onClose
}: CustomDialogProps) => {
    const { T } = useApp();

    return (
        <Dialog
            PaperProps={{
                className: 'custom-dialog'
            }}
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            {content ? <DialogContent>{content}</DialogContent> : null}
            {onConfirm ? (
                <DialogActions>
                    <Button onClick={onClose}>{T('action.cancel')}</Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {T('action.confirm')}
                    </Button>
                </DialogActions>
            ) : null}
        </Dialog>
    );
};

export default CustomDialog;
