import { type SWD6Weapon } from '@cthunline/games';
import { Stack } from '@mantine/core';

import WeaponAdd from './WeaponAdd.js';
import Weapon from './Weapon.js';

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
        {!readonly ? <WeaponAdd onSubmit={onCreate} /> : null}
    </Stack>
);

export default Weapons;
