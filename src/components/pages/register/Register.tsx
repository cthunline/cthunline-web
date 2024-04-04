import { Navigate, useNavigate } from 'react-router-dom';

import UserForm, { type UserSubmitData } from '../../features/user/UserForm';
import ContentBox from '../../common/ContentBox';
import { useApp } from '../../contexts/App';
import ErrorPage from '../error/ErrorPage';
import useUser from '../../hooks/useUser';
import Link from '../../common/Link';

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
