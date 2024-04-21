import { Navigate, useNavigate } from 'react-router-dom';

import UserForm, { type UserSubmitData } from '../../features/user/UserForm.js';
import useUser from '../../../hooks/api/useUser.js';
import ContentBox from '../../common/ContentBox.js';
import { useApp } from '../../../contexts/App.js';
import ErrorPage from '../error/ErrorPage.js';
import Link from '../../common/Link.js';

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
        <ContentBox maw="25rem">
            <ContentBox.Title>{T('page.register.title')}</ContentBox.Title>
            <ContentBox.Content>
                <UserForm
                    buttonText={T('action.register')}
                    invitation
                    onSubmit={onSubmit}
                />
                <Link to="/login">{T('action.login')}</Link>
            </ContentBox.Content>
        </ContentBox>
    );
};

export default Register;
