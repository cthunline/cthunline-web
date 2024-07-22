import type { ApocalypseWorldDetailedListItem } from '@cthunline/games';
import { ActionIcon, Box, Checkbox, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../../contexts/App.js';
import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';
import Textarea from '../../../../common/Textarea.js';

const moveFormSchema = z.object({
    enabled: z.boolean(),
    title: z.string().min(1),
    description: z.string()
});

type MoveFormData = z.infer<typeof moveFormSchema>;

const formId = 'move-add-form';

type AddMoveRowProps = {
    onCreate: (otherMove: ApocalypseWorldDetailedListItem) => void;
};

const AddOtherMoveRow = ({ onCreate }: AddMoveRowProps) => {
    const { T } = useApp();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<MoveFormData>({
        validate: zodResolver(moveFormSchema),
        initialValues: {
            enabled: false,
            title: '',
            description: ''
        }
    });

    const onFormSubmit = async (move: MoveFormData) => {
        onCreate(move);
        reset();
    };

    const enabledCheckboxProps = getInputProps('enabled');

    return (
        <Stack w="100%" gap={0}>
            <Form
                id={formId}
                onSubmit={handleSubmit(onFormSubmit)}
                w={0}
                h={0}
            />
            <Stack w="100%" gap="1rem" align="center">
                <Group w="100%" gap="1rem" align="center">
                    <Checkbox
                        {...enabledCheckboxProps}
                        checked={enabledCheckboxProps.value}
                        form={formId}
                    />
                    <TextInput
                        {...getInputProps('title')}
                        variant="contained"
                        flex="1 0"
                        form={formId}
                        label={T('game.apocalypseWorld.element.title')}
                        size="sm"
                    />
                    <ActionIcon type="submit" form={formId}>
                        <FiPlusCircle />
                    </ActionIcon>
                </Group>
                <Group w="100%" gap="1rem" align="center">
                    <Box w="1.25rem" />
                    <Textarea
                        {...getInputProps('description')}
                        form={formId}
                        variant="contained"
                        flex="1 0"
                        size="sm"
                        label={T('game.apocalypseWorld.element.description')}
                    />
                    <Box w="1.75rem" />
                </Group>
            </Stack>
        </Stack>
    );
};

export default AddOtherMoveRow;
