import type {
    WarhammerFantasyCharacter,
    WarhammerFantasySpell
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiDiabloSkull, GiSpellBook } from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import {
    type MoveAction,
    arrayMoveUpDown,
    onlyNumbers
} from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddSpellRow from './AddSpellRow.js';
import SpellRow from './SpellRow.js';

interface SpellsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        spells: Partial<Pick<WarhammerFantasyCharacter, 'spells' | 'sin'>>
    ) => void;
}

const Spells = ({ readonly, character, onChange }: SpellsProps) => {
    const { T } = useApp();

    const onSpellChange = (index: number, spell: WarhammerFantasySpell) => {
        onChange({
            spells: character.spells.map((tal, idx) =>
                index === idx ? spell : tal
            )
        });
    };

    const onSpellCreate = (spell: WarhammerFantasySpell) => {
        onChange({
            spells: [...character.spells, spell]
        });
    };

    const onSpellMove = (index: number, action: MoveAction) => {
        const movedSpells = arrayMoveUpDown(character.spells, index, action);
        if (movedSpells) {
            onChange({
                spells: movedSpells
            });
        }
    };

    const onSpellDelete = (index: number) => {
        onChange({
            spells: character.spells.filter((_spell, idx) => index !== idx)
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiSpellBook size={20} />}
                text={T('game.warhammerFantasy.common.spellsAndPrayers')}
            />
            <Stack gap="1rem" w="100%">
                {character.spells.map((spell, index) => (
                    <SpellRow
                        key={`spell-row-${index.toString()}`}
                        readonly={readonly}
                        spell={spell}
                        onChange={(spll: WarhammerFantasySpell) => {
                            onSpellChange(index, spll);
                        }}
                        onMove={(action) => {
                            onSpellMove(index, action);
                        }}
                        onDelete={() => {
                            onSpellDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddSpellRow onCreate={onSpellCreate} />}
            </Stack>
            <SectionTitle
                iconBefore={<GiDiabloSkull size={20} />}
                text={T('game.warhammerFantasy.common.sin')}
            />
            <TextInput
                readOnly={readonly}
                w="5rem"
                center
                size="sm"
                value={character.sin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange?.({ sin: Number(onlyNumbers(e.target.value)) });
                }}
            />
        </Stack>
    );
};

export default Spells;
