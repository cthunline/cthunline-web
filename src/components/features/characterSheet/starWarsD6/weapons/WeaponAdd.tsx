import type { SWD6Weapon } from '@cthunline/games';
import { ActionIcon, Box, Group } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import { weaponFields } from './weapons.data.js';

interface WeaponAddProps {
    onSubmit: (data: SWD6Weapon) => void;
}

const defaultValues = {
    name: '',
    damage: '',
    shortRange: '',
    mediumRange: '',
    longRange: '',
    ammo: ''
};

const WeaponAdd = ({ onSubmit }: WeaponAddProps) => {
    const T = useLocaleStore(({ T }) => T);

    const [values, setValues] = useState<SWD6Weapon>(defaultValues);
    const [nameError, setNameError] = useState<boolean>(false);

    const controlForm = useCallback((): boolean => {
        const { name } = values;
        setNameError(!name);
        return !!name;
    }, [values]);

    const userChanged = useRef<boolean>(false);
    // biome-ignore lint/correctness/useExhaustiveDependencies: values is falsly pointed as unwanted dependency
    useEffect(() => {
        if (userChanged.current) {
            controlForm();
        }
    }, [controlForm, values]);

    return (
        <Group w="100%">
            {weaponFields.map(({ key, gridColumn }) => (
                <Box key={`weapon-add-${key}`} flex={`${gridColumn} 0`}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        size="sm"
                        label={T(`game.starWarsD6.weapon.${key}`)}
                        value={values[key]}
                        error={key === 'name' && nameError}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            userChanged.current = true;
                            setValues((previous) => ({
                                ...previous,
                                [key]: e.target.value
                            }));
                        }}
                    />
                </Box>
            ))}
            <ActionIcon
                onClick={() => {
                    if (controlForm()) {
                        onSubmit(values);
                        setValues(defaultValues);
                        userChanged.current = false;
                        setNameError(false);
                    }
                }}
            >
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default WeaponAdd;
