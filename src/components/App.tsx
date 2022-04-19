import React from 'react';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { TranslationProvider } from './contexts/Translation';
import { ConfigurationProvider } from './contexts/Configuration';
import { AuthProvider } from './contexts/Auth';
import { DialogProvider } from './contexts/Dialog';
import Router from './Router';
import theme from './theme';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './Ui.css';

const App = () => (
    <TranslationProvider>
        <ConfigurationProvider>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <DialogProvider>
                        <Router />
                        <ToastContainer theme="dark" />
                    </DialogProvider>
                </ThemeProvider>
            </AuthProvider>
        </ConfigurationProvider>
    </TranslationProvider>
);

export default App;
