import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from './contexts/Auth';
import Router from './Router';
import theme from './theme';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => (
    <CookiesProvider>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Router />
                <ToastContainer theme="dark" />
            </ThemeProvider>
        </AuthProvider>
    </CookiesProvider>
);

export default App;
