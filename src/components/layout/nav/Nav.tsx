import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Button,
    IconButton,
    Avatar
} from '@mui/material';
import { GiD10, GiRollingDices } from 'react-icons/gi';
import { MdOutlineContactPage, MdOutlineSettings } from 'react-icons/md';
import { FiFolder } from 'react-icons/fi';

import { useApp } from '../../contexts/App';
import SettingsMenu from './SettingsMenu';

import './Nav.css';

/* eslint-disable react/no-unused-prop-types */
interface NavMenuItem {
    icon: JSX.Element;
    route: string;
    textKey: string;
}
/* eslint-enable react/no-unused-prop-types */

const navMenuItems: NavMenuItem[] = [{
    icon: <GiRollingDices size={20} />,
    route: '/sessions',
    textKey: 'action.play'
}, {
    icon: <MdOutlineContactPage size={20} />,
    route: '/characters',
    textKey: 'entity.characters'
}, {
    icon: <FiFolder size={20} />,
    route: '/assets',
    textKey: 'entity.assets'
}];

const Nav: React.FC = () => {
    const navigate = useNavigate();
    const { T } = useApp();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = (
        useState<HTMLElement | null>(null)
    );

    const onUserMenuClick = (e: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchorEl(e.currentTarget);
    };

    const onUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <nav className="nav flex row center-x">
                <div className="nav-left flex row center ml-10 mr-10">
                    <GiD10
                        className="clickable"
                        size={40}
                        onClick={() => navigate('/home')}
                    />
                </div>
                <div className="nav-middle grow flex row start-x center-y ml-10 mr-10">
                    {navMenuItems.map(({ icon, route, textKey }: NavMenuItem) => (
                        <Button
                            key={`nav-menu-${route}`}
                            className="ml-10 mr-10"
                            startIcon={icon}
                            onClick={() => navigate(route)}
                        >
                            {T(textKey)}
                        </Button>
                    ))}
                </div>
                <div className="nav-right flex row center ml-10 mr-10">
                    <IconButton size="small" onClick={onUserMenuClick}>
                        <Avatar>
                            <MdOutlineSettings size={30} />
                        </Avatar>
                    </IconButton>
                    <SettingsMenu
                        anchorEl={userMenuAnchorEl}
                        handleClose={onUserMenuClose}
                    />
                </div>
            </nav>
        </AppBar>
    );
};

export default Nav;
