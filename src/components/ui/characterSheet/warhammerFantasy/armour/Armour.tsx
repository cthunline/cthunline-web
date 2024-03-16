import Grid from '@mui/material/Unstable_Grid2';
import { GiChestArmor } from 'react-icons/gi';
import { Stack } from '@mui/material';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyArmour
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import AddArmourRow from './AddArmourRow';
import ArmourRow from './ArmourRow';

interface ArmourProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (armour: Pick<WarhammerFantasyCharacter, 'armour'>) => void;
}

const Armour = ({ readonly, character, onChange }: ArmourProps) => {
    const { T } = useApp();

    const onArmourChange = (index: number, arm: WarhammerFantasyArmour) => {
        onChange({
            armour: character.armour.map((a, idx) => (index === idx ? arm : a))
        });
    };

    const onArmourCreate = (arm: WarhammerFantasyArmour) => {
        onChange({
            armour: [...character.armour, arm]
        });
    };

    const onArmourDelete = (index: number) => {
        onChange({
            armour: character.armour.filter((_armour, idx) => index !== idx)
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiChestArmor size={20} />}
                text={T('game.warhammerFantasy.common.armour')}
            />
            <Grid container columns={readonly ? 14 : 15} spacing={2}>
                {character.armour.map((armour, index) => (
                    <ArmourRow
                        key={`armour-row-${index.toString()}`}
                        readonly={readonly}
                        armour={armour}
                        onChange={(arm: WarhammerFantasyArmour) => {
                            onArmourChange(index, arm);
                        }}
                        onDelete={() => {
                            onArmourDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddArmourRow onCreate={onArmourCreate} />}
            </Grid>
        </Stack>
    );
};

export default Armour;
