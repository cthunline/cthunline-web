import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { useApp } from './contexts/App';
import Page from './layout/page/Page';
import { pages } from './router.data';
import { Login, ErrorPage, Register } from './pages';

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
                    <CircularProgress size={100} />
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
