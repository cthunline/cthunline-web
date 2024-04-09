import { type CoCWeapon } from '@cthunline/games';
import { Stack } from '@mantine/core';

import WeaponAdd from './WeaponAdd.js';
import Weapon from './Weapon.js';

interface WeaponsProps {
    weapons: CoCWeapon[];
    readonly: boolean;
    onChange: (index: number, data: CoCWeapon) => void;
    onDelete: (index: number) => void;
    onCreate: (data: CoCWeapon) => void;
}

const Weapons = ({
    weapons,
    readonly,
    onChange,
    onDelete,
    onCreate
}: WeaponsProps) => (
    <Stack w="100%" gap="1.5rem">
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
