import { GiWizardFace } from 'react-icons/gi';
import { Stack, Title } from '@mantine/core';

import { useApp } from '../../contexts/App';

type ErrorType = 'notFound' | 'forbidden';

interface ErrorProps {
    type: ErrorType;
}

const ErrorPage = ({ type }: ErrorProps) => {
    const { T } = useApp();

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
        <Stack align="center">
            <GiWizardFace size={100} className="mb-20" />
            <Title order={4}>{title}</Title>
            <Title order={5}>{message}</Title>
        </Stack>
    );
};

export default ErrorPage;
