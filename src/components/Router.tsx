import React from 'react';
import {
    BrowserRouter,
    Navigate,
    Routes,
    Route
} from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { useAuth } from './contexts/Auth';
import Page from './layout/page/Page';
import Login from './pages/login/Login';
import Home from './pages/home/Home';

interface RequireAuthProps {
    children: React.ReactElement;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return (
        isLoggedIn ? children : <Navigate to="/login" />
    );
};

const Router: React.FC = () => {
    const { isLoggedIn, isLoading } = useAuth();

    return (
        <Page showNav={isLoggedIn}>
            {
                isLoading ? (
                    <CircularProgress size={100} />
                ) : (
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    isLoggedIn ? (
                                        <Navigate to="/home" />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/"
                                element={(
                                    <RequireAuth>
                                        <Navigate to="/home" />
                                    </RequireAuth>
                                )}
                            />
                            <Route
                                path="/home"
                                element={(
                                    <RequireAuth>
                                        <Home />
                                    </RequireAuth>
                                )}
                            />
                        </Routes>
                    </BrowserRouter>
                )
            }
        </Page>
    );
};

export default Router;
