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
    Profile,
    UserList,
    UserForm,
    Sessions,
    Error
} from './pages';

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
    const { isLoggedIn, isLoading } = useAuth();

    const pages = [{
        path: '/home',
        element: <Home />
    }, {
        path: '/characters',
        element: <Characters />
    }, {
        path: '/profile',
        element: <Profile />
    }, {
        path: '/users',
        element: <UserList />,
        admin: true
    }, {
        path: '/users/create',
        element: <UserForm />,
        admin: true
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
