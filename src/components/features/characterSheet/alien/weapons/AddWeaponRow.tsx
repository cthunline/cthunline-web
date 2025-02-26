import type { AlienWeapon } from '@cthunline/games';
import { ActionIcon, Box, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';

const weaponFormSchema = z.object({
    name: z.string().min(1),
    bonus: z.preprocess((v) => Number(v), z.number().int()),
    damage: z.preprocess((v) => Number(v), z.number().int()),
    range: z.string()
});

type WeaponFormData = z.infer<typeof weaponFormSchema>;

const formId = 'weapon-add-form';

type AddWeaponRowProps = {
    onCreate: (weapon: AlienWeapon) => void;
};

const AddWeaponRow = ({ onCreate }: AddWeaponRowProps) => {
    const T = useLocaleStore(({ T }) => T);

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<WeaponFormData>({
        validate: zodResolver(weaponFormSchema),
        initialValues: {
            name: '',
            bonus: 0,
            damage: 0,
            range: ''
        }
    });

    const onFormSubmit = (weapon: WeaponFormData) => {
        onCreate(weapon);
        reset();
    };

    const bonusProps = getInputProps('bonus');
    const damageProps = getInputProps('damage');

    return (
        <Group w="100%" gap={0}>
            <Form
                id={formId}
                onSubmit={handleSubmit(onFormSubmit)}
                w={0}
                h={0}
            />
            <Group w="100%" gap="1rem">
                <Box flex="6 0">
                    <TextInput
                        {...getInputProps('name')}
                        variant="contained"
                        w="100%"
                        form={formId}
                        label={T('game.alien.equipment.weapons.name')}
                        size="sm"
                    />
                </Box>
                <Box flex="2 0">
                    <TextInput
                        {...bonusProps}
                        variant="contained"
                        w="100%"
                        form={formId}
                        center
                        label={T('game.alien.equipment.weapons.bonus')}
                        size="sm"
                        onChange={(e) => {
                            bonusProps.onChange?.(
                                Number(onlyNumbers(e.target.value))
                            );
                        }}
                    />
                </Box>
                <Box flex="2 0">
                    <TextInput
                        {...damageProps}
                        variant="contained"
                        w="100%"
                        form={formId}
                        center
                        label={T('game.alien.equipment.weapons.damage')}
                        size="sm"
                        onChange={(e) => {
                            damageProps.onChange?.(
                                Number(onlyNumbers(e.target.value))
                            );
                        }}
                    />
                </Box>
                <Box flex="3 0">
                    <TextInput
                        {...getInputProps('range')}
                        variant="contained"
                        w="100%"
                        form={formId}
                        label={T('game.alien.equipment.weapons.range')}
                        size="sm"
                    />
                </Box>
                <ActionIcon type="submit" form={formId}>
                    <FiPlusCircle />
                </ActionIcon>
            </Group>
        </Group>
    );
};

export default AddWeaponRow;
