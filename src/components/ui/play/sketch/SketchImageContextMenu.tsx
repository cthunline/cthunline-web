import React from 'react';
import {
    Menu,
    MenuItem,
    Divider
} from '@mui/material';

interface SketchImageProps {
    open: boolean;
    position?: {
        left: number;
        top: number;
    };
    onSelect: (action: string) => void;
    onClose?: () => void;
}

const SketchImageContextMenu: React.FC<SketchImageProps> = ({
    open,
    position,
    onSelect,
    onClose
}) => (
    <Menu
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={position}
        onClose={onClose}
    >
        <MenuItem onClick={() => onSelect('onForward')}>
            Forward
        </MenuItem>
        <MenuItem onClick={() => onSelect('onBackward')}>
            Backward
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onSelect('onDelete')}>
            Delete
        </MenuItem>
    </Menu>
);

export default SketchImageContextMenu;
