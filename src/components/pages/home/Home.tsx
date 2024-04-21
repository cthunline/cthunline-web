import { GiWizardFace } from 'react-icons/gi';
import { Stack, Title } from '@mantine/core';

import { useApp } from '../../../contexts/App.js';

const Home = () => {
    const { T } = useApp();

    return (
        <Stack align="center">
            <GiWizardFace size={100} />
            <Title order={4}>{T('page.home.welcome')}</Title>
        </Stack>
    );
};

export default Home;
