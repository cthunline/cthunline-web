import React from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Paper, TextField, Button } from '@mui/material';
import { GiD10 } from 'react-icons/gi';
import { MdLogin } from 'react-icons/md';

import { useAuth } from '../../contexts/Auth';

import './Login.css';

interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const { login } = useAuth();

    const initialValues: LoginFormData = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Too short').required('Required')
    });

    const onSubmit = async ({ email, password }: LoginFormData) => {
        try {
            await login(email, password);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <Paper elevation={3} className="box">
            <div className="login-logo">
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
                    <Form className="form flex-column center login">
                        <Field
                            validateOnBlur
                            validateOnChange
                            name="email"
                        >
                            {() => (
                                <TextField
                                    className="form-input"
                                    label="Email"
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
                                    label="Password"
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
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default Login;
