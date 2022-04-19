import React from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import { useTranslation } from '../../contexts/Translation';

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
}) => {
    const { T } = useTranslation();

    return (
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
            ) : null}
        </Dialog>
    );
};

export default CustomDialog;
