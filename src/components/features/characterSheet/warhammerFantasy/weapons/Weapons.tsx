import { GiAxeSword } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyWeapon
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../contexts/App.js';
import AddWeaponRow from './AddWeaponRow.js';
import WeaponRow from './WeaponRow.js';

interface WeaponsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (weapon: Pick<WarhammerFantasyCharacter, 'weapons'>) => void;
}

const Weapons = ({ readonly, character, onChange }: WeaponsProps) => {
    const { T } = useApp();

    const onWeaponChange = (index: number, arm: WarhammerFantasyWeapon) => {
        onChange({
            weapons: character.weapons.map((a, idx) =>
                index === idx ? arm : a
            )
        });
    };

    const onWeaponCreate = (arm: WarhammerFantasyWeapon) => {
        onChange({
            weapons: [...character.weapons, arm]
        });
    };

    const onWeaponDelete = (index: number) => {
        onChange({
            weapons: character.weapons.filter((_weapon, idx) => index !== idx)
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiAxeSword size={20} />}
                text={T('game.warhammerFantasy.common.weapons')}
            />
            <Stack gap="1rem" w="100%">
                {character.weapons.map((weapon, index) => (
                    <WeaponRow
                        key={`weapon-row-${index.toString()}`}
                        readonly={readonly}
                        weapon={weapon}
                        onChange={(arm: WarhammerFantasyWeapon) => {
                            onWeaponChange(index, arm);
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
