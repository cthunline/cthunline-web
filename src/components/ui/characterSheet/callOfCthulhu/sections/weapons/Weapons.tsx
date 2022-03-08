import React, { memo } from 'react';
import { Box } from '@mui/material';

import { CoCWeapon } from '../../../../../../types/games/callOfCthulhu';
import Weapon from './Weapon';
import WeaponAdd from './WeaponAdd';

interface WeaponsProps {
    weapons: CoCWeapon[];
    readonly: boolean;
    onChange: (index: number, data: CoCWeapon) => void;
    onDelete: (index: number) => void;
    onCreate: (data: CoCWeapon) => void;
}

const Weapons: React.FC<WeaponsProps> = ({
    weapons,
    readonly,
    onChange,
    onDelete,
    onCreate
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
    >
        {weapons.map((weapon, index) => (
            <Weapon
                key={`weapon-${index.toString()}`}
                index={index}
                data={weapon}
                readonly={readonly}
                onChange={onChange}
                onDelete={onDelete}
            />
        ))}
        {!readonly ? (
            <WeaponAdd onSubmit={onCreate} />
        ) : null}
    </Box>
);

export default memo(Weapons);
