import { type WarhammerFantasyArmour } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import z from 'zod';

import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';
import Form from '../../../../common/Form.js';

const armourFormSchema = z.object({
    name: z.string().min(1),
    locations: z.string(),
    encumbrance: z.preprocess((v) => Number(v), z.number().int()),
    armourPoints: z.preprocess((v) => Number(v), z.number().int()),
    qualities: z.string()
});

type ArmourFormData = z.infer<typeof armourFormSchema>;

const formId = 'armour-add-form';

type AddArmourRowProps = {
    onCreate: (armour: WarhammerFantasyArmour) => void;
};

const AddArmourRow = ({ onCreate }: AddArmourRowProps) => {
    const { T } = useApp();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<ArmourFormData>({
        validate: zodResolver(armourFormSchema),
        initialValues: {
            name: '',
            locations: '',
            encumbrance: 0,
            armourPoints: 0,
            qualities: ''
        }
    });

    const onFormSubmit = async (armour: ArmourFormData) => {
        onCreate(armour);
        reset();
    };

    return (
        <Group w="100%" gap="0.25rem">
            <Stack w="100%" gap="0.25rem">
                <Group w="100%" gap="0.25rem">
                    <Form id={formId} onSubmit={handleSubmit(onFormSubmit)} />
                    <Box flex="6 0">
                        <TextInput
                            {...getInputProps('name')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.armour.name')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="4 0">
                        <TextInput
                            {...getInputProps('locations')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            ta="center"
                            label={T('game.warhammerFantasy.armour.locations')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="2 0">
                        <TextInput
                            {...getInputProps('encumbrance')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            ta="center"
                            label={T(
                                'game.warhammerFantasy.armour.encumbrance'
                            )}
                            size="sm"
                        />
                    </Box>
                    <Box flex="2 0">
                        <TextInput
                            {...getInputProps('armourPoints')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            ta="center"
                            label={T(
                                'game.warhammerFantasy.armour.armourPoints'
                            )}
                            size="sm"
                        />
                    </Box>
                </Group>
                <TextInput
                    {...getInputProps('qualities')}
                    variant="contained"
                    w="100%"
                    form={formId}
                    label={T('game.warhammerFantasy.armour.qualities')}
                    size="sm"
                />
            </Stack>
            <ActionIcon type="submit" form={formId}>
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default AddArmourRow;
