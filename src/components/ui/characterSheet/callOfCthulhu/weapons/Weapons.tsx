import { Box } from '@mui/material';
import { CoCWeapon } from '@cthunline/games';

import Weapon from './Weapon';
import WeaponAdd from './WeaponAdd';

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
        {!readonly ? <WeaponAdd onSubmit={onCreate} /> : null}
    </Box>
);

export default Weapons;
