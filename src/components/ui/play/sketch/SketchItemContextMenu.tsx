import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    Divider
} from '@mui/material';

import { usePlay } from '../../../contexts/Play';
import { SessionUser } from '../../../../types';

interface SketchItemContextMenuProps {
    open: boolean;
    position?: {
        left: number;
        top: number;
    };
    onForward?: () => void;
    onBackward?: () => void;
    onAssign?: (user: SessionUser) => void;
    onUnassign?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
}

export interface ContextMenuData {
    left: number;
    top: number;
}

const SketchItemContextMenu: React.FC<SketchItemContextMenuProps> = ({
    open,
    position,
    onForward,
    onBackward,
    onAssign,
    onUnassign,
    onDelete,
    onClose
}) => {
    const { users } = usePlay();

    const [isAssignSubMenu, setIsAssignSubMenu] = useState<boolean>(false);

    const onSelect = (handler?: Function) => {
        handler?.();
        onClose?.();
        setIsAssignSubMenu(false);
    };

    const onMenuClose = () => {
        onClose?.();
        setIsAssignSubMenu(false);
    };

    const openUserSubMenu = () => {
        setIsAssignSubMenu(true);
    };

    const closeUserSubMenu = () => {
        setIsAssignSubMenu(false);
    };

    const getMainMenuItems = () => [
        onForward ? (
            <MenuItem key="forward" onClick={() => onSelect(onForward)}>
                Forward
            </MenuItem>
        ) : null,
        onBackward ? (
            <MenuItem key="backward" onClick={() => onSelect(onBackward)}>
                Backward
            </MenuItem>
        ) : null,
        onUnassign ? (
            <MenuItem key="assign" onClick={() => onSelect(onUnassign)}>
                Unassign user
            </MenuItem>
        ) : null,
        onAssign && users ? (
            <MenuItem key="assign" onClick={openUserSubMenu}>
                Assign user
            </MenuItem>
        ) : null,
        ...(onDelete ? [
            <Divider key="divider" />,
            <MenuItem key="delete" onClick={() => onSelect(onDelete)}>
                Delete
            </MenuItem>
        ] : [])
    ];

    const getAssignSubMenuItems = () => [
        <MenuItem key="submenu-back" onClick={closeUserSubMenu}>
            Back
        </MenuItem>,
        <Divider key="submenu-divider" />,
        users.map((user) => (
            <MenuItem
                key={`submenu-${user.id}`}
                onClick={() => onSelect(
                    () => onAssign?.(user)
                )}
            >
                {user.name}
            </MenuItem>
        ))
    ];

    return (
        <Menu
            open={open}
            anchorReference="anchorPosition"
            anchorPosition={position}
            onClose={onMenuClose}
        >
            {isAssignSubMenu ? (
                getAssignSubMenuItems()
            ) : (
                getMainMenuItems()
            )}
        </Menu>
    );
};

export default SketchItemContextMenu;
