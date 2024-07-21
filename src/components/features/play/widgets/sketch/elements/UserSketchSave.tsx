import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import { MdSaveAs } from 'react-icons/md';
import z from 'zod';

import { useApp } from '../../../../../../contexts/App.js';
import type {
    Sketch,
    SketchCreateBody,
    SketchData,
    SketchUpdateBody
} from '../../../../../../types/index.js';
import Form from '../../../../../common/Form.js';
import TextInput from '../../../../../common/TextInput.js';

const userSketchFormSchema = z.object({
    name: z.string().min(3)
});

type UserSketchFormData = z.infer<typeof userSketchFormSchema>;

interface UserSketchSaveProps {
    userSketchs: Sketch[];
    data: Omit<SketchData, 'events'>;
    onCreate: (data: SketchCreateBody) => void;
    onOverwrite: (sketchId: number, data: SketchUpdateBody) => void;
}

const UserSketchSave = ({
    data,
    userSketchs,
    onCreate,
    onOverwrite
}: UserSketchSaveProps) => {
    const { T } = useApp();

    const { onSubmit: handleSubmit, getInputProps } =
        useForm<UserSketchFormData>({
            validate: zodResolver(userSketchFormSchema),
            initialValues: {
                name: ''
            }
        });

    const onFormSubmit = ({ name }: UserSketchFormData) => {
        onCreate({
            name,
            data
        });
    };

    const handleOverwrite = (sketchId: number) => {
        modals.openConfirmModal({
            centered: true,
            title: T('widget.sketch.overwriteSketchConfirm'),
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                onOverwrite(sketchId, { data });
            }
        });
    };

    return (
        <Stack>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
                <Group gap="0.5rem" py="0.25rem">
                    <TextInput
                        {...getInputProps('name')}
                        variant="contained"
                        label={T('common.name')}
                        flex={1}
                    />
                    <ActionIcon type="submit">
                        <FiPlusCircle />
                    </ActionIcon>
                </Group>
            </Form>
            {!!userSketchs.length && (
                <Stack>
                    {userSketchs.map(({ id, name }) => (
                        <Group key={`user-sketch-${id}`}>
                            <Box flex={1}>{name}</Box>
                            <ActionIcon
                                onClick={() => {
                                    handleOverwrite(id);
                                }}
                            >
                                <MdSaveAs />
                            </ActionIcon>
                        </Group>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

export default UserSketchSave;
