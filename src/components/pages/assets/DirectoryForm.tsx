import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    TextField,
    Button,
    Typography
} from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';

interface DirectoryFormProps {
    onSubmit: (name: string) => void;
}

interface DirectoryFormData {
    name: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required')
});

const initialValues: DirectoryFormData = {
    name: ''
};

const DirectoryForm: React.FC<DirectoryFormProps> = ({ onSubmit }) => {
    const onFormSubmit = async ({ name }: DirectoryFormData) => {
        onSubmit(name);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                New user
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
                        <Field
                            validateOnBlur
                            validateOnChange
                            name="name"
                        >
                            {() => (
                                <TextField
                                    className="form-input"
                                    label="Name"
                                    name="name"
                                    error={!!errors.name && !!touched.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={
                                        errors.name
                                        && touched.name
                                        && errors.name
                                    }
                                />
                            )}
                        </Field>
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
        </Box>
    );
};

export default DirectoryForm;
