import { type WarhammerFantasyTrapping } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import z from 'zod';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../../contexts/App.js';
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

    const encumbranceProps = getInputProps('encumbrance');

    return (
        <Stack w="100%" gap={0}>
            <Form id={formId} onSubmit={handleSubmit(onFormSubmit)} />
            <Group w="100%" gap="0.5rem">
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
                        {...encumbranceProps}
                        variant="contained"
                        w="100%"
                        form={formId}
                        center
                        label={T('game.warhammerFantasy.trapping.encumbrance')}
                        size="sm"
                        onChange={(e) => {
                            encumbranceProps.onChange?.(
                                Number(onlyNumbers(e.target.value))
                            );
                        }}
                    />
                </Box>
                <ActionIcon type="submit" form={formId}>
                    <FiPlusCircle />
                </ActionIcon>
            </Group>
        </Stack>
    );
};

export default AddTrappingRow;
