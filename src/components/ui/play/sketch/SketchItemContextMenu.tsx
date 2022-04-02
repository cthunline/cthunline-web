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

    const playerUsers = users.filter(({ isMaster }) => !isMaster);

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

    const getMainMenuItems = () => {
        const items = [];
        if (onForward) {
            items.push(
                <MenuItem key="forward" onClick={() => onSelect(onForward)}>
                    Forward
                </MenuItem>
            );
        }
        if (onBackward) {
            items.push(
                <MenuItem key="backward" onClick={() => onSelect(onBackward)}>
                    Backward
                </MenuItem>
            );
        }
        if (onUnassign) {
            items.push(
                <MenuItem key="assign" onClick={() => onSelect(onUnassign)}>
                    Unassign user
                </MenuItem>
            );
        }
        if (onAssign && playerUsers.length) {
            items.push(
                <MenuItem key="assign" onClick={openUserSubMenu}>
                    Assign user
                </MenuItem>
            );
        }
        if (onDelete) {
            if (items.length) {
                items.push(<Divider key="divider" />);
            }
            items.push(
                <MenuItem key="delete" onClick={() => onSelect(onDelete)}>
                    Delete
                </MenuItem>
            );
        }
        return items;
    };

    const getAssignSubMenuItems = () => [
        <MenuItem key="submenu-back" onClick={closeUserSubMenu}>
            Back
        </MenuItem>,
        <Divider key="submenu-divider" />,
        playerUsers.map((user) => [
            <MenuItem
                key={`submenu-${user.id}`}
                onClick={() => onSelect(
                    () => onAssign?.(user)
                )}
            >
                {user.name}
            </MenuItem>
        ])
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
