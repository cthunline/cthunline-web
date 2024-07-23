import type { SWD6Weapon } from '@cthunline/games';
import { Stack } from '@mantine/core';

import Weapon from './Weapon.js';
import WeaponAdd from './WeaponAdd.js';

interface WeaponsProps {
    weapons: SWD6Weapon[];
    readonly: boolean;
    onChange: (index: number, data: SWD6Weapon) => void;
    onDelete: (index: number) => void;
    onCreate: (data: SWD6Weapon) => void;
}

const Weapons = ({
    weapons,
    readonly,
    onChange,
    onDelete,
    onCreate
}: WeaponsProps) => (
    <Stack w="100%">
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
        {readonly ? null : <WeaponAdd onSubmit={onCreate} />}
    </Stack>
);

export default Weapons;
