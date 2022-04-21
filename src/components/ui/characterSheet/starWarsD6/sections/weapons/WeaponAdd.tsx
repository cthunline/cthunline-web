import React, {
    useCallback,
    useEffect,
    useState,
    useRef
} from 'react';
import {
    Box,
    TextField,
    IconButton
} from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';

import { useTranslation } from '../../../../../contexts/Translation';
import { SWD6Weapon } from '../../../../../../types/games/starWarsD6';
import { weaponFields } from './weapons.data';

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

const WeaponAdd: React.FC<WeaponAddProps> = ({ onSubmit }) => {
    const { T } = useTranslation();

    const [values, setValues] = useState<SWD6Weapon>(defaultValues);
    const [nameError, setNameError] = useState<boolean>(false);

    const controlForm = useCallback((): boolean => {
        const { name } = values;
        setNameError(!name);
        return !!name;
    }, [values]);

    const userChanged = useRef<boolean>(false);
    useEffect(() => {
        if (userChanged.current) {
            controlForm();
        }
    }, [
        controlForm,
        values
    ]);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(15, 1fr)"
            gap={1}
        >
            {weaponFields.map(({ key, gridColumn }) => (
                <Box
                    key={`weapon-add-${key}`}
                    gridColumn={`span ${gridColumn}`}
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        type="text"
                        size="small"
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
            <Box gridColumn="span 1" alignItems="center">
                <IconButton
                    size="medium"
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
                </IconButton>
            </Box>
        </Box>
    );
};

export default WeaponAdd;
