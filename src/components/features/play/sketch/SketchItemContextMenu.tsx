import { useMantineColorScheme } from '@mantine/core';
import {
    ControlledMenu,
    MenuItem,
    MenuDivider,
    SubMenu
} from '@szhsin/react-menu';

import { type SessionUser, type Color } from '../../../../types/index.js';
import ColorSelector from '../../../common/ColorSelector.js';
import { usePlay } from '../../../contexts/Play.js';
import { useApp } from '../../../contexts/App.js';

export interface ContextMenuPosition {
    x: number;
    y: number;
}

export const sketchItemContextMenuId = 'sketch-item-context-menu';

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
        const contextMenu = document.querySelector(
            `#${sketchItemContextMenuId}`
        );
        if (contextMenu && target && contextMenu.contains(target)) {
            onClose();
        } else {
            handler({ x: e.clientX, y: e.clientY });
        }
    };

interface SketchItemContextMenuProps {
    position: ContextMenuPosition | null;
    onClose: () => void;
    onForward?: () => void;
    onBackward?: () => void;
    onAttach?: (user: SessionUser) => void;
    onUnattach?: () => void;
    onDuplicate?: () => void;
    onColorChange?: (color: Color) => void;
    onDelete?: () => void;
}

const SketchItemContextMenu = ({
    position,
    onClose,
    onForward,
    onBackward,
    onAttach,
    onUnattach,
    onDuplicate,
    onColorChange,
    onDelete
}: SketchItemContextMenuProps) => {
    const { colorScheme } = useMantineColorScheme();
    const { T } = useApp();

    const { users } = usePlay();

    const playerUsers = users.filter(({ isMaster }) => !isMaster);

    const isDivider =
        !!onForward &&
        !!onBackward &&
        !!onAttach &&
        !!onUnattach &&
        !!onDuplicate &&
        !!onColorChange;

    return (
        <ControlledMenu
            id={sketchItemContextMenuId}
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
                    <ColorSelector
                        onChange={(color: Color) => {
                            onColorChange?.(color);
                            onClose();
                        }}
                    />
                </SubMenu>
            )}
            {isDivider && <MenuDivider key="divider" />}
            {!!onDelete && (
                <MenuItem key="delete" onClick={onDelete}>
                    {T('page.play.sketch.delete')}
                </MenuItem>
            )}
        </ControlledMenu>
    );
};

export default SketchItemContextMenu;
