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

import { useTranslation } from '../../contexts/Translation';
import { UserCreateBody } from '../../../types';

interface UserFormProps {
    invitation?: boolean;
    title?: string;
    buttonText?: string;
    onSubmit: (data: UserSubmitData) => void;
}

interface UserFormData extends UserCreateBody {
    passwordConfirm: string;
    invitationCode?: string;
}

export type UserSubmitData = Omit<UserFormData, 'passwordConfirm'>;

type UserFormField = keyof UserFormData;

interface UserFormFieldData {
    field: UserFormField;
    password?: boolean;
}

const fieldList: UserFormFieldData[] = [{
    field: 'name'
}, {
    field: 'email'
}, {
    field: 'password',
    password: true
}, {
    field: 'passwordConfirm',
    password: true
}, {
    field: 'invitationCode'
}];

const UserForm: React.FC<UserFormProps> = ({
    invitation,
    title,
    buttonText,
    onSubmit
}) => {
    const { T } = useTranslation();

    const initialValues: UserFormData = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        invitationCode: ''
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, 'Too short').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Too short').required('Required'),
        passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
        ...(invitation ? {
            invitationCode: Yup.string().required('Required')
        } : {})
    });

    const onFormSubmit = ({
        passwordConfirm,
        invitationCode,
        ...data
    }: UserFormData) => {
        onSubmit({
            ...data,
            ...(invitation ? {
                invitationCode
            } : {})
        });
    };

    const filteredFieldList = invitation ? fieldList : (
        fieldList.filter(({ field }) => (
            field !== 'invitationCode'
        ))
    );

    return (
        <Paper elevation={3} className="box">
            <Typography variant="h6" gutterBottom>
                {title ?? 'New user'}
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit}
            >
                {({
                    errors,
                    touched,
                    handleChange,
                    handleBlur
                }) => (
                    <Form className="form small flex column center">
                        {filteredFieldList.map(({
                            field,
                            password
                        }) => (
                            <Field
                                key={field}
                                validateOnBlur
                                validateOnChange
                                name={field}
                            >
                                {() => (
                                    <TextField
                                        className="form-input"
                                        autoComplete="new-password"
                                        label={T(`user.${field}`)}
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
                            {buttonText ?? 'Create'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default UserForm;
