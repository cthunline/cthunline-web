import React from 'react';
import {
    Formik,
    Form,
    Field,
    FormikHelpers
} from 'formik';
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
import { useTranslation } from '../../contexts/Translation';

interface PasswordChangeData {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

type PasswordChangeField = keyof PasswordChangeData;

interface PasswordChangeFieldData {
    field: PasswordChangeField;
    textKey: string;
    preventComplete?: boolean;
}

const fieldList: PasswordChangeFieldData[] = [{
    field: 'oldPassword',
    textKey: 'oldPassword'
}, {
    field: 'password',
    textKey: 'newPassword',
    preventComplete: true
}, {
    field: 'passwordConfirm',
    textKey: 'newPasswordConfirm',
    preventComplete: true
}];

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().min(6, 'Too short').required('Required'),
    password: Yup.string().min(6, 'Too short').required('Required'),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Profile = () => {
    const { user } = useAuth();
    const { T } = useTranslation();
    const { editUser } = useUser();

    const initialValues: PasswordChangeData = {
        oldPassword: '',
        password: '',
        passwordConfirm: ''
    };

    const onSubmit = async ({
        oldPassword,
        password
    }: PasswordChangeData, {
        resetForm
    }: FormikHelpers<PasswordChangeData>) => {
        await editUser({
            userId: user?.id ?? '',
            data: {
                oldPassword,
                password
            }
        });
        resetForm();
    };

    return (
        <Paper elevation={3} className="box">
            <Typography variant="h6" gutterBottom>
                {T('page.profile.changePassword')}
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
                    handleBlur,
                    values
                }) => (
                    <Form className="form small flex column center">
                        {fieldList.map(({ field, textKey, preventComplete }) => (
                            <Field
                                key={field}
                                validateOnBlur
                                validateOnChange
                                name={field}
                            >
                                {() => (
                                    <TextField
                                        className="form-input"
                                        autoComplete={preventComplete ? 'new-password' : ''}
                                        label={T(`page.profile.${textKey}`)}
                                        name={field}
                                        type="password"
                                        value={values[field]}
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
                            {T('action.save')}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default Profile;
