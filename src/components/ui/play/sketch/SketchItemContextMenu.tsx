import React, { useState } from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';

import { useApp } from '../../../contexts/App';
import { usePlay } from '../../../contexts/Play';
import ColorSelector from '../../colorSelector/ColorSelector';
import { SessionUser, Color } from '../../../../types';

interface SketchItemContextMenuProps {
    open: boolean;
    position?: {
        left: number;
        top: number;
    };
    onForward?: () => void;
    onBackward?: () => void;
    onAttach?: (user: SessionUser) => void;
    onUnattach?: () => void;
    onDuplicate?: () => void;
    onColorChange?: (color: Color) => void;
    onDelete?: () => void;
    onClose?: () => void;
}

export interface ContextMenuData {
    left: number;
    top: number;
}

enum SubMenuType {
    attach = 'asssign',
    color = 'color'
}

const SketchItemContextMenu: React.FC<SketchItemContextMenuProps> = ({
    open,
    position,
    onForward,
    onBackward,
    onAttach,
    onUnattach,
    onDuplicate,
    onColorChange,
    onDelete,
    onClose
}) => {
    const { T } = useApp();
    const { users } = usePlay();

    const [subMenu, setSubMenu] = useState<SubMenuType | null>(null);

    const playerUsers = users.filter(({ isMaster }) => !isMaster);

    const onSelect = (handler?: Function) => {
        handler?.();
        onClose?.();
        setSubMenu(null);
    };

    const onMenuClose = () => {
        onClose?.();
        setSubMenu(null);
    };

    const openUserSubMenu = () => setSubMenu(SubMenuType.attach);
    const closeUserSubMenu = () => setSubMenu(null);

    const openColorSubMenu = () => setSubMenu(SubMenuType.color);
    const closeColorSubMenu = () => setSubMenu(null);

    const getMainMenuItems = () => {
        const items = [];
        if (onForward) {
            items.push(
                <MenuItem key="forward" onClick={() => onSelect(onForward)}>
                    {T('page.play.sketch.forward')}
                </MenuItem>
            );
        }
        if (onBackward) {
            items.push(
                <MenuItem key="backward" onClick={() => onSelect(onBackward)}>
                    {T('page.play.sketch.backward')}
                </MenuItem>
            );
        }
        if (onAttach && playerUsers.length) {
            items.push(
                <MenuItem key="attach" onClick={openUserSubMenu}>
                    {T('page.play.sketch.attachCharacter')}
                </MenuItem>
            );
        }
        if (onUnattach) {
            items.push(
                <MenuItem key="unattach" onClick={() => onSelect(onUnattach)}>
                    {T('page.play.sketch.unattachCharacter')}
                </MenuItem>
            );
        }
        if (onDuplicate) {
            items.push(
                <MenuItem key="duplicate" onClick={() => onSelect(onDuplicate)}>
                    {T('page.play.sketch.duplicate')}
                </MenuItem>
            );
        }
        if (onColorChange) {
            items.push(
                <MenuItem key="colorChange" onClick={openColorSubMenu}>
                    {T('page.play.sketch.changeColor')}
                </MenuItem>
            );
        }
        if (onDelete) {
            if (items.length) {
                items.push(<Divider key="divider" />);
            }
            items.push(
                <MenuItem key="delete" onClick={() => onSelect(onDelete)}>
                    {T('page.play.sketch.delete')}
                </MenuItem>
            );
        }
        return items;
    };

    const getAttachSubMenuItems = () => [
        <MenuItem key="submenu-back" onClick={closeUserSubMenu}>
            {T('action.back')}
        </MenuItem>,
        <Divider key="submenu-divider" />,
        playerUsers.map((user) => [
            <MenuItem
                key={`submenu-${user.id}`}
                onClick={() => onSelect(() => onAttach?.(user))}
            >
                {`${user.character.name} (${user.name})`}
            </MenuItem>
        ])
    ];

    const getColorSubMenuItems = () => [
        <MenuItem key="submenu-back" onClick={closeColorSubMenu}>
            {T('action.back')}
        </MenuItem>,
        <Divider key="submenu-divider" />,
        <ColorSelector
            key="submenu-color-selector"
            onChange={(color: Color) => onSelect(() => onColorChange?.(color))}
        />
    ];

    const getMenuContent = () => {
        if (subMenu === SubMenuType.attach) {
            return getAttachSubMenuItems();
        }
        if (subMenu === SubMenuType.color) {
            return getColorSubMenuItems();
        }
        return getMainMenuItems();
    };

    return (
        <Menu
            className="context-menu"
            open={open}
            anchorReference="anchorPosition"
            anchorPosition={position}
            onClose={onMenuClose}
        >
            {getMenuContent()}
        </Menu>
    );
};

export default SketchItemContextMenu;
