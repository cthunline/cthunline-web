import type { AlienEquipment, AlienWeapon } from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiBolterGun } from 'react-icons/gi';

import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddWeaponRow from './AddWeaponRow.js';
import WeaponRow from './WeaponRow.js';

interface WeaponsProps {
    readonly: boolean;
    weapons: AlienEquipment['weapons'];
    onChange: (weapons: AlienEquipment['weapons']) => void;
    flex?: string | number;
}

const Weapons = ({ readonly, weapons, onChange, flex }: WeaponsProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onWeaponChange = (index: number, arm: AlienWeapon) => {
        onChange(weapons.map((a, idx) => (index === idx ? arm : a)));
    };

    const onWeaponCreate = (weapon: AlienWeapon) => {
        onChange([...weapons, weapon]);
    };

    const onWeaponMove = (index: number, action: MoveAction) => {
        const movedWeapons = arrayMoveUpDown(weapons, index, action);
        if (movedWeapons) {
            onChange(movedWeapons);
        }
    };

    const onWeaponDelete = (index: number) => {
        onChange(weapons.filter((_weapon, idx) => index !== idx));
    };

    return (
        <Stack gap="1rem" w="100%" flex={flex}>
            <SectionTitle
                iconBefore={<GiBolterGun size={20} />}
                text={T('game.alien.equipment.weapons.weapons')}
            />
            <Stack gap="1rem" w="100%">
                {weapons.map((weapon, index) => (
                    <WeaponRow
                        key={`weapon-row-${index.toString()}`}
                        readonly={readonly}
                        weapon={weapon}
                        onChange={(arm: AlienWeapon) => {
                            onWeaponChange(index, arm);
                        }}
                        onMove={(action) => {
                            onWeaponMove(index, action);
                        }}
                        onDelete={() => {
                            onWeaponDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddWeaponRow onCreate={onWeaponCreate} />}
            </Stack>
        </Stack>
    );
};

export default Weapons;
