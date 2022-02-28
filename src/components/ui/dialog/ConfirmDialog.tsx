import React from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    // DialogContent,
    // DialogContentText,
    DialogActions
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    // title: string;
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    // title,
    text,
    onConfirm,
    onCancel
}) => (
    <Dialog open={open} onClose={onCancel}>
        <DialogTitle>
            {text}
        </DialogTitle>
        {/* <DialogContent>
            <DialogContentText>
                {text}
            </DialogContentText>
        </DialogContent> */}
        <DialogActions>
            <Button onClick={onCancel}>
                Cancel
            </Button>
            <Button onClick={onConfirm}>
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
