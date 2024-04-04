import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { Loader } from '@mantine/core';

import Register from './pages/register/Register';
import ErrorPage from './pages/error/ErrorPage';
import { useApp } from './contexts/App';
import Login from './pages/login/Login';
import { pages } from './router.data';
import Page from './layout/Page';

interface RequireAuthProps {
    children: React.ReactElement;
    admin?: boolean;
}

const RequireAuth = ({ children, admin }: RequireAuthProps) => {
    const { isLoggedIn, user } = useApp();
    if (isLoggedIn) {
        if (admin && !user?.isAdmin) {
            return <ErrorPage type="forbidden" />;
        }
        return children;
    }
    return <Navigate to="/login" />;
};

const Router = () => {
    const { isLoading } = useApp();

    if (isLoading) {
        return (
            <BrowserRouter>
                <Page>
                    <Loader size="xl" />
                </Page>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Page>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                                <Navigate to="/home" />
                            </RequireAuth>
                        }
                    />
                    {pages.map(({ path, element, admin }) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <RequireAuth admin={admin}>
                                    {element}
                                </RequireAuth>
                            }
                        />
                    ))}
                    <Route
                        path="*"
                        element={
                            <RequireAuth>
                                <ErrorPage type="notFound" />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </Page>
        </BrowserRouter>
    );
};

export default Router;
