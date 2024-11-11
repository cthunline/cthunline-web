import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import { CgNotes } from 'react-icons/cg';
import { GiRollingDiceCup } from 'react-icons/gi';
import { HiMusicNote } from 'react-icons/hi';
import { MdDraw, MdLogout, MdOutlineContactPage } from 'react-icons/md';
import { TbEyeEdit } from 'react-icons/tb';

import { useMemo } from 'react';
import { useApp } from '../../../contexts/App.js';
import type { WidgetType, WidgetVisibility } from '../../../types/index.js';
import { type PlayMenuEntry, playMenuEntries } from './playMenu.helper.js';

interface PlayMenuItemData {
    icon: JSX.Element;
    textKey: string;
    widget?: WidgetType;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    key?: string;
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

const PlayMenuElement = ({
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
    const playMenuItemsObj: Record<PlayMenuEntry, PlayMenuItemData> = useMemo(
        () => ({
            character: {
                icon: <MdOutlineContactPage size="2.25rem" />,
                textKey: 'entity.character',
                widget: 'character'
            },
            characters: {
                icon: <MdOutlineContactPage size="2.25rem" />,
                textKey: 'entity.characters',
                widget: 'characters'
            },
            dices: {
                icon: <GiRollingDiceCup size="2.25rem" />,
                textKey: 'entity.dices',
                widget: 'dices'
            },
            sketch: {
                icon: <MdDraw size="2.25rem" />,
                textKey: 'entity.sketch',
                widget: 'sketch'
            },
            jukebox: {
                icon: <HiMusicNote size="2.25rem" />,
                textKey: 'entity.jukebox',
                widget: 'jukebox'
            },
            notes: {
                icon: <CgNotes size="2.25rem" />,
                textKey: 'entity.notes',
                widget: 'notes'
            },
            see: {
                icon: <TbEyeEdit size="2.25rem" />,
                textKey: 'page.play.sketch.see',
                onMouseDown: () => onWidgetsVisibilityChange('hidden'),
                onMouseUp: () => onWidgetsVisibilityChange('visible'),
                onMouseLeave: () => onWidgetsVisibilityChange('visible'),
                key: 'see'
            },
            exit: {
                icon: <MdLogout size="2.25rem" />,
                textKey: 'action.exit',
                onClick: onExit,
                key: 'exit'
            }
        }),
        [onExit, onWidgetsVisibilityChange]
    );

    const playMenuItems = useMemo(() => {
        return isMaster
            ? playMenuEntries.master.map((key) => playMenuItemsObj[key])
            : playMenuEntries.player.map((key) => playMenuItemsObj[key]);
    }, [isMaster, playMenuItemsObj]);

    return (
        <Stack w="3.5rem" h="100%" gap="1.5rem">
            {playMenuItems.map(
                ({
                    icon,
                    textKey,
                    widget,
                    onClick,
                    onMouseDown,
                    onMouseEnter,
                    onMouseLeave,
                    onMouseUp,
                    key
                }) => (
                    <PlayMenuElement
                        key={`play-menu-${widget ?? key}`}
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
