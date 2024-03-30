import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiPlusCircle } from 'react-icons/fi';
import { MdSaveAs } from 'react-icons/md';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import z from 'zod';
import {
    TextField,
    Stack,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText
} from '@mui/material';

import CustomDialog from '../../../../dialog/CustomDialog';
import { useDialog } from '../../../../../contexts/Dialog';
import { useApp } from '../../../../../contexts/App';
import {
    type SketchData,
    type SketchCreateBody,
    type SketchUpdateBody,
    type Sketch
} from '../../../../../../types';

const userSketchFormSchema = z.object({
    name: z.string().min(3)
});

type UserSketchFormData = z.infer<typeof userSketchFormSchema>;

interface UserSketchSaveModalProps {
    open: boolean;
    userSketchs: Sketch[];
    data: Omit<SketchData, 'events'>;
    onCreate: (data: SketchCreateBody) => void;
    onOverwrite: (sketchId: number, data: SketchUpdateBody) => void;
    onClose: () => void;
}

const UserSketchSaveModal = ({
    open,
    data,
    userSketchs,
    onCreate,
    onOverwrite,
    onClose
}: UserSketchSaveModalProps) => {
    const { T } = useApp();
    const { dialogPortalRef } = useDialog();

    const [overwriteSketchId, setOverwriteSketchId] = useState<number | null>(
        null
    );

    const { control, handleSubmit, reset } = useForm<UserSketchFormData>({
        resolver: zodResolver(userSketchFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const onFormSubmit = ({ name }: UserSketchFormData) => {
        onCreate({
            name,
            data
        });
    };

    useEffect(() => {
        if (open) {
            setOverwriteSketchId(null);
            reset();
        }
    }, [open, reset]);

    if (!dialogPortalRef.current) {
        return null;
    }

    if (overwriteSketchId) {
        return createPortal(
            <CustomDialog
                open={open}
                title={T('widget.sketch.overwriteSketchConfirm')}
                onConfirm={() => {
                    onOverwrite(overwriteSketchId, { data });
                }}
                onClose={() => setOverwriteSketchId(null)}
            />,
            dialogPortalRef.current
        );
    }

    return createPortal(
        <CustomDialog
            open={open}
            onClose={onClose}
            title={T('widget.sketch.saveSketch')}
            content={
                <Stack direction="column">
                    <Stack
                        component="form"
                        onSubmit={handleSubmit(onFormSubmit)}
                        direction="row"
                        gap="0.5rem"
                        padding="0.25rem 0"
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    className="form-input"
                                    label={T('common.name')}
                                    error={!!error}
                                    size="small"
                                    sx={{ flexGrow: 1 }}
                                />
                            )}
                        />
                        <IconButton type="submit" size="medium">
                            <FiPlusCircle />
                        </IconButton>
                    </Stack>
                    {!!userSketchs.length && (
                        <List>
                            {userSketchs.map(({ id, name }) => (
                                <ListItem
                                    key={`user-sketch-${id}`}
                                    secondaryAction={
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                size="medium"
                                                onClick={() =>
                                                    setOverwriteSketchId(id)
                                                }
                                            >
                                                <MdSaveAs />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    }
                                    disablePadding
                                >
                                    <ListItemText
                                        sx={{
                                            padding: '0.25rem 1rem',
                                            paddingRight: '4rem'
                                        }}
                                    >
                                        {name}
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Stack>
            }
        />,
        dialogPortalRef.current
    );
};

export default UserSketchSaveModal;
