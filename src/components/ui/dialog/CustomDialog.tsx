import React from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import './CustomDialog.css';

interface CustomDialogProps {
    open: boolean;
    title: string;
    content: JSX.Element | null;
    onConfirm: (() => void) | null;
    onClose: () => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
    open,
    title,
    content,
    onConfirm,
    onClose
}) => (
    <Dialog
        PaperProps={{
            className: 'custom-dialog'
        }}
        open={open}
        onClose={onClose}
    >
        <DialogTitle>
            {title}
        </DialogTitle>
        {content ? (
            <DialogContent>
                {content}
            </DialogContent>
        ) : null}
        {onConfirm ? (
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        ) : null}
    </Dialog>
);

export default CustomDialog;
