import Grid from '@mui/material/Unstable_Grid2';
import { GiInspiration } from 'react-icons/gi';
import { Stack } from '@mui/material';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyTalent
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import AddTalentRow from './AddTalentRow';
import TalentRow from './TalentRow';

interface TalentsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (talents: Pick<WarhammerFantasyCharacter, 'talents'>) => void;
}

const Talents = ({ readonly, character, onChange }: TalentsProps) => {
    const { T } = useApp();

    const onTalentChange = (index: number, talent: WarhammerFantasyTalent) => {
        onChange({
            talents: character.talents.map((tal, idx) =>
                index === idx ? talent : tal
            )
        });
    };

    const onTalentCreate = (talent: WarhammerFantasyTalent) => {
        onChange({
            talents: [...character.talents, talent]
        });
    };

    const onTalentDelete = (index: number) => {
        onChange({
            talents: character.talents.filter((_talent, idx) => index !== idx)
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiInspiration size={20} />}
                text={T('game.warhammerFantasy.common.talents')}
            />
            <Grid container columns={readonly ? 8 : 9} spacing={2}>
                {character.talents.map((talent, index) => (
                    <TalentRow
                        key={`talent-row-${index.toString()}`}
                        readonly={readonly}
                        talent={talent}
                        onChange={(tal: WarhammerFantasyTalent) => {
                            onTalentChange(index, tal);
                        }}
                        onDelete={() => {
                            onTalentDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddTalentRow onCreate={onTalentCreate} />}
            </Grid>
        </Stack>
    );
};

export default Talents;
