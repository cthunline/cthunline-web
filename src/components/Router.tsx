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
import {
    Login,
    Home,
    Characters,
    Settings,
    Sessions,
    NotFound
} from './pages';

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

    const pages = [{
        path: '/home',
        element: <Home />
    }, {
        path: '/characters',
        element: <Characters />
    }, {
        path: '/settings',
        element: <Settings />
    }, {
        path: '/sessions',
        element: <Sessions />
    }];

    return (
        <BrowserRouter>
            <Page showNav={isLoggedIn}>
                {
                    isLoading ? (
                        <CircularProgress size={100} />
                    ) : (
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
                            {pages.map(({ path, element }) => (
                                <Route
                                    path={path}
                                    element={(
                                        <RequireAuth>
                                            {element}
                                        </RequireAuth>
                                    )}
                                />
                            ))}
                            <Route
                                path="*"
                                element={(
                                    <RequireAuth>
                                        <NotFound />
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
