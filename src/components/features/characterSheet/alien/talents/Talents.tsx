import type { AlienTalent } from '@cthunline/games';
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

type TalentsProps = {
    readonly: boolean;
    talents: AlienTalent[];
    onChange: (talents: AlienTalent[]) => void;
    flex?: string | number;
};

const Talents = ({ readonly, talents, onChange, flex }: TalentsProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onTalentChange = (index: number, talent: AlienTalent) => {
        onChange(talents.map((tal, idx) => (index === idx ? talent : tal)));
    };

    const onTalentCreate = (talent: AlienTalent) => {
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
            <Stack gap="2rem" w="100%">
                {talents.map((talent, index) => (
                    <TalentRow
                        key={`talent-row-${index.toString()}`}
                        readonly={readonly}
                        talent={talent}
                        onChange={(tal: AlienTalent) => {
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
