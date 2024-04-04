import { AppShell, Button, useMantineColorScheme } from '@mantine/core';
import { GiD10, GiRollingDices } from 'react-icons/gi';
import { MdOutlineContactPage } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FiFolder } from 'react-icons/fi';

import { useApp } from '../contexts/App';
import NavMenu from './NavMenu';

/* eslint-disable react/no-unused-prop-types */
interface NavMenuItem {
    icon: JSX.Element;
    route: string;
    textKey: string;
}
/* eslint-enable react/no-unused-prop-types */

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

const Nav = () => {
    const { colorScheme } = useMantineColorScheme();
    const navigate = useNavigate();
    const { T } = useApp();

    return (
        <AppShell.Header
            component="nav"
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <AppShell.Section px="1rem">
                <GiD10
                    className="clickable"
                    size={40}
                    onClick={() => navigate('/home')}
                />
            </AppShell.Section>
            <AppShell.Section grow px="1rem">
                {navMenuItems.map(({ icon, route, textKey }: NavMenuItem) => (
                    <Button
                        key={`nav-menu-${route}`}
                        variant="subtle"
                        color={colorScheme === 'light' ? 'dark' : 'gray'}
                        size="md"
                        leftSection={icon}
                        onClick={() => navigate(route)}
                        mx="0.5rem"
                    >
                        {T(textKey)}
                    </Button>
                ))}
            </AppShell.Section>
            <AppShell.Section px="1rem">
                <NavMenu />
            </AppShell.Section>
        </AppShell.Header>
    );
};

export default Nav;
