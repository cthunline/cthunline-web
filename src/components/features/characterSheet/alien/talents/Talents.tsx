import type { AlienCharacter } from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiInspiration } from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddTalentRow from './AddTalentRow.js';
import TalentRow from './TalentRow.js';

type TalentsProps = {
    readonly: boolean;
    talents: AlienCharacter['talents'];
    onChange: (talents: AlienCharacter['talents']) => void;
    flex?: string | number;
};

const Talents = ({ readonly, talents, onChange, flex }: TalentsProps) => {
    const { T } = useApp();

    const onTalentChange = (index: number, talent: string) => {
        onChange(talents.map((tal, idx) => (index === idx ? talent : tal)));
    };

    const onTalentCreate = (talent: string) => {
        onChange([...talents, talent]);
    };

    const onTalentMove = (index: number, action: MoveAction) => {
        const movedTalents = arrayMoveUpDown(talents, index, action);
        if (movedTalents) {
            onChange(movedTalents);
        }
    };

    const onTalentDelete = (index: number) => {
        onChange(talents.filter((_talent, idx) => index !== idx));
    };

    return (
        <Stack gap="1rem" w="100%" flex={flex}>
            <SectionTitle
                iconBefore={<GiInspiration size={20} />}
                text={T('game.alien.talents.talents')}
            />
            <Stack gap="1rem" w="100%">
                {talents.map((talent, index) => (
                    <TalentRow
                        key={`talent-row-${index.toString()}`}
                        readonly={readonly}
                        talent={talent}
                        onChange={(tal: string) => {
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
