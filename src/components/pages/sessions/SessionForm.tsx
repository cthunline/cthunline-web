import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Paper,
    TextField,
    Button,
    Typography
} from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';

import Selector from '../../ui/selector/Selector';
import { SessionCreateBody } from '../../../types';
import useGame from '../../hooks/useGame';
import useSession from '../../hooks/useSession';

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short').required('Required'),
    gameId: Yup.string().required('Required')
});

const SessionForm = () => {
    const navigate = useNavigate();
    const { gameList } = useGame();
    const { createSession } = useSession();

    const initialValues: SessionCreateBody = {
        gameId: '',
        name: ''
    };

    const onSubmit = async (data: SessionCreateBody) => {
        await createSession({ data });
        navigate('/sessions');
    };

    const gameOptions = gameList.map(({ id, name }) => ({
        name,
        value: id
    }));

    return (
        <Paper elevation={3} className="box">
            <Typography variant="h6" gutterBottom>
                New session
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({
                    values,
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
                                    autoComplete="new-password"
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
                        <Field
                            validateOnBlur
                            validateOnChange
                            name="gameId"
                        >
                            {() => (
                                <Selector
                                    label="Game"
                                    name="gameId"
                                    options={gameOptions}
                                    value={values.gameId}
                                    onChange={handleChange}
                                    error={errors.gameId}
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
        </Paper>
    );
};

export default SessionForm;
