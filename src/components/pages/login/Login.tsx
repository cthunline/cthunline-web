import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { GiD10 } from 'react-icons/gi';

import { useAuth } from '../../contexts/Auth';
import Page from '../../layout/page/Page';

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

    const onSubmit = ({ email, password }: LoginFormData) => {
        login(email, password);
    };

    return (
        <Page showNav={false}>
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
                    <Form className="login-form">
                        <Field
                            validateOnBlur
                            validateOnChange
                            name="email"
                        >
                            {() => (
                                <TextField
                                    className="login-form-input"
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
                                    className="login-form-input"
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
                        <Button type="submit" variant="contained" size="large">
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Page>
    );
};

export default Login;
