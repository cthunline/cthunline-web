import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { GiD10, GiCharacter, GiTabletopPlayers } from 'react-icons/gi';
import { MdOutlineContactPage, MdLogout } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';

import { useAuth } from '../../contexts/Auth';

import './Nav.css';

interface UserMenuProps {
    anchorEl: HTMLElement | null;
    handleClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ anchorEl, handleClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={!!anchorEl}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                className: 'nav-user-menu'
            }}
        >
            <MenuItem onClick={() => navigate('/characters')}>
                <ListItemIcon>
                    <MdOutlineContactPage size={20} />
                </ListItemIcon>
                <ListItemText>
                    Characters
                </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
                <ListItemIcon>
                    <FiSettings size={20} />
                </ListItemIcon>
                <ListItemText>
                    Settings
                </ListItemText>
            </MenuItem>
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

const Nav: React.FC = () => {
    const navigate = useNavigate();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = (
        React.useState<HTMLElement | null>(null)
    );

    const onUserMenuClick = (e: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchorEl(e.currentTarget);
    };

    const onUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    return (
        <nav className="nav">
            <div className="nav-left">
                <GiD10 size={40} />
            </div>
            <div className="nav-middle">
                <Button
                    variant="outlined"
                    startIcon={<GiTabletopPlayers />}
                    onClick={() => navigate('/sessions')}
                >
                    Play
                </Button>
            </div>
            <div className="nav-right">
                <IconButton size="small" onClick={onUserMenuClick}>
                    <Avatar>
                        <GiCharacter size={20} />
                    </Avatar>
                </IconButton>
                <UserMenu
                    anchorEl={userMenuAnchorEl}
                    handleClose={onUserMenuClose}
                />
            </div>
        </nav>
    );
};

export default Nav;
