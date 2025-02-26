import type { SWD6Weapon } from '@cthunline/games';
import { ActionIcon, Box, Group } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import { weaponFields } from './weapons.data.js';

interface WeaponProps {
    index: number;
    data: SWD6Weapon;
    readonly: boolean;
    onChange: (index: number, data: SWD6Weapon) => void;
    onDelete: (index: number) => void;
}

const Weapon = ({ index, data, readonly, onChange, onDelete }: WeaponProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Group w="100%">
            {weaponFields.map(({ key, gridColumn }) => (
                <Box key={`weapon-${key}`} flex={`${gridColumn} 0`}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly}
                        size="sm"
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
            {!readonly && (
                <ActionIcon color="red" onClick={() => onDelete(index)}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default Weapon;
