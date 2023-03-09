import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { AiOutlineUser } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';

import { useApp } from '../../contexts/App';

interface SettingsMenuItem {
    icon: JSX.Element;
    route: string;
    textKey: string;
}

const settingsMenuItems: SettingsMenuItem[] = [
    {
        icon: <AiOutlineUser size={20} />,
        route: '/profile',
        textKey: 'page.profile.title'
    }
];

const settingsMenuAdminItems: SettingsMenuItem[] = [
    {
        icon: <FiUsers size={20} />,
        route: '/users',
        textKey: 'entity.users'
    }
];

interface SettingsMenuProps {
    anchorEl: HTMLElement | null;
    handleClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
    anchorEl,
    handleClose
}) => {
    const navigate = useNavigate();
    const { T, logout, user } = useApp();

    const menuItem = ({ icon, route, textKey }: SettingsMenuItem) => (
        <MenuItem
            key={`settings-menu-${route}`}
            onClick={() => navigate(route)}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{T(textKey)}</ListItemText>
        </MenuItem>
    );

    return (
        <Menu
            anchorEl={anchorEl}
            id="settings-menu"
            open={!!anchorEl}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                className: 'mt-10 mr-10'
            }}
        >
            {settingsMenuItems.map((item) => menuItem(item))}
            {user?.isAdmin
                ? [
                      <Divider key="admin-divider" />,
                      ...settingsMenuAdminItems.map((item) => menuItem(item))
                  ]
                : null}
            <Divider />
            <MenuItem onClick={() => logout()}>
                <ListItemIcon>
                    <MdLogout size={20} />
                </ListItemIcon>
                <ListItemText>{T('action.logout')}</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default SettingsMenu;
