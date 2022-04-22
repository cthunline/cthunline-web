import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Nav from '../nav/Nav';
import { useApp } from '../../contexts/App';
import { pages } from '../../router.data';

import './Page.css';

interface PageProps {
    children: JSX.Element | JSX.Element[];
}

const Page: React.FC<PageProps> = ({ children }) => {
    const { isLoggedIn, theme } = useApp();
    const location = useLocation();

    const [showNav, setShowNav] = useState<boolean>(isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            const { pathname } = location;
            const page = pages.find(({ regex }) => (
                regex?.test(pathname)
            ));
            setShowNav(page?.showNav ?? true);
        } else {
            setShowNav(false);
        }
    }, [
        location,
        isLoggedIn
    ]);

    return (
        <div className={`page flex column full-width full-height ${theme}`}>
            {showNav ? <Nav /> : null}
            <div
                className={
                    `content grow flex column center full-width ${showNav ? 'with-nav p-25' : 'full-height'}`
                }
            >
                {children}
            </div>
        </div>
    );
};

export default Page;
