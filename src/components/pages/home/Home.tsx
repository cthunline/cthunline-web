import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

import './Home.css';

const Home = () => (
    <div className="flex column center">
        <GiWizardFace size={100} className="home-icon" />
        <Typography variant="h4" gutterBottom>
            Welcome traveler!
        </Typography>
    </div>
);

export default Home;
