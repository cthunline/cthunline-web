import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { AppProvider, useApp } from './contexts/App';
import { DialogProvider } from './contexts/Dialog';
import Router from './Router';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './Ui.css';

const App = () => {
    const { theme } = useApp();

    const materialUiTheme = useMemo(() => (
        createTheme({
            palette: {
                mode: theme
            }
        })
    ), [theme]);

    return (
        <ThemeProvider theme={materialUiTheme}>
            <DialogProvider>
                <Router />
                <ToastContainer theme={theme} />
            </DialogProvider>
        </ThemeProvider>
    );
};

const ContainerizedApp = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

export default ContainerizedApp;
