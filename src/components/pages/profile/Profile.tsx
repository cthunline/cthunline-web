import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Paper,
    TextField,
    Button,
    Typography
} from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';

import useUser from '../../hooks/useUser';
import { useAuth } from '../../contexts/Auth';

import './Profile.css';

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

const Profile = () => {
    const { user } = useAuth();
    const { editUser } = useUser(true);

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

    const onSubmit = ({
        oldPassword,
        password
    }: PasswordChangeData) => {
        editUser(user?.id, {
            oldPassword,
            password
        });
    };

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
                                name={field}
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

export default Profile;
