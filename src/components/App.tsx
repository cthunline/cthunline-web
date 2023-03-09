import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

import { AppProvider, useApp } from './contexts/App';
import { DialogProvider } from './contexts/Dialog';
import Router from './Router';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './utilities.css';

const AppContent = () => {
    const { theme } = useApp();

    const materialUiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: theme
                },
                components: {
                    MuiTab: {
                        styleOverrides: {
                            root: {
                                minHeight: 48
                            }
                        }
                    }
                }
            }),
        [theme]
    );

    return (
        <ThemeProvider theme={materialUiTheme}>
            <DialogProvider>
                <Router />
                <ToastContainer theme={theme} />
            </DialogProvider>
        </ThemeProvider>
    );
};

const App = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;
