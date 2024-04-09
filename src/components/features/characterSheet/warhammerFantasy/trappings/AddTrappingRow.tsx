import { type WarhammerFantasyTrapping } from '@cthunline/games';
import { zodResolver } from 'mantine-form-zod-resolver';
import { ActionIcon, Box, Group } from '@mantine/core';
import { FiPlusCircle } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import z from 'zod';

import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';
import Form from '../../../../common/Form.js';

const trappingFormSchema = z.object({
    name: z.string().min(1),
    encumbrance: z.preprocess((v) => Number(v), z.number().int())
});

type TrappingFormData = z.infer<typeof trappingFormSchema>;

const formId = 'trapping-add-form';

type AddTrappingRowProps = {
    onCreate: (trapping: WarhammerFantasyTrapping) => void;
};

const AddTrappingRow = ({ onCreate }: AddTrappingRowProps) => {
    const { T } = useApp();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<TrappingFormData>({
        validate: zodResolver(trappingFormSchema),
        initialValues: {
            name: '',
            encumbrance: 0
        }
    });

    const onFormSubmit = async (trapping: TrappingFormData) => {
        onCreate(trapping);
        reset();
    };

    return (
        <Group w="100%">
            <Form id={formId} onSubmit={handleSubmit(onFormSubmit)} />
            <Box flex="7 0">
                <TextInput
                    {...getInputProps('name')}
                    variant="contained"
                    w="100%"
                    form={formId}
                    label={T('game.warhammerFantasy.trapping.name')}
                    size="sm"
                />
            </Box>
            <Box flex="1 0">
                <TextInput
                    {...getInputProps('encumbrance')}
                    variant="contained"
                    w="100%"
                    form={formId}
                    ta="center"
                    label={T('game.warhammerFantasy.trapping.encumbrance')}
                    size="sm"
                />
            </Box>
            <ActionIcon type="submit" form={formId}>
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default AddTrappingRow;
