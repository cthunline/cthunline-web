import React, { memo } from 'react';
import {
    Box,
    TextField,
    IconButton
} from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { CoCWeapon } from '../../../../../../types/games/callOfCthulhu';
import { weaponKeys } from './weapons.data';

interface WeaponProps {
    index: number;
    data: CoCWeapon;
    readonly: boolean;
    onChange: (index: number, data: CoCWeapon) => void;
    onDelete: (index: number) => void;
}
/*
"name" : "Unarmed",
"damage" : "1D3 + DB",
"attacks" : "1",
"range" : "",
"ammo" : "",
"malfunction" : 0
*/
const Weapon: React.FC<WeaponProps> = ({
    index,
    data,
    readonly,
    onChange,
    onDelete
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(24, 1fr)"
    >
        <Box gridColumn="span 8" display="grid" alignItems="center">
            {data.name}
        </Box>
        {weaponKeys.map(({ key, label, gridColumn }) => (
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
                    label={label}
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
        <Box gridColumn="span 2" alignItems="center">
            <IconButton
                size="medium"
                color="error"
                onClick={() => onDelete(index)}
            >
                <MdOutlineDeleteOutline />
            </IconButton>
        </Box>
    </Box>
);

export default memo(Weapon);
