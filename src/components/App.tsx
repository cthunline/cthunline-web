import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { MantineProvider } from '@mantine/core';

import { AppProvider, useApp } from './contexts/App';
import { mantineTheme } from './theme';
import Router from './Router';

import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';

import './utilities.css';
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
