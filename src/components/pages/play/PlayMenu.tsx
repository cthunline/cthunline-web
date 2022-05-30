import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { GiRollingDiceCup } from 'react-icons/gi';
import { HiMusicNote } from 'react-icons/hi';
import { CgNotes } from 'react-icons/cg';
import {
    MdOutlineContactPage,
    MdLogout,
    MdDraw
} from 'react-icons/md';

import { useApp } from '../../contexts/App';
import { WidgetType } from '../../../types';

import './PlayMenu.css';

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

const playMenuItems: PlayMenuItemData[] = [{
    icon: <MdOutlineContactPage size={40} />,
    textKey: 'entity.character',
    widget: WidgetType.character,
    playerOnly: true
}, {
    icon: <MdOutlineContactPage size={40} />,
    textKey: 'entity.characters',
    widget: WidgetType.characters,
    adminOnly: true
}, {
    icon: <GiRollingDiceCup size={40} />,
    textKey: 'entity.dices',
    widget: WidgetType.dices
}, {
    icon: <MdDraw size={40} />,
    textKey: 'entity.sketch',
    widget: WidgetType.sketch,
    adminOnly: true
}, {
    icon: <HiMusicNote size={40} />,
    textKey: 'entity.jukebox',
    widget: WidgetType.jukebox,
    adminOnly: true
}, {
    icon: <CgNotes size={40} />,
    textKey: 'entity.notes',
    widget: WidgetType.notes
}];

interface PlayMenuItemProps {
    icon: JSX.Element;
    textKey: string;
    onClick: () => void;
}

const PlayMenuItem: React.FC<PlayMenuItemProps> = ({
    icon,
    textKey,
    onClick
}) => {
    const { T } = useApp();
    return (
        <Box className="play-menu-item flex center">
            <Tooltip
                placement="right"
                title={(
                    <div className="play-menu-tooltip">{T(textKey)}</div>
                )}
            >
                <Box className="clickable" onClick={onClick}>
                    {icon}
                </Box>
            </Tooltip>
        </Box>
    );
};

const PlayMenu: React.FC<PlayMenuProps> = ({
    isMaster,
    onWidgetOpen,
    onExit
}) => {
    const items = playMenuItems.filter(({ adminOnly, playerOnly }) => (
        (isMaster && (!playerOnly)) || (!isMaster && (!adminOnly))
    ));
    return (
        <Box className="play-menu flex column full-height">
            {items.map(({
                icon,
                textKey,
                widget
            }) => (
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
        </Box>
    );
};

export default PlayMenu;
