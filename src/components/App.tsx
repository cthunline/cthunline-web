import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { ThemeProvider } from '@mui/material';

import { AuthProvider } from './contexts/Auth';
import Router from './Router';
import theme from './theme';

import './App.css';

const App = () => (
    <CookiesProvider>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Router />
            </ThemeProvider>
        </AuthProvider>
    </CookiesProvider>
);

export default App;
