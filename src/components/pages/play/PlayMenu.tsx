import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { GiRollingDiceCup } from 'react-icons/gi';
import { MdOutlineContactPage, MdLogout } from 'react-icons/md';
import { HiMusicNote } from 'react-icons/hi';

import { WidgetType } from '../../../types';

import './PlayMenu.css';

interface PlayMenuProps {
    isMaster: boolean;
    onWidgetOpen: (widget: WidgetType) => void;
    onExit: () => void;
}

interface PlayMenuItemData {
    icon: JSX.Element;
    text: string;
    widget: WidgetType;
    playerOnly?: boolean;
    adminOnly?: boolean;
}

const playMenuItems: PlayMenuItemData[] = [{
    icon: <GiRollingDiceCup size={40} />,
    text: 'Dices',
    widget: WidgetType.dices
}, {
    icon: <MdOutlineContactPage size={40} />,
    text: 'Character',
    widget: WidgetType.character,
    playerOnly: true
}, {
    icon: <MdOutlineContactPage size={40} />,
    text: 'Characters',
    widget: WidgetType.characters,
    adminOnly: true
}, {
    icon: <HiMusicNote size={40} />,
    text: 'Jukebox',
    widget: WidgetType.jukebox,
    adminOnly: true
}];

interface PlayMenuItemProps {
    icon: JSX.Element;
    text: string;
    onClick: () => void;
}

const PlayMenuItem: React.FC<PlayMenuItemProps> = ({
    icon,
    text,
    onClick
}) => (
    <Box className="play-menu-item flex center">
        <Tooltip
            placement="right"
            title={(
                <div className="play-menu-tooltip">{text}</div>
            )}
        >
            <Box className="clickable" onClick={onClick}>
                {icon}
            </Box>
        </Tooltip>
    </Box>
);

const PlayMenu: React.FC<PlayMenuProps> = ({
    isMaster,
    onWidgetOpen,
    onExit
}) => {
    const items = playMenuItems.filter(({ adminOnly, playerOnly }) => (
        (isMaster && (!playerOnly)) || (!isMaster && (!adminOnly))
    ));
    return (
        <Box className="play-menu flex column">
            {items.map(({
                icon,
                text,
                widget
            }) => (
                <PlayMenuItem
                    key={`play-menu-${widget}`}
                    icon={icon}
                    text={text}
                    onClick={() => onWidgetOpen(widget)}
                />
            ))}
            <PlayMenuItem
                icon={<MdLogout size={40} />}
                text="Exit"
                onClick={() => onExit()}
            />
        </Box>
    );
};

export default PlayMenu;
