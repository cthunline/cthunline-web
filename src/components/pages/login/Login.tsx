import { Box, Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { GiD10 } from 'react-icons/gi';
import { MdLogin } from 'react-icons/md';
import { Navigate } from 'react-router';
import z from 'zod';

import { useApp } from '../../../contexts/App.js';
import { toast } from '../../../services/toast.js';
import ContentBox from '../../common/ContentBox.js';
import Form from '../../common/Form.js';
import Link from '../../common/Link.js';

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const Login = () => {
    const { configuration, T, isLoggedIn, login } = useApp();

    const { onSubmit: handleSubmit, getInputProps } = useForm<LoginFormData>({
        validate: zodResolver(loginFormSchema),
        initialValues: {
            email: '',
            password: ''
        }
    });

    const onFormSubmit = async ({ email, password }: LoginFormData) => {
        try {
            await login(email, password);
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : T('common.unexpectedError')
            );
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/home" />;
    }

    return (
        <ContentBox maw="20em">
            <ContentBox.Content>
                <Form onSubmit={handleSubmit(onFormSubmit)}>
                    <Stack align="center" gap="1rem" w="100%">
                        <Box ta="center">
                            <GiD10 size={100} />
                        </Box>
                        <TextInput
                            {...getInputProps('email')}
                            label={T('user.email')}
                            w="100%"
                        />
                        <TextInput
                            {...getInputProps('password')}
                            type="password"
                            label={T('user.password')}
                            w="100%"
                        />
                        <Button type="submit" leftSection={<MdLogin />}>
                            {T('action.login')}
                        </Button>
                        {configuration?.registrationEnabled ? (
                            <Link to="/register">{T('action.register')}</Link>
                        ) : null}
                    </Stack>
                </Form>
            </ContentBox.Content>
        </ContentBox>
    );
};

export default Login;
