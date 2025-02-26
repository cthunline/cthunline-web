import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { useAuthStore } from '../../stores/auth.js';
import { pages } from '../router.data.js';
import Nav from './Header.js';

interface PageProps {
    children: React.ReactElement | React.ReactElement[];
}

const Page = ({ children }: PageProps) => {
    const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);
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
        <Stack
            component="main"
            w="100%"
            h="100%"
            align="center"
            justify="center"
            gap={0}
        >
            {showNav ? <Nav /> : null}
            <Stack
                align="center"
                justify="center"
                w="100%"
                mih={0}
                flex="1"
                p="1rem"
            >
                {children}
            </Stack>
        </Stack>
    );
};

export default Page;
