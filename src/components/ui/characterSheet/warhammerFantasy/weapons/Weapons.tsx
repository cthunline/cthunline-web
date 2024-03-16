import Grid from '@mui/material/Unstable_Grid2';
import { GiAxeSword } from 'react-icons/gi';
import { Stack } from '@mui/material';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyWeapon
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import AddWeaponRow from './AddWeaponRow';
import WeaponRow from './WeaponRow';

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
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiAxeSword size={20} />}
                text={T('game.warhammerFantasy.common.weapons')}
            />
            <Grid container columns={readonly ? 14 : 15} spacing={2}>
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
            </Grid>
        </Stack>
    );
};

export default Weapons;
