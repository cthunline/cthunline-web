import { Navigate, useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';

import { useApp } from '../../contexts/App';
import useUser from '../../hooks/useUser';
import UserForm, { UserSubmitData } from '../../ui/userForm/UserForm';
import ErrorPage from '../error/ErrorPage';

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
        return <ErrorPage type="forbidden" />;
    }

    return (
        <Paper elevation={3} className="p-25">
            <Typography variant="h6" gutterBottom>
                {T('page.register.title')}
            </Typography>
            <UserForm
                buttonText={T('action.register')}
                invitation
                onSubmit={onSubmit}
            />
        </Paper>
    );
};

export default Register;
