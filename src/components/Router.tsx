import React from 'react';
import {
    BrowserRouter,
    Navigate,
    Routes,
    Route
} from 'react-router-dom';

import { useAuth } from './contexts/Auth';

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
    const { isLoggedIn } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? <Navigate to="/home" /> : <div>Login</div>
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
                            <div>Home</div>
                        </RequireAuth>
                    )}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
