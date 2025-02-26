import { Navigate, useNavigate } from 'react-router';

import useUser from '../../../hooks/api/useUser.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useConfigurationStore } from '../../../stores/configuration.js';
import { useLocaleStore } from '../../../stores/locale.js';
import ContentBox from '../../common/ContentBox.js';
import Link from '../../common/Link.js';
import UserForm, { type UserSubmitData } from '../../features/user/UserForm.js';
import ErrorPage from '../error/ErrorPage.js';

const Register = () => {
    const T = useLocaleStore(({ T }) => T);

    const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);
    const configuration = useConfigurationStore(
        (configuration) => configuration
    );

    const navigate = useNavigate();
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
