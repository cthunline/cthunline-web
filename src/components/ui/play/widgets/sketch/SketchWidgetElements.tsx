import React from 'react';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Tooltip,
    TextField,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemSecondaryAction
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { HiPlus } from 'react-icons/hi';
import { MdOutlineSave, MdOutlineDeleteOutline } from 'react-icons/md';

import { useApp } from '../../../../contexts/App';
import useUserSketch from '../../../../hooks/useUserSketch';
import { getAssetUrl } from '../../../../../services/api';
import { Asset, SketchData, SketchCreateBody } from '../../../../../types';

import './SketchWidget.css';

export interface ActionButtonData {
    text: string;
    icon: JSX.Element;
    handler: () => void;
}

export const ActionButton: React.FC<ActionButtonData> = ({
    text,
    handler,
    icon
}) => (
    <Tooltip placement="bottom" title={text}>
        <IconButton
            className="sketch-action-button ml-15 mr-15"
            size="medium"
            onClick={handler}
        >
            {icon}
        </IconButton>
    </Tooltip>
);

interface ImageListProps {
    assets: Asset[];
    onAdd: (src: string) => void;
}

export const ImageAssetList: React.FC<ImageListProps> = ({ assets, onAdd }) =>
    assets.length ? (
        <ImageList className="sketch-widget-assets full-width" cols={3} gap={5}>
            {assets.map(({ name, path }, index) => {
                const src = getAssetUrl(path);
                return (
                    <ImageListItem key={`asset-${index.toString()}`}>
                        <img
                            src={`${src}?w=248&fit=crop&auto=format`}
                            alt={name}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={name}
                            actionIcon={
                                <IconButton onClick={() => onAdd(src)}>
                                    <HiPlus />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>
    ) : null;

interface UserSketchFormProps {
    sketch: Omit<SketchData, 'events'>;
    onSubmit: (data: SketchCreateBody) => Promise<void>;
}

const userSketchValidationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short').required('Required')
});

export const UserSketchForm: React.FC<UserSketchFormProps> = ({
    sketch,
    onSubmit
}) => {
    const { T } = useApp();

    const initialValues: SketchCreateBody = {
        name: '',
        sketch
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={userSketchValidationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, handleChange, handleBlur }) => (
                <Form className="form small flex column center">
                    <Field validateOnBlur validateOnChange name="name">
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
                                    errors.name && touched.name && errors.name
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
                        {T('action.save')}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

interface UserSketchSelectorProps {
    onSelect: (sketchId: number) => void;
}

export const UserSketchSelector: React.FC<UserSketchSelectorProps> = ({
    onSelect
}) => {
    const { userSketchs, deleteUserSketch } = useUserSketch(true);

    const onDelete = async (sketchId: number) => {
        await deleteUserSketch({ sketchId });
    };

    return (
        <List>
            {userSketchs.map(({ id, name }) => (
                <ListItem
                    key={`user-sketch-${id}`}
                    secondaryAction={
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                size="medium"
                                color="error"
                                onClick={() => onDelete(id)}
                            >
                                <MdOutlineDeleteOutline />
                            </IconButton>
                        </ListItemSecondaryAction>
                    }
                    disablePadding
                >
                    <ListItemButton onClick={() => onSelect(id)}>
                        {name}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
