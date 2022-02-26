import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { GiD10 } from 'react-icons/gi';

import './Nav.css';

// const navPages = [{
//     title: 'Play',
//     link: '/play'
// }];

const Nav: React.FC = () => {
    const [value, setValue] = useState<number>(0);

    const onChange = (e: React.SyntheticEvent, changedValue: number) => {
        // console.log(changedValue);
        setValue(changedValue);
    };

    return (
        <nav className="nav">
            <div className="nav-logo">
                <GiD10 size={40} />
            </div>
            <Tabs value={value} onChange={onChange}>
                <Tab label="Page 1" />
                <Tab label="Page 2" />
                <Tab label="Page 3" />
            </Tabs>
        </nav>
    );
};

export default Nav;
