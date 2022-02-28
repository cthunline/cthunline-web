import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from './contexts/Auth';
import { DialogProvider } from './contexts/Dialog';
import Router from './Router';
import theme from './theme';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './Ui.css';

const App = () => (
    <CookiesProvider>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <DialogProvider>
                    <Router />
                    <ToastContainer theme="dark" />
                </DialogProvider>
            </ThemeProvider>
        </AuthProvider>
    </CookiesProvider>
);

export default App;
