import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { AiOutlineUser } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { MdInfoOutline, MdLogout, MdOutlineSettings } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '../../stores/auth.js';
import { useLocaleStore } from '../../stores/locale.js';
import About from '../features/about/About.js';

interface HeaderMenuItem {
    icon: React.ReactElement;
    route: string;
    textKey: string;
}

const headerMenuItems: HeaderMenuItem[] = [
    {
        icon: <AiOutlineUser size={20} />,
        route: '/profile',
        textKey: 'page.profile.title'
    }
];

const settingsMenuAdminItems: HeaderMenuItem[] = [
    {
        icon: <FiUsers size={20} />,
        route: '/users',
        textKey: 'entity.users'
    }
];

const MenuItem = ({ icon, route, textKey }: HeaderMenuItem) => {
    const T = useLocaleStore(({ T }) => T);
    const navigate = useNavigate();
    return (
        <Menu.Item leftSection={icon} onClick={() => navigate(route)}>
            {T(textKey)}
        </Menu.Item>
    );
};

const HeaderMenu = () => {
    const T = useLocaleStore(({ T }) => T);
    const { user, logout } = useAuthStore(
        useShallow(({ user, logout }) => ({
            user,
            logout
        }))
    );

    const onInfoModalOpen = () => {
        modals.open({
            modalId: 'about-modal',
            centered: true,
            title: 'À propos',
            children: <About />
        });
    };

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
                {headerMenuItems.map((item) => (
                    <MenuItem key={`header-menu-${item.route}`} {...item} />
                ))}
                {user.isAdmin
                    ? [
                          <Menu.Divider key="header-menu-admin-divider" />,
                          ...settingsMenuAdminItems.map((item) => (
                              <MenuItem
                                  key={`header-menu-${item.route}`}
                                  {...item}
                              />
                          ))
                      ]
                    : null}
                <Menu.Divider />
                <Menu.Item
                    leftSection={<MdInfoOutline size={20} />}
                    onClick={onInfoModalOpen}
                >
                    {T('common.about')}
                </Menu.Item>
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

export default HeaderMenu;
