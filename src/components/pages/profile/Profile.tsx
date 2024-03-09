import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';

import useUser from '../../hooks/useUser';
import { useApp } from '../../contexts/App';
import Selector from '../../ui/selector/Selector';
import { Theme, Locale, languages } from '../../../types';
import { ucfirst } from '../../../services/tools';

interface ProfileData {
    theme: Theme;
    locale: Locale;
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

type ProfileField = keyof ProfileData;

interface ProfileFieldData {
    field: ProfileField;
    textKey: string;
    preventAutoComplete?: boolean;
}

const passwordChangeFieldList: ProfileFieldData[] = [
    {
        field: 'oldPassword',
        textKey: 'oldPassword'
    },
    {
        field: 'password',
        textKey: 'newPassword',
        preventAutoComplete: true
    },
    {
        field: 'passwordConfirm',
        textKey: 'newPasswordConfirm',
        preventAutoComplete: true
    }
];

const validationSchema = Yup.object().shape(
    {
        oldPassword: Yup.string()
            .min(6, 'Too short')
            .when('password', {
                is: (val: string) => !!val,
                then: (schema) => schema.required('Required')
            }),
        password: Yup.string()
            .min(6, 'Too short')
            .when('oldPassword', {
                is: (val: string) => !!val,
                then: (schema) => schema.required('Required')
            }),
        passwordConfirm: Yup.string()
            .when('password', {
                is: (val: string) => !!val,
                then: (schema) => schema.required('Required')
            })
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    },
    [
        ['oldPassword', 'password'],
        ['password', 'passwordConfirm']
    ]
);

const themeOptions = [
    { name: ucfirst(Theme.dark), value: Theme.dark },
    { name: ucfirst(Theme.light), value: Theme.light }
];

const languageOptions = Object.entries(languages).map(([value, name]) => ({
    name: ucfirst(name),
    value
}));

const Profile = () => {
    const { T, user, refreshUser } = useApp();
    const { editUser } = useUser();

    const initialValues: ProfileData = {
        theme: user?.theme ?? Theme.dark,
        locale: user?.locale ?? Locale.en,
        oldPassword: '',
        password: '',
        passwordConfirm: ''
    };

    const onSubmit = async (
        { theme, locale, oldPassword, password }: ProfileData,
        { resetForm }: FormikHelpers<ProfileData>
    ) => {
        await editUser({
            userId: Number(user?.id),
            data: {
                theme,
                locale,
                ...(oldPassword && password
                    ? {
                          oldPassword,
                          password
                      }
                    : {})
            }
        });
        resetForm({
            values: {
                ...initialValues,
                theme,
                locale
            }
        });
        refreshUser();
    };

    return (
        <Paper elevation={3} className="p-25">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                    <Form className="form medium flex column center">
                        <Box className="flex row full-width">
                            <Box className="half mr-10">
                                <Typography
                                    className="full-width"
                                    variant="h6"
                                    gutterBottom
                                >
                                    {T('common.theme')}
                                </Typography>
                                <Field
                                    validateOnBlur
                                    validateOnChange
                                    name="theme"
                                >
                                    {() => (
                                        <Selector
                                            className="form-input"
                                            name="theme"
                                            options={themeOptions}
                                            value={values.theme}
                                            onChange={handleChange}
                                            error={errors.theme}
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Box className="half ml-10">
                                <Typography
                                    className="full-width"
                                    variant="h6"
                                    gutterBottom
                                >
                                    {T('common.language')}
                                </Typography>
                                <Field
                                    validateOnBlur
                                    validateOnChange
                                    name="locale"
                                >
                                    {() => (
                                        <Selector
                                            className="form-input"
                                            name="locale"
                                            options={languageOptions}
                                            value={values.locale}
                                            onChange={handleChange}
                                            error={errors.locale}
                                        />
                                    )}
                                </Field>
                            </Box>
                        </Box>
                        <Typography
                            className="full-width mt-10"
                            variant="h6"
                            gutterBottom
                        >
                            {T('page.profile.changePassword')}
                        </Typography>
                        {passwordChangeFieldList.map(
                            ({ field, textKey, preventAutoComplete }) => (
                                <Field
                                    key={field}
                                    validateOnBlur
                                    validateOnChange
                                    name={field}
                                >
                                    {() => (
                                        <TextField
                                            className="form-input full-width"
                                            autoComplete={
                                                preventAutoComplete
                                                    ? 'new-password'
                                                    : ''
                                            }
                                            label={T(`page.profile.${textKey}`)}
                                            name={field}
                                            type="password"
                                            value={values[field]}
                                            error={
                                                !!errors[field] &&
                                                !!touched[field]
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={
                                                errors[field] &&
                                                touched[field] &&
                                                errors[field]
                                            }
                                        />
                                    )}
                                </Field>
                            )
                        )}
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
