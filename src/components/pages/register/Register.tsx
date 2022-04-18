import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/Auth';
import { useConfiguration } from '../../contexts/Configuration';
import useUser from '../../hooks/useUser';
import UserForm, { UserSubmitData } from '../../ui/userForm/UserForm';
import Error from '../error/Error';

const Register = () => {
    const navigate = useNavigate();
    const { configuration } = useConfiguration();
    const { isLoggedIn } = useAuth();
    const { registerUser } = useUser();

    const onSubmit = async (data: UserSubmitData) => {
        await registerUser({ data });
        navigate('/login');
    };

    if (isLoggedIn) {
        return <Navigate to="/home" />;
    }

    if (!configuration.registrationEnabled) {
        return <Error type="forbidden" />;
    }

    return (
        <UserForm
            title="Register new account"
            buttonText="Register"
            invitation
            onSubmit={onSubmit}
        />
    );
};

export default Register;
