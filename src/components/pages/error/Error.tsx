import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

import './Error.css';

const errors = {
    notFound: {
        title: 'I have no memory of this place...',
        message: 'Page not found'
    },
    forbidden: {
        title: 'You shall not pass!',
        message: 'Forbidden page'
    }
};

type ErrorType = keyof typeof errors;

interface ErrorProps {
    type: ErrorType;
}

const Error: React.FC<ErrorProps> = ({ type }) => {
    const { title, message } = errors[type];
    return (
        <div className="flex column center">
            <GiWizardFace size={100} className="error-icon" />
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h5" gutterBottom>
                {message}
            </Typography>
        </div>
    );
};

export default Error;
