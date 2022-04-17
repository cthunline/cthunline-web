import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

const Home = () => (
    <div className="flex column center">
        <GiWizardFace size={100} className="mb-20" />
        <Typography variant="h4" gutterBottom>
            Welcome traveler!
        </Typography>
    </div>
);

export default Home;
