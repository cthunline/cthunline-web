import { Navigate, Link as RouterLink } from 'react-router-dom';
import { Paper, TextField, Button, Link, Stack, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdLogin } from 'react-icons/md';
import { toast } from 'react-toastify';
import { GiD10 } from 'react-icons/gi';
import z from 'zod';

import { useApp } from '../../contexts/App';

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const Login = () => {
    const { configuration, T, isLoggedIn, login } = useApp();

    const { control, handleSubmit } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onFormSubmit = async ({ email, password }: LoginFormData) => {
        try {
            await login(email, password);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/home" />;
    }

    return (
        <Paper elevation={3} className="p-25">
            <Box className="text-center">
                <GiD10 size={100} />
            </Box>
            <Stack
                direction="column"
                alignItems="center"
                gap="1rem"
                width="20rem"
                marginTop="1rem"
                component="form"
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            fullWidth
                            className="form-input"
                            label={T('user.email')}
                            error={!!error}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            fullWidth
                            type="password"
                            className="form-input"
                            label={T('user.password')}
                            error={!!error}
                        />
                    )}
                />
                <Button
                    className="form-button"
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<MdLogin />}
                >
                    {T('action.login')}
                </Button>
                {configuration?.registrationEnabled ? (
                    <Link
                        className="mt-20"
                        underline="none"
                        component={RouterLink}
                        to="/register"
                    >
                        {T('action.register')}
                    </Link>
                ) : null}
            </Stack>
        </Paper>
    );
};

export default Login;
