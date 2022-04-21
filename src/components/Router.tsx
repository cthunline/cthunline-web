import React from 'react';
import {
    BrowserRouter,
    Navigate,
    Routes,
    Route
} from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { useApp } from './contexts/App';
import Page from './layout/page/Page';
import { pages } from './router.data';
import {
    Login,
    Error,
    Register
} from './pages';

interface RequireAuthProps {
    children: React.ReactElement;
    admin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, admin }) => {
    const { isLoggedIn, user } = useApp();
    if (isLoggedIn) {
        if (admin && !user?.isAdmin) {
            return (
                <Error type="forbidden" />
            );
        }
        return children;
    }
    return (
        <Navigate to="/login" />
    );
};

const Router: React.FC = () => {
    const { isLoading } = useApp();

    if (isLoading) {
        return (
            <BrowserRouter>
                <Page>
                    <CircularProgress size={100} />
                </Page>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Page>
                <Routes>
                    <Route
                        path="/login"
                        element={(
                            <Login />
                        )}
                    />
                    <Route
                        path="/register"
                        element={(
                            <Register />
                        )}
                    />
                    <Route
                        path="/"
                        element={(
                            <RequireAuth>
                                <Navigate to="/home" />
                            </RequireAuth>
                        )}
                    />
                    {pages.map(({ path, element, admin }) => (
                        <Route
                            key={path}
                            path={path}
                            element={(
                                <RequireAuth admin={admin}>
                                    {element}
                                </RequireAuth>
                            )}
                        />
                    ))}
                    <Route
                        path="*"
                        element={(
                            <RequireAuth>
                                <Error type="notFound" />
                            </RequireAuth>
                        )}
                    />
                </Routes>
            </Page>
        </BrowserRouter>
    );
};

export default Router;
