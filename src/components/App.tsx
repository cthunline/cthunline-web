import React from 'react';
import { CookiesProvider } from 'react-cookie';

import { AuthProvider } from './contexts/Auth';
import Router from './Router';

import './App.css';

const App = () => (
    <CookiesProvider>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </CookiesProvider>
);

export default App;
