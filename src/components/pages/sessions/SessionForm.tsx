import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';

import { useApp } from '../../contexts/App';
import Selector from '../../ui/selector/Selector';
import { SessionCreateBody } from '../../../types';
import useGame from '../../hooks/useGame';

interface SessionFormProps {
    onSubmit: (data: SessionCreateBody) => Promise<void>;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short').required('Required'),
    gameId: Yup.string().required('Required')
});

const SessionForm: React.FC<SessionFormProps> = ({ onSubmit }) => {
    const { T } = useApp();
    const { gameList } = useGame();

    const initialValues: SessionCreateBody = {
        gameId: '',
        name: ''
    };

    const gameOptions = gameList.map(({ id, name }) => ({
        name,
        value: id
    }));

    return (
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
                                label={T('common.name')}
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
                                label={T('entity.game')}
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
                        {T('action.create')}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default SessionForm;
