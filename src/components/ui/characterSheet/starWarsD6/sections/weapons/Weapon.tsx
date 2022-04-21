import React, { memo } from 'react';
import {
    Box,
    TextField,
    IconButton
} from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { useApp } from '../../../../../contexts/App';
import { SWD6Weapon } from '../../../../../../types/games/starWarsD6';
import { weaponFields } from './weapons.data';

interface WeaponProps {
    index: number;
    data: SWD6Weapon;
    readonly: boolean;
    onChange: (index: number, data: SWD6Weapon) => void;
    onDelete: (index: number) => void;
}

const Weapon: React.FC<WeaponProps> = ({
    index,
    data,
    readonly,
    onChange,
    onDelete
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(15, 1fr)"
            gap={1}
        >
            {weaponFields.map(({ key, gridColumn }) => (
                <Box
                    key={`weapon-${key}`}
                    gridColumn={`span ${gridColumn}`}
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={T(`game.starWarsD6.weapon.${key}`)}
                        value={data[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(index, {
                                ...data,
                                [key]: e.target.value
                            });
                        }}
                    />
                </Box>
            ))}
            {readonly ? null : (
                <Box gridColumn="span 1" alignItems="center">
                    <IconButton
                        size="medium"
                        color="error"
                        onClick={() => onDelete(index)}
                    >
                        <MdOutlineDeleteOutline />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default memo(Weapon);
