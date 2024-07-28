import { useMantineColorScheme } from '@mantine/core';
import {
    ControlledMenu,
    MenuDivider,
    MenuItem,
    SubMenu
} from '@szhsin/react-menu';
import { useEffect, useRef, useState } from 'react';

import { useApp } from '../../../../contexts/App.js';
import { usePlay } from '../../../../contexts/Play.js';
import type { Color, SessionUser } from '../../../../types/index.js';
import ColorPicker from '../../../common/ColorPicker.js';
import FontSizePicker from '../../../common/FontSizePicker.js';
import TextInput from '../../../common/TextInput.js';
import WidthPicker from '../../../common/WidthPicker.js';

export interface ContextMenuPosition {
    x: number;
    y: number;
}

export const sketchContextMenuId = 'sketch-item-context-menu';

export const contextMenuHandler =
    <E extends Element>(
        handler: (pos: ContextMenuPosition) => void,
        onClose: () => void
    ) =>
    (e: React.MouseEvent<E>) => {
        if (typeof document.hasFocus === 'function' && !document.hasFocus()) {
            return;
        }
        e.preventDefault();
        const target = e.target as Node;
        const contextMenu = document.querySelector(`#${sketchContextMenuId}`);
        if (contextMenu && target && contextMenu.contains(target)) {
            onClose();
        } else {
            handler({ x: e.clientX, y: e.clientY });
        }
    };

interface SketchContextMenuProps {
    position: ContextMenuPosition | null;
    onClose: () => void;
    onForward?: () => void;
    onBackward?: () => void;
    editValue?: string;
    onEdit?: (text: string) => void;
    onAttach?: (user: SessionUser) => void;
    onUnattach?: () => void;
    onDuplicate?: () => void;
    onColorChange?: (color: Color) => void;
    onWidthPick?: (width: number) => void;
    onFontSizePick?: (fontSize: number) => void;
    onColorPick?: (color: Color) => void;
    onDelete?: () => void;
}

const SketchContextMenu = ({
    position,
    onClose,
    onForward,
    onBackward,
    editValue,
    onEdit,
    onAttach,
    onUnattach,
    onDuplicate,
    onColorChange,
    onWidthPick,
    onFontSizePick,
    onColorPick,
    onDelete
}: SketchContextMenuProps) => {
    const { colorScheme } = useMantineColorScheme();
    const { T } = useApp();

    const [editInputValue, setEditInputValue] = useState<string>(
        editValue ?? ''
    );

    // if input is empty and menu is open / re-open then reset input with proper value
    const wasClosedRef = useRef(!!position);
    useEffect(() => {
        if (wasClosedRef.current && position && editValue) {
            wasClosedRef.current = false;
            setEditInputValue(editValue);
        } else if (!wasClosedRef.current && !position) {
            wasClosedRef.current = true;
        }
    }, [position, editValue]);

    const { users, drawingColor } = usePlay();

    const playerUsers = users.filter(({ isMaster }) => !isMaster);

    const isDivider =
        !!onForward ||
        !!onBackward ||
        !!onWidthPick ||
        !!onColorPick ||
        !!onFontSizePick ||
        !!onEdit ||
        !!onAttach ||
        !!onUnattach ||
        !!onDuplicate ||
        !!onColorChange;

    return (
        <ControlledMenu
            id={sketchContextMenuId}
            state={position ? 'open' : 'closed'}
            anchorPoint={position ?? undefined}
            onClose={onClose}
            theming={colorScheme}
            portal={{
                target: document.body
            }}
        >
            {!!onForward && (
                <MenuItem key="forward" onClick={onForward}>
                    {T('page.play.sketch.forward')}
                </MenuItem>
            )}
            {!!onBackward && (
                <MenuItem key="backward" onClick={onBackward}>
                    {T('page.play.sketch.backward')}
                </MenuItem>
            )}
            {!!onEdit && (
                <MenuItem key="edit">
                    <TextInput
                        w="10rem"
                        onClick={(e) => e.stopPropagation()}
                        value={editInputValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = e.target.value;
                            setEditInputValue(val);
                            if (val) {
                                onEdit(val);
                            }
                        }}
                    />
                </MenuItem>
            )}
            {!!onWidthPick && (
                <MenuItem key="widthPick">
                    <WidthPicker
                        maw="10rem"
                        color={drawingColor}
                        onPick={(width: number) => {
                            onWidthPick(width);
                            onClose();
                        }}
                    />
                </MenuItem>
            )}
            {!!onFontSizePick && (
                <MenuItem key="fontSizePick">
                    <FontSizePicker
                        maw="10rem"
                        onPick={(fontSize: number) => {
                            onFontSizePick(fontSize);
                            onClose();
                        }}
                    />
                </MenuItem>
            )}
            {!!onColorPick && (
                <MenuItem key="colorPick">
                    <ColorPicker
                        maw="10rem"
                        onChange={(color: Color) => {
                            onColorPick(color);
                            onClose();
                        }}
                    />
                </MenuItem>
            )}
            {!!onAttach && !!playerUsers.length && (
                <SubMenu
                    key="attach"
                    label={T('page.play.sketch.attachCharacter')}
                >
                    {playerUsers.map((user) => [
                        <MenuItem
                            key={`submenu-${user.id}`}
                            onClick={() => onAttach?.(user)}
                        >
                            {`${user.character.name} (${user.name})`}
                        </MenuItem>
                    ])}
                </SubMenu>
            )}
            {!!onUnattach && (
                <MenuItem key="unattach" onClick={onUnattach}>
                    {T('page.play.sketch.unattachCharacter')}
                </MenuItem>
            )}
            {!!onDuplicate && (
                <MenuItem key="duplicate" onClick={onDuplicate}>
                    {T('page.play.sketch.duplicate')}
                </MenuItem>
            )}
            {!!onColorChange && (
                <SubMenu
                    key="colorChange"
                    label={T('page.play.sketch.changeColor')}
                >
                    <ColorPicker
                        maw="10rem"
                        onChange={(color: Color) => {
                            onColorChange?.(color);
                            onClose();
                        }}
                    />
                </SubMenu>
            )}
            {!!onDelete && isDivider && <MenuDivider key="divider" />}
            {!!onDelete && (
                <MenuItem
                    key="delete"
                    style={{ color: 'var(--mantine-color-red-text)' }}
                    onClick={onDelete}
                >
                    {T('page.play.sketch.delete')}
                </MenuItem>
            )}
        </ControlledMenu>
    );
};

export default SketchContextMenu;
