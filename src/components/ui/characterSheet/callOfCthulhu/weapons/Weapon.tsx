import React, { memo } from 'react';
import {
    Box,
    TextField,
    IconButton
} from '@mui/material';
import { CoCWeapon } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { useApp } from '../../../../contexts/App';
import { weaponKeys } from './weapons.data';

interface WeaponProps {
    index: number;
    data: CoCWeapon;
    readonly: boolean;
    onChange: (index: number, data: CoCWeapon) => void;
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
            gridTemplateColumns="repeat(24, 1fr)"
            alignItems="center"
        >
            <Box gridColumn={`span ${readonly ? '10' : '8'}`}>
                {data.name}
            </Box>
            {weaponKeys.map(({ key, gridColumn }) => (
                <Box key={`weapon-${key}`} gridColumn={`span ${gridColumn}`}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={T(`game.callOfCthulhu.weapon.${key}`)}
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
                <Box gridColumn="span 2">
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
