import { Group, type GroupProps, Text, UnstyledButton } from '@mantine/core';
import { FiFolder } from 'react-icons/fi';
import { GiD10, GiRollingDices } from 'react-icons/gi';
import { MdOutlineContactPage } from 'react-icons/md';
import { Link, useLocation } from 'react-router';

import { useApp } from '../../contexts/App.js';
import HeaderMenu from './HeaderMenu.js';

import './Header.css';

interface NavItem {
    icon: React.ReactElement;
    route: string;
    textKey: string;
}

const navItems: NavItem[] = [
    {
        icon: <GiRollingDices size="1.5rem" />,
        route: '/sessions',
        textKey: 'action.play'
    },
    {
        icon: <MdOutlineContactPage size="1.5rem" />,
        route: '/characters',
        textKey: 'entity.characters'
    },
    {
        icon: <FiFolder size="1.5rem" />,
        route: '/assets',
        textKey: 'entity.assets'
    }
];

const sectionProps: GroupProps = {
    align: 'center',
    gap: '2.5rem',
    h: '100%',
    p: '0 1rem'
};

const Header = () => {
    const { T } = useApp();
    const { pathname } = useLocation();
    return (
        <Group
            component="header"
            align="center"
            gap="1.5rem"
            w="100%"
            h="3.5rem"
            className="app-header"
        >
            <Group {...sectionProps}>
                <UnstyledButton component={Link} to="/home">
                    <GiD10 size="2.5rem" />
                </UnstyledButton>
            </Group>
            <Group component="nav" flex="1" {...sectionProps}>
                {navItems.map(({ icon, route, textKey }: NavItem) => (
                    <UnstyledButton
                        key={`nav-item-${textKey}`}
                        component={Link}
                        to={route}
                    >
                        <Group
                            className={`nav-item ${pathname === route ? 'selected' : ''}`}
                            align="center"
                            gap="0.5rem"
                        >
                            {icon}
                            <Text fw="bold">{T(textKey)}</Text>
                        </Group>
                    </UnstyledButton>
                ))}
            </Group>
            <Group {...sectionProps}>
                <HeaderMenu />
            </Group>
        </Group>
    );
};

export default Header;
