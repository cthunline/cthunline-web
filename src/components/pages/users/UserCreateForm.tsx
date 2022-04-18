import React from 'react';
import { useNavigate } from 'react-router-dom';

import useUser from '../../hooks/useUser';
import UserForm, { UserSubmitData } from '../../ui/userForm/UserForm';

const UserCreateForm = () => {
    const navigate = useNavigate();
    const { createUser } = useUser();

    const onSubmit = async (data: UserSubmitData) => {
        await createUser({ data });
        navigate('/users');
    };

    return (
        <UserForm onSubmit={onSubmit} />
    );
};

export default UserCreateForm;
