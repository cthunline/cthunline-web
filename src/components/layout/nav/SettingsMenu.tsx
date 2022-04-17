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

import { useAuth } from '../../contexts/Auth';

interface SettingsMenuItem {
    icon: JSX.Element;
    route: string;
    text: string;
}

const settingsMenuItems: SettingsMenuItem[] = [{
    icon: <AiOutlineUser size={20} />,
    route: '/profile',
    text: 'Profile'
}];

const settingsMenuAdminItems: SettingsMenuItem[] = [{
    icon: <FiUsers size={20} />,
    route: '/users',
    text: 'Users'
}];

interface SettingsMenuProps {
    anchorEl: HTMLElement | null;
    handleClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ anchorEl, handleClose }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const menuItem = ({ icon, route, text }: SettingsMenuItem) => (
        <MenuItem
            key={`settings-menu-${route}`}
            onClick={() => navigate(route)}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
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
            {settingsMenuItems.map((item) => (
                menuItem(item)
            ))}
            {user?.isAdmin ? [
                <Divider key="admin-divider" />,
                ...settingsMenuAdminItems.map((item) => (
                    menuItem(item)
                ))
            ] : null}
            <Divider />
            <MenuItem onClick={() => logout()}>
                <ListItemIcon>
                    <MdLogout size={20} />
                </ListItemIcon>
                <ListItemText>
                    Logout
                </ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default SettingsMenu;
