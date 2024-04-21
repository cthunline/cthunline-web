import { MdLogout, MdOutlineSettings } from 'react-icons/md';
import { Avatar, UnstyledButton, Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';

import { useApp } from '../../contexts/App.js';

interface NavMenuItem {
    icon: JSX.Element;
    route: string;
    textKey: string;
}

const navMenuItems: NavMenuItem[] = [
    {
        icon: <AiOutlineUser size={20} />,
        route: '/profile',
        textKey: 'page.profile.title'
    }
];

const settingsMenuAdminItems: NavMenuItem[] = [
    {
        icon: <FiUsers size={20} />,
        route: '/users',
        textKey: 'entity.users'
    }
];

const MenuItem = ({ icon, route, textKey }: NavMenuItem) => {
    const navigate = useNavigate();
    const { T } = useApp();
    return (
        <Menu.Item leftSection={icon} onClick={() => navigate(route)}>
            {T(textKey)}
        </Menu.Item>
    );
};

const NavMenu = () => {
    const { T, logout, user } = useApp();
    return (
        <Menu shadow="md">
            <Menu.Target>
                <UnstyledButton>
                    <Avatar size="md">
                        <MdOutlineSettings size="1.5rem" />
                    </Avatar>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                {navMenuItems.map((item) => (
                    <MenuItem key={`nav-menu-${item.route}`} {...item} />
                ))}
                {user?.isAdmin
                    ? [
                          <Menu.Divider key="nav-menu-admin-divider" />,
                          ...settingsMenuAdminItems.map((item) => (
                              <MenuItem
                                  key={`nav-menu-${item.route}`}
                                  {...item}
                              />
                          ))
                      ]
                    : null}
                <Menu.Divider />
                <Menu.Item
                    leftSection={<MdLogout size={20} />}
                    onClick={() => logout()}
                >
                    {T('action.logout')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default NavMenu;
