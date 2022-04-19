import React from 'react';
import { Typography } from '@mui/material';
import { GiWizardFace } from 'react-icons/gi';

import { useTranslation } from '../../contexts/Translation';

type ErrorType = 'notFound' | 'forbidden';

interface ErrorProps {
    type: ErrorType;
}

const Error: React.FC<ErrorProps> = ({ type }) => {
    const { T } = useTranslation();

    const errors = {
        notFound: {
            title: T('page.error.notFound.title'),
            message: T('page.error.notFound.message')
        },
        forbidden: {
            title: T('page.error.forbidden.title'),
            message: T('page.error.forbidden.message')
        }
    };

    const { title, message } = errors[type];

    return (
        <div className="flex column center">
            <GiWizardFace size={100} className="mb-20" />
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
