import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

import { useTranslation } from '../../contexts/Translation';

const Home = () => {
    const { T } = useTranslation();

    return (
        <div className="flex column center">
            <GiWizardFace size={100} className="mb-20" />
            <Typography variant="h4" gutterBottom>
                {T('page.home.welcome')}
            </Typography>
        </div>
    );
};

export default Home;
