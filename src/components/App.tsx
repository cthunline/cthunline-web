import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';

import { useApp } from '../hooks/useApp.js';
import { useAuthStore } from '../stores/auth.js';
import { useConfigurationStore } from '../stores/configuration.js';
import Router from './Router.js';
import { mantineTheme } from './theme.js';

import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';

import './App.css';

const App = () => {
    const { theme } = useApp();

    const refreshConfiguration = useConfigurationStore(
        ({ refresh }) => refresh
    );
    const checkAuth = useAuthStore(({ checkAuth }) => checkAuth);

    useEffect(() => {
        (async () => {
            await refreshConfiguration();
            await checkAuth();
        })();
    }, [refreshConfiguration, checkAuth]);

    return (
        <MantineProvider
            theme={mantineTheme}
            defaultColorScheme="dark"
            forceColorScheme={theme}
        >
            <ModalsProvider>
                <Notifications />
                <Router />
            </ModalsProvider>
        </MantineProvider>
    );
};

export default App;
