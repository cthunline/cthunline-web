import { MdOutlineContactPage, MdLogout, MdDraw } from 'react-icons/md';
import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import { GiRollingDiceCup } from 'react-icons/gi';
import { HiMusicNote } from 'react-icons/hi';
import { CgNotes } from 'react-icons/cg';

import { WidgetType } from '../../../types/index.js';
import { useApp } from '../../contexts/App.js';

interface PlayMenuProps {
    isMaster: boolean;
    onWidgetOpen: (widget: WidgetType) => void;
    onExit: () => void;
}

interface PlayMenuItemData {
    icon: JSX.Element;
    textKey: string;
    widget: WidgetType;
    playerOnly?: boolean;
    adminOnly?: boolean;
}

const playMenuItems: PlayMenuItemData[] = [
    {
        icon: <MdOutlineContactPage size={40} />,
        textKey: 'entity.character',
        widget: WidgetType.character,
        playerOnly: true
    },
    {
        icon: <MdOutlineContactPage size={40} />,
        textKey: 'entity.characters',
        widget: WidgetType.characters,
        adminOnly: true
    },
    {
        icon: <GiRollingDiceCup size={40} />,
        textKey: 'entity.dices',
        widget: WidgetType.dices
    },
    {
        icon: <MdDraw size={40} />,
        textKey: 'entity.sketch',
        widget: WidgetType.sketch,
        adminOnly: true
    },
    {
        icon: <HiMusicNote size={40} />,
        textKey: 'entity.jukebox',
        widget: WidgetType.jukebox,
        adminOnly: true
    },
    {
        icon: <CgNotes size={40} />,
        textKey: 'entity.notes',
        widget: WidgetType.notes
    }
];

interface PlayMenuItemProps {
    icon: JSX.Element;
    textKey: string;
    onClick: () => void;
}

const PlayMenuItem = ({ icon, textKey, onClick }: PlayMenuItemProps) => {
    const { T } = useApp();
    return (
        <Tooltip label={T(textKey)} position="right">
            <ActionIcon variant="subtle" size="xl" onClick={onClick}>
                {icon}
            </ActionIcon>
        </Tooltip>
    );
};

const PlayMenu = ({ isMaster, onWidgetOpen, onExit }: PlayMenuProps) => {
    const items = playMenuItems.filter(
        ({ adminOnly, playerOnly }) =>
            (isMaster && !playerOnly) || (!isMaster && !adminOnly)
    );
    return (
        <Stack w="3.5rem" h="100%">
            {items.map(({ icon, textKey, widget }) => (
                <PlayMenuItem
                    key={`play-menu-${widget}`}
                    icon={icon}
                    textKey={textKey}
                    onClick={() => onWidgetOpen(widget)}
                />
            ))}
            <PlayMenuItem
                icon={<MdLogout size={40} />}
                textKey="action.exit"
                onClick={() => onExit()}
            />
        </Stack>
    );
};

export default PlayMenu;
