import { useCallback, useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';
import { CoCWeapon } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { weaponAddKeys } from './weapons.data';

interface WeaponAddProps {
    onSubmit: (data: CoCWeapon) => void;
}

interface WeaponErrors {
    name: boolean;
    damage: boolean;
    attacks: boolean;
    range: boolean;
}

const defaultValues = {
    name: '',
    damage: '',
    attacks: '',
    range: '',
    ammo: '',
    malfunction: ''
};

const defaultErrors = {
    name: false,
    damage: false,
    attacks: false,
    range: false
};

const WeaponAdd = ({ onSubmit }: WeaponAddProps) => {
    const { T } = useApp();

    const [values, setValues] = useState<CoCWeapon>(defaultValues);
    const [errors, setErrors] = useState<WeaponErrors>(defaultErrors);

    const controlForm = useCallback((): boolean => {
        const { name, damage, attacks, range } = values;
        setErrors({
            name: !name,
            damage: !damage,
            attacks: !attacks,
            range: !range
        });
        return !!name && !!damage && !!attacks && !!range;
    }, [values]);

    const initialRender = useRef<boolean>(true);
    useEffect(() => {
        if (!initialRender.current) {
            const updatedErrors: Partial<WeaponErrors> = {};
            if (values.name) {
                updatedErrors.name = false;
            }
            if (values.damage) {
                updatedErrors.damage = false;
            }
            if (values.attacks) {
                updatedErrors.attacks = false;
            }
            if (values.range) {
                updatedErrors.range = false;
            }
            setErrors((previous) => ({
                ...previous,
                ...updatedErrors
            }));
        } else {
            initialRender.current = false;
        }
    }, [values]);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(24, 1fr)"
            alignItems="center"
        >
            {weaponAddKeys.map(({ key, gridColumn }) => (
                <Box
                    key={`weapon-add-${key}`}
                    gridColumn={`span ${gridColumn}`}
                >
                    <TextField
                        fullWidth
                        InputProps={{
                            classes: {
                                input: 'input-smaller-text'
                            }
                        }}
                        type="text"
                        size="small"
                        label={T(`game.callOfCthulhu.weapon.${key}`)}
                        value={values[key]}
                        error={
                            Object.keys(errors).includes(key)
                                ? errors[key as keyof WeaponErrors]
                                : false
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setValues((previous) => ({
                                ...previous,
                                [key]: e.target.value
                            }));
                        }}
                    />
                </Box>
            ))}
            <Box gridColumn="span 2">
                <IconButton
                    size="medium"
                    onClick={() => {
                        if (controlForm()) {
                            onSubmit(values);
                            setValues(defaultValues);
                        }
                    }}
                >
                    <FiPlusCircle />
                </IconButton>
            </Box>
        </Box>
    );
};

export default WeaponAdd;
