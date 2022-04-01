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
import { Login, Error } from './pages';
import { pages } from './router.data';

interface RequireAuthProps {
    children: React.ReactElement;
    admin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, admin }) => {
    const { isLoggedIn, user } = useAuth();
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
    const { isLoading } = useAuth();

    return (
        <BrowserRouter>
            <Page>
                {
                    isLoading ? (
                        <CircularProgress size={100} />
                    ) : (
                        <Routes>
                            <Route
                                path="/login"
                                element={(
                                    <Login />
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
                    )
                }
            </Page>
        </BrowserRouter>
    );
};

export default Router;
