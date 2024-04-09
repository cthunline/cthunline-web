import { GiWizardFace } from 'react-icons/gi';
import { Title } from '@mantine/core';

import { useApp } from '../../contexts/App.js';

const Home = () => {
    const { T } = useApp();

    return (
        <div className="flex column center">
            <GiWizardFace size={100} className="mb-20" />
            <Title order={4}>{T('page.home.welcome')}</Title>
        </div>
    );
};

export default Home;
