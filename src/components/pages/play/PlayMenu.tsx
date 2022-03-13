import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { GiRollingDiceCup } from 'react-icons/gi';
import { MdOutlineContactPage } from 'react-icons/md';

import { PlayWidget } from '../../../types';

import './PlayMenu.css';

interface PlayMenuProps {
    isMaster: boolean;
}

interface PlayMenuItem {
    icon: JSX.Element;
    text: string;
    widget: PlayWidget;
}

const playMenuItems: PlayMenuItem[] = [{
    icon: <GiRollingDiceCup size={40} />,
    text: 'Dices',
    widget: PlayWidget.dices
}, {
    icon: <MdOutlineContactPage size={40} />,
    text: 'Character',
    widget: PlayWidget.character
}];

const PlayMenu: React.FC<PlayMenuProps> = () => (
    <Box className="play-menu flex column">
        {playMenuItems.map(({
            icon,
            text,
            widget
        }) => (
            <Box
                key={`play-menu-${widget}`}
                className="play-menu-item flex center"
            >
                <Tooltip
                    title={(
                        <div className="play-menu-tooltip">{text}</div>
                    )}
                    placement="right"
                >
                    <Box
                        className="play-menu-icon"
                        onClick={() => {}}
                    >
                        {icon}
                    </Box>
                </Tooltip>
            </Box>
        ))}
    </Box>
);

export default PlayMenu;
