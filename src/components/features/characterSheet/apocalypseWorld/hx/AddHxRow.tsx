import type { ApocalypseWorldHx } from '@cthunline/games';
import { ActionIcon, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../../contexts/App.js';
import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';

const hxFormSchema = z.object({
    character: z.string().min(1),
    value: z.string()
});

type HxFormData = z.infer<typeof hxFormSchema>;

const formId = 'hx-add-form';

type AddHxRowProps = {
    onAdd: (hx: ApocalypseWorldHx) => void;
};

const AddHxRow = ({ onAdd }: AddHxRowProps) => {
    const { T } = useApp();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<HxFormData>({
        validate: zodResolver(hxFormSchema),
        initialValues: {
            character: '',
            value: ''
        }
    });

    const onFormSubmit = async (hx: HxFormData) => {
        onAdd(hx);
        reset();
    };

    return (
        <Stack w="100%" gap={0}>
            <Form
                id={formId}
                onSubmit={handleSubmit(onFormSubmit)}
                w={0}
                h={0}
            />
            <Group w="100%" gap="1rem">
                <TextInput
                    {...getInputProps('character')}
                    variant="contained"
                    flex="1 0"
                    form={formId}
                    label={T('game.apocalypseWorld.hx.character')}
                    size="sm"
                />
                <TextInput
                    {...getInputProps('value')}
                    variant="contained"
                    w="5rem"
                    form={formId}
                    label={T('game.apocalypseWorld.hx.value')}
                    size="sm"
                />
                <ActionIcon type="submit" form={formId}>
                    <FiPlusCircle />
                </ActionIcon>
            </Group>
        </Stack>
    );
};

export default AddHxRow;
