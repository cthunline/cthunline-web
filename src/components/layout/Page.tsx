import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppShell, Stack } from '@mantine/core';

import { useApp } from '../contexts/App.js';
import { pages } from '../router.data.js';
import Nav from './Nav.js';

interface PageProps {
    children: JSX.Element | JSX.Element[];
}

const Page = ({ children }: PageProps) => {
    const { isLoggedIn } = useApp();
    const location = useLocation();

    const [showNav, setShowNav] = useState<boolean>(isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            const { pathname } = location;
            const page = pages.find(({ regex }) => regex?.test(pathname));
            setShowNav(page?.showNav ?? true);
        } else {
            setShowNav(false);
        }
    }, [location, isLoggedIn]);

    return (
        <AppShell
            header={{
                height: '3.5rem',
                collapsed: !showNav
            }}
            display="block"
            w="100%"
            h="100%"
        >
            {showNav ? <Nav /> : null}
            <AppShell.Main w="100%" h="100%">
                <Stack
                    align="center"
                    justify="center"
                    w="100%"
                    h="100%"
                    p="1.5rem"
                >
                    {children}
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
};

export default Page;
