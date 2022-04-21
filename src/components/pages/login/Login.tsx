import React from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Formik,
    Form,
    Field
} from 'formik';
import * as Yup from 'yup';
import {
    Paper,
    TextField,
    Button,
    Link
} from '@mui/material';
import { GiD10 } from 'react-icons/gi';
import { MdLogin } from 'react-icons/md';

import { useApp } from '../../contexts/App';

interface LoginFormData {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short').required('Required')
});

const Login = () => {
    const {
        configuration,
        T,
        isLoggedIn,
        login
    } = useApp();

    const initialValues: LoginFormData = {
        email: '',
        password: ''
    };

    const onSubmit = async ({ email, password }: LoginFormData) => {
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
            <div className="center-text">
                <GiD10 size={100} />
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({
                    errors,
                    touched,
                    handleChange,
                    handleBlur
                }) => (
                    <Form className="form small flex column center">
                        <Field
                            validateOnBlur
                            validateOnChange
                            name="email"
                        >
                            {() => (
                                <TextField
                                    className="form-input"
                                    label={T('user.email')}
                                    name="email"
                                    error={!!errors.email && !!touched.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={
                                        errors.email
                                        && touched.email
                                        && errors.email
                                    }
                                />
                            )}
                        </Field>
                        <Field
                            validateOnBlur
                            validateOnChange
                            name="password"
                        >
                            {() => (
                                <TextField
                                    className="form-input"
                                    label={T('user.password')}
                                    name="password"
                                    type="password"
                                    error={!!errors.password && !!touched.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={
                                        errors.password
                                        && touched.password
                                        && errors.password
                                    }
                                />
                            )}
                        </Field>
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
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default Login;
