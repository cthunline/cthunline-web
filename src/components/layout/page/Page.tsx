import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Nav from '../nav/Nav';
import { useAuth } from '../../contexts/Auth';
import { pages } from '../../router.data';

import './Page.css';

interface PageProps {
    children: JSX.Element | JSX.Element[];
}

const Page: React.FC<PageProps> = ({ children }) => {
    const { isLoggedIn } = useAuth();
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
        <div className="page">
            {showNav ? <Nav /> : null}
            <div className={`content ${showNav ? 'with-nav' : 'no-nav'}`}>
                {children}
            </div>
        </div>
    );
};

export default Page;
