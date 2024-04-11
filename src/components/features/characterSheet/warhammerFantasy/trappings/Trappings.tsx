import { GiSwissArmyKnife } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyTrapping
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../contexts/App.js';
import AddTrappingRow from './AddTrappingRow.js';
import TrappingRow from './TrappingRow.js';

interface TrappingsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (trappings: Pick<WarhammerFantasyCharacter, 'trappings'>) => void;
}

const Trappings = ({ readonly, character, onChange }: TrappingsProps) => {
    const { T } = useApp();

    const onTrappingChange = (
        index: number,
        trapping: WarhammerFantasyTrapping
    ) => {
        onChange({
            trappings: character.trappings.map((tal, idx) =>
                index === idx ? trapping : tal
            )
        });
    };

    const onTrappingCreate = (trapping: WarhammerFantasyTrapping) => {
        onChange({
            trappings: [...character.trappings, trapping]
        });
    };

    const onTrappingDelete = (index: number) => {
        onChange({
            trappings: character.trappings.filter(
                (_trapping, idx) => index !== idx
            )
        });
    };

    return (
        <Stack gap="0.5rem" w="100%">
            <SectionTitle
                iconBefore={<GiSwissArmyKnife size={20} />}
                text={T('game.warhammerFantasy.common.trappings')}
            />
            <Stack gap="1rem" w="100%">
                {character.trappings.map((trapping, index) => (
                    <TrappingRow
                        key={`trapping-row-${index.toString()}`}
                        readonly={readonly}
                        trapping={trapping}
                        onChange={(tal: WarhammerFantasyTrapping) => {
                            onTrappingChange(index, tal);
                        }}
                        onDelete={() => {
                            onTrappingDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddTrappingRow onCreate={onTrappingCreate} />}
            </Stack>
        </Stack>
    );
};

export default Trappings;
