import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

import './NotFound.css';

const NotFound = () => (
    <div className="not-found">
        <GiWizardFace size={100} />
        <Typography variant="h4" gutterBottom>
            I have no memory of this place...
        </Typography>
        <Typography variant="h5" gutterBottom>
            Page not found
        </Typography>
    </div>
);

export default NotFound;
