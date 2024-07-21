import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { AppProvider, useApp } from '../contexts/App.js';
import Router from './Router.js';
import { mantineTheme } from './theme.js';

import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';

import './App.css';

const AppContent = () => {
    const { theme } = useApp();
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

const App = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;
