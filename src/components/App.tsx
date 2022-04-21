import React from 'react';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { AppProvider } from './contexts/App';
import { DialogProvider } from './contexts/Dialog';
import Router from './Router';
import theme from './theme';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './Ui.css';

const App = () => (
    <AppProvider>
        <ThemeProvider theme={theme}>
            <DialogProvider>
                <Router />
                <ToastContainer theme="dark" />
            </DialogProvider>
        </ThemeProvider>
    </AppProvider>
);

export default App;
