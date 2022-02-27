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

import { useAuth } from '../../contexts/Auth';
import Api from '../../../services/api';

import './Settings.css';

interface PasswordChangeData {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

type PasswordChangeField = keyof PasswordChangeData;

interface PasswordChangeFieldData {
    field: PasswordChangeField;
    label: string;
}

const Settings = () => {
    const { user } = useAuth();

    const initialValues: PasswordChangeData = {
        oldPassword: '',
        password: '',
        passwordConfirm: ''
    };

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().min(6, 'Too short').required('Required'),
        password: Yup.string().min(6, 'Too short').required('Required'),
        passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    const onSubmit = async ({
        oldPassword,
        password
    }: PasswordChangeData) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${user?.id}`,
                body: {
                    oldPassword,
                    password
                }
            });
            toast.success('Password changed');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const fieldList: PasswordChangeFieldData[] = [{
        field: 'oldPassword',
        label: 'Old password'
    }, {
        field: 'password',
        label: 'New password'
    }, {
        field: 'passwordConfirm',
        label: 'Confirm new password'
    }];

    return (
        <Paper elevation={3} className="box">
            <Typography variant="h6" gutterBottom>
                Change password
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
                        {fieldList.map(({ field, label }) => (
                            <Field
                                key={field}
                                validateOnBlur
                                validateOnChange
                                name="password"
                            >
                                {() => (
                                    <TextField
                                        className="form-input"
                                        label={label}
                                        name={field}
                                        type="password"
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
                            Save
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default Settings;
