import {
    AppShell,
    Group,
    type MantineStyleProp,
    Text,
    UnstyledButton
} from '@mantine/core';
import { FiFolder } from 'react-icons/fi';
import { GiD10, GiRollingDices } from 'react-icons/gi';
import { MdOutlineContactPage } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

import { useApp } from '../../contexts/App.js';
import NavMenu from './NavMenu.js';

import './Nav.css';

interface NavMenuItem {
    icon: JSX.Element;
    route: string;
    textKey: string;
}

const navMenuItems: NavMenuItem[] = [
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

const sectionStyle: MantineStyleProp = {
    height: '100%',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '2.5rem'
};

const Nav = () => {
    const { T } = useApp();
    const { pathname } = useLocation();
    return (
        <AppShell.Header
            component="nav"
            style={{
                height: '3.5rem',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '1.5rem'
            }}
        >
            <AppShell.Section style={sectionStyle}>
                <UnstyledButton component={Link} to="/home">
                    <GiD10 size="2.5rem" />
                </UnstyledButton>
            </AppShell.Section>
            <AppShell.Section grow style={sectionStyle}>
                {navMenuItems.map(({ icon, route, textKey }: NavMenuItem) => (
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
            </AppShell.Section>
            <AppShell.Section style={sectionStyle}>
                <NavMenu />
            </AppShell.Section>
        </AppShell.Header>
    );
};

export default Nav;
