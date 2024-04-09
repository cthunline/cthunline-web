import { GiInspiration } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyTalent
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../contexts/App.js';
import AddTalentRow from './AddTalentRow.js';
import TalentRow from './TalentRow.js';

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
        <Stack gap="0.5rem" w="100%">
            <SectionTitle
                iconBefore={<GiInspiration size={20} />}
                text={T('game.warhammerFantasy.common.talents')}
            />
            <Stack gap="0.5rem" w="100%">
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
            </Stack>
        </Stack>
    );
};

export default Talents;
