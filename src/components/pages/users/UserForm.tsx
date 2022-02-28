import React from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Paper,
    TextField,
    Button,
    Typography
} from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';

import Api from '../../../services/api';

interface UserFormData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    isAdmin: boolean;
}

type UserFormField = keyof UserFormData;

interface UserFormFieldData {
    field: UserFormField;
    label: string;
    password?: boolean;
}

const fieldList: UserFormFieldData[] = [{
    field: 'name',
    label: 'Name'
}, {
    field: 'email',
    label: 'Email'
}, {
    field: 'password',
    label: 'Password',
    password: true
}, {
    field: 'passwordConfirm',
    label: 'Confirm password',
    password: true
}];

const UserForm = () => {
    const initialValues: UserFormData = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        isAdmin: false
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, 'Too short').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Too short').required('Required'),
        passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    const onSubmit = async ({
        name,
        email,
        password,
        isAdmin
    }: UserFormData) => {
        try {
            await Api.call({
                method: 'POST',
                route: '/users',
                body: {
                    name,
                    email,
                    password,
                    isAdmin
                }
            });
            toast.success('User created');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <Paper elevation={3} className="box">
            <Typography variant="h6" gutterBottom>
                New user
            </Typography>
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
                    <Form className="form flex-column center password-change">
                        {fieldList.map(({ field, label, password }) => (
                            <Field
                                key={field}
                                validateOnBlur
                                validateOnChange
                                name={field}
                            >
                                {() => (
                                    <TextField
                                        className="form-input"
                                        label={label}
                                        name={field}
                                        type={password ? 'password' : 'text'}
                                        error={!!errors[field] && !!touched[field]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={
                                            errors[field]
                                            && touched[field]
                                            && errors[field]
                                        }
                                    />
                                )}
                            </Field>
                        ))}
                        <Button
                            className="form-button"
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<MdOutlineSave />}
                        >
                            Create
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default UserForm;
