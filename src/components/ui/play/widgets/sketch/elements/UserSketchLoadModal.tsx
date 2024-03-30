import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemSecondaryAction
} from '@mui/material';

import CustomDialog from '../../../../dialog/CustomDialog';
import { useDialog } from '../../../../../contexts/Dialog';
import { type Sketch } from '../../../../../../types';
import { useApp } from '../../../../../contexts/App';

interface UserSketchSelectorProps {
    open: boolean;
    userSketchs: Sketch[];
    onLoad: (sketchId: number) => void;
    onDelete: (sketchId: number) => void;
    onClose: () => void;
}

const UserSketchLoadModal = ({
    open,
    userSketchs,
    onLoad,
    onDelete,
    onClose
}: UserSketchSelectorProps) => {
    const { dialogPortalRef } = useDialog();
    const { T } = useApp();

    const [deleteSketchId, setDeleteSketchId] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            setDeleteSketchId(null);
        }
    }, [open]);

    if (!dialogPortalRef.current) {
        return null;
    }

    if (deleteSketchId) {
        return createPortal(
            <CustomDialog
                open={open}
                title={T('widget.sketch.deleteSketchConfirm')}
                onConfirm={() => {
                    onDelete(deleteSketchId);
                    setDeleteSketchId(null);
                }}
                onClose={() => setDeleteSketchId(null)}
            />,
            dialogPortalRef.current
        );
    }

    return createPortal(
        <CustomDialog
            open={open}
            onClose={onClose}
            title={T('widget.sketch.loadSketch')}
            content={
                <List>
                    {userSketchs.map(({ id, name }) => (
                        <ListItem
                            key={`user-sketch-${id}`}
                            secondaryAction={
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        size="medium"
                                        color="error"
                                        onClick={() => setDeleteSketchId(id)}
                                    >
                                        <MdOutlineDeleteOutline />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={() => onLoad(id)}>
                                {name}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            }
        />,
        dialogPortalRef.current
    );
};

export default UserSketchLoadModal;
