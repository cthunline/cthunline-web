import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

import './Forbidden.css';

const Forbidden = () => (
    <div className="flex-column center">
        <GiWizardFace size={100} className="forbidden-icon" />
        <Typography variant="h4" gutterBottom>
            You shall not pass!
        </Typography>
        <Typography variant="h5" gutterBottom>
            Forbidden page
        </Typography>
    </div>
);

export default Forbidden;
