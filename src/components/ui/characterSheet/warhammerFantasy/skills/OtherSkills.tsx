import Grid from '@mui/material/Unstable_Grid2';
import { GiJuggler } from 'react-icons/gi';
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyOtherSkill
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import AddOtherSkillRow from './AddOtherSkillRow';
import { useApp } from '../../../../contexts/App';
import SkillRow from './SkillRow';

interface OtherSkillsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        otherSkills: Pick<WarhammerFantasyCharacter, 'otherSkills'>
    ) => void;
}

const OtherSkills = ({ readonly, character, onChange }: OtherSkillsProps) => {
    const { T } = useApp();

    const sortedOtherSkills = useMemo(() => {
        const data = [...character.otherSkills];
        data.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        return data;
    }, [character.otherSkills]);

    const onOtherSkillAdvancesChange = (index: number, advances: number) => {
        const otherSkills = [...character.otherSkills];
        const otherSkill = otherSkills[index];
        if (otherSkill) {
            const char =
                character.characteristics[otherSkill.characteristicName];
            otherSkills[index] = {
                ...otherSkill,
                advances,
                skill: char.current + advances
            };
            onChange({ otherSkills });
        }
    };

    const onCreateOtherSkill = (otherSkill: WarhammerFantasyOtherSkill) => {
        onChange({
            otherSkills: [...character.otherSkills, otherSkill]
        });
    };

    const onOtherSkillDelete = (index: number) => {
        onChange({
            otherSkills: character.otherSkills.filter(
                (_otherSkill, idx) => index !== idx
            )
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiJuggler size={20} />}
                text={T('game.warhammerFantasy.common.otherSkills')}
            />
            <Grid container columns={readonly ? 8 : 9} spacing={2}>
                {sortedOtherSkills.map((otherSkill, index) => (
                    <SkillRow
                        key={`otherSkill-row-${index.toString()}`}
                        readonly={readonly}
                        character={character}
                        skill={otherSkill}
                        onAdvancesChange={(val: number) => {
                            onOtherSkillAdvancesChange(index, val);
                        }}
                        onDelete={() => {
                            onOtherSkillDelete(index);
                        }}
                    />
                ))}
                {!readonly && (
                    <AddOtherSkillRow
                        character={character}
                        onCreate={onCreateOtherSkill}
                    />
                )}
            </Grid>
        </Stack>
    );
};

export default OtherSkills;
