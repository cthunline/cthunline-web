import type { WarhammerFantasyWeapon } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../../contexts/App.js';
import { onlyNumbers } from '../../../../../services/tools.js';
import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';

const weaponFormSchema = z.object({
    name: z.string().min(1),
    group: z.string(),
    encumbrance: z.preprocess((v) => Number(v), z.number().int()),
    rangeReach: z.string(),
    damage: z.string(),
    qualities: z.string()
});

type WeaponFormData = z.infer<typeof weaponFormSchema>;

const formId = 'weapon-add-form';

type AddWeaponRowProps = {
    onCreate: (weapon: WarhammerFantasyWeapon) => void;
};

const AddWeaponRow = ({ onCreate }: AddWeaponRowProps) => {
    const { T } = useApp();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<WeaponFormData>({
        validate: zodResolver(weaponFormSchema),
        initialValues: {
            name: '',
            group: '',
            encumbrance: 0,
            rangeReach: '',
            damage: '',
            qualities: ''
        }
    });

    const onFormSubmit = (weapon: WeaponFormData) => {
        onCreate(weapon);
        reset();
    };

    const encumbranceProps = getInputProps('encumbrance');

    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Stack w="100%" gap={0}>
                    <Form
                        id={formId}
                        onSubmit={handleSubmit(onFormSubmit)}
                        w={0}
                        h={0}
                    />
                    <Group w="100%" gap="0.5rem">
                        <Box flex="6 0">
                            <TextInput
                                {...getInputProps('name')}
                                variant="contained"
                                w="100%"
                                form={formId}
                                label={T('game.warhammerFantasy.weapon.name')}
                                size="sm"
                            />
                        </Box>
                        <Box flex="3 0">
                            <TextInput
                                {...getInputProps('group')}
                                variant="contained"
                                w="100%"
                                form={formId}
                                label={T('game.warhammerFantasy.weapon.group')}
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
                                    'game.warhammerFantasy.weapon.encumbrance'
                                )}
                                size="sm"
                                onChange={(e) => {
                                    encumbranceProps.onChange?.(
                                        Number(onlyNumbers(e.target.value))
                                    );
                                }}
                            />
                        </Box>
                        <Box flex="3 0">
                            <TextInput
                                {...getInputProps('rangeReach')}
                                variant="contained"
                                w="100%"
                                form={formId}
                                label={T(
                                    'game.warhammerFantasy.weapon.rangeReach'
                                )}
                                size="sm"
                            />
                        </Box>
                    </Group>
                </Stack>
                <Group w="100%" gap="0.5rem">
                    <Box flex="3 0">
                        <TextInput
                            {...getInputProps('damage')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.weapon.damage')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="11 0">
                        <TextInput
                            {...getInputProps('qualities')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.weapon.qualities')}
                            size="sm"
                        />
                    </Box>
                </Group>
            </Stack>
            <ActionIcon type="submit" form={formId}>
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default AddWeaponRow;
