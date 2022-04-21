import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useApp } from '../../contexts/App';
import useUser from '../../hooks/useUser';
import UserForm, { UserSubmitData } from '../../ui/userForm/UserForm';
import Error from '../error/Error';

const Register = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const { configuration, isLoggedIn } = useApp();
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
            title={T('page.register.title')}
            buttonText={T('action.register')}
            invitation
            onSubmit={onSubmit}
        />
    );
};

export default Register;
