import type {
    WarhammerFantasyCharacter,
    WarhammerFantasyTalent
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiInspiration } from 'react-icons/gi';

import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddTalentRow from './AddTalentRow.js';
import TalentRow from './TalentRow.js';

interface TalentsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (talents: Pick<WarhammerFantasyCharacter, 'talents'>) => void;
}

const Talents = ({ readonly, character, onChange }: TalentsProps) => {
    const T = useLocaleStore(({ T }) => T);

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

    const onTalentMove = (index: number, action: MoveAction) => {
        const movedTalents = arrayMoveUpDown(character.talents, index, action);
        if (movedTalents) {
            onChange({
                talents: movedTalents
            });
        }
    };

    const onTalentDelete = (index: number) => {
        onChange({
            talents: character.talents.filter((_talent, idx) => index !== idx)
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiInspiration size={20} />}
                text={T('game.warhammerFantasy.common.talents')}
            />
            <Stack gap="1rem" w="100%">
                {character.talents.map((talent, index) => (
                    <TalentRow
                        key={`talent-row-${index.toString()}`}
                        readonly={readonly}
                        talent={talent}
                        onChange={(tal: WarhammerFantasyTalent) => {
                            onTalentChange(index, tal);
                        }}
                        onMove={(action) => {
                            onTalentMove(index, action);
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
