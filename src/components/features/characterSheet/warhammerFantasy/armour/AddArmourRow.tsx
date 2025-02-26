import type { WarhammerFantasyArmour } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';

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
    const T = useLocaleStore(({ T }) => T);

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

    const onFormSubmit = (armour: ArmourFormData) => {
        onCreate(armour);
        reset();
    };

    const encumbranceProps = getInputProps('encumbrance');
    const armourPointsProps = getInputProps('armourPoints');

    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Stack w="100%" gap={0}>
                    <Form id={formId} onSubmit={handleSubmit(onFormSubmit)} />
                    <Group w="100%" gap="0.5rem">
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
                                center
                                label={T(
                                    'game.warhammerFantasy.armour.locations'
                                )}
                                size="sm"
                            />
                        </Box>
                        <Box flex="2 0">
                            <TextInput
                                {...encumbranceProps}
                                variant="contained"
                                w="100%"
                                form={formId}
                                center
                                label={T(
                                    'game.warhammerFantasy.armour.encumbrance'
                                )}
                                size="sm"
                                onChange={(e) => {
                                    encumbranceProps.onChange?.(
                                        Number(onlyNumbers(e.target.value))
                                    );
                                }}
                            />
                        </Box>
                        <Box flex="2 0">
                            <TextInput
                                {...armourPointsProps}
                                variant="contained"
                                w="100%"
                                form={formId}
                                center
                                label={T(
                                    'game.warhammerFantasy.armour.armourPoints'
                                )}
                                size="sm"
                                onChange={(e) => {
                                    armourPointsProps.onChange?.(
                                        Number(onlyNumbers(e.target.value))
                                    );
                                }}
                            />
                        </Box>
                    </Group>
                </Stack>
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
