import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import { CgNotes } from 'react-icons/cg';
import { GiRollingDiceCup } from 'react-icons/gi';
import { HiMusicNote } from 'react-icons/hi';
import { MdDraw, MdLogout, MdOutlineContactPage } from 'react-icons/md';
import { TbEyeEdit } from 'react-icons/tb';

import { useMemo } from 'react';
import { useApp } from '../../../contexts/App.js';
import { WidgetType, type WidgetVisibility } from '../../../types/index.js';

interface PlayMenuItemData {
    icon: JSX.Element;
    textKey: string;
    widget?: WidgetType;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    playerOnly?: boolean;
    adminOnly?: boolean;
}

interface PlayMenuItemProps {
    icon: JSX.Element;
    textKey: string;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const PlayMenuItem = ({
    icon,
    textKey,
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave
}: PlayMenuItemProps) => {
    const { T } = useApp();
    return (
        <Tooltip label={T(textKey)} position="right">
            <ActionIcon
                variant="subtle"
                size="xl"
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {icon}
            </ActionIcon>
        </Tooltip>
    );
};

interface PlayMenuProps {
    isMaster: boolean;
    onWidgetOpen: (widget: WidgetType) => void;
    onWidgetsVisibilityChange: (visibility: WidgetVisibility) => void;
    onExit: () => void;
}

const PlayMenu = ({
    isMaster,
    onWidgetOpen,
    onExit,
    onWidgetsVisibilityChange
}: PlayMenuProps) => {
    const playMenuItems: PlayMenuItemData[] = useMemo(
        () =>
            [
                {
                    icon: <MdOutlineContactPage size="2.25rem" />,
                    textKey: 'entity.character',
                    widget: WidgetType.character,
                    playerOnly: true
                },
                {
                    icon: <MdOutlineContactPage size="2.25rem" />,
                    textKey: 'entity.characters',
                    widget: WidgetType.characters,
                    adminOnly: true
                },
                {
                    icon: <GiRollingDiceCup size="2.25rem" />,
                    textKey: 'entity.dices',
                    widget: WidgetType.dices
                },
                {
                    icon: <MdDraw size="2.25rem" />,
                    textKey: 'entity.sketch',
                    widget: WidgetType.sketch,
                    adminOnly: true
                },
                {
                    icon: <TbEyeEdit size="2.25rem" />,
                    textKey: 'page.play.sketch.see',
                    onMouseDown: () => onWidgetsVisibilityChange('hidden'),
                    onMouseUp: () => onWidgetsVisibilityChange('visible'),
                    onMouseLeave: () => onWidgetsVisibilityChange('visible')
                },
                {
                    icon: <HiMusicNote size="2.25rem" />,
                    textKey: 'entity.jukebox',
                    widget: WidgetType.jukebox,
                    adminOnly: true
                },
                {
                    icon: <CgNotes size="2.25rem" />,
                    textKey: 'entity.notes',
                    widget: WidgetType.notes
                },
                {
                    icon: <MdLogout size="2.25rem" />,
                    textKey: 'action.exit',
                    onClick: onExit
                }
            ] satisfies PlayMenuItemData[],
        [onExit, onWidgetsVisibilityChange]
    );

    const items = playMenuItems.filter(
        ({ adminOnly, playerOnly }) =>
            (isMaster && !playerOnly) || (!isMaster && !adminOnly)
    );

    return (
        <Stack w="3.5rem" h="100%" gap="1.5rem">
            {items.map(
                ({
                    icon,
                    textKey,
                    widget,
                    onClick,
                    onMouseDown,
                    onMouseEnter,
                    onMouseLeave,
                    onMouseUp
                }) => (
                    <PlayMenuItem
                        key={`play-menu-${widget}`}
                        icon={icon}
                        textKey={textKey}
                        onClick={widget ? () => onWidgetOpen(widget) : onClick}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                )
            )}
        </Stack>
    );
};

export default PlayMenu;
