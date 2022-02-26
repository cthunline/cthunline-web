import React from 'react';

import Nav from '../nav/Nav';

import './Page.css';

interface PageProps {
    children: JSX.Element | JSX.Element[];
    showNav?: boolean;
}

const Page: React.FC<PageProps> = ({
    children,
    showNav = true
}) => (
    <div className="page">
        {showNav ? <Nav /> : null}
        <div className="content">
            {children}
        </div>
    </div>
);

export default Page;
