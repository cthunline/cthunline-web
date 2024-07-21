import type { CoCWeapon } from '@cthunline/games';
import { ActionIcon, Box, Group } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { useApp } from '../../../../../contexts/App.js';
import TextInput from '../../../../common/TextInput.js';
import { weaponKeys } from './weapons.data.js';

interface WeaponProps {
    index: number;
    data: CoCWeapon;
    readonly: boolean;
    onChange: (index: number, data: CoCWeapon) => void;
    onDelete: (index: number) => void;
}

const Weapon = ({ index, data, readonly, onChange, onDelete }: WeaponProps) => {
    const { T } = useApp();

    return (
        <Group w="100%" gap="0.5rem">
            <Box flex={`${readonly ? '10' : '8'} 0`}>{data.name}</Box>
            {weaponKeys.map(({ key, gridColumn }) => (
                <Box key={`weapon-${key}`} flex={`${gridColumn} 0`}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly
                        size="sm"
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
                <Box flex="1 0">
                    <ActionIcon color="red" onClick={() => onDelete(index)}>
                        <MdOutlineDeleteOutline />
                    </ActionIcon>
                </Box>
            )}
        </Group>
    );
};

export default Weapon;
