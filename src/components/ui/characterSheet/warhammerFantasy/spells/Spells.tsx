import { GiSpellBook, GiDiabloSkull } from 'react-icons/gi';
import { Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasySpell
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';
import AddSpellRow from './AddSpellRow';
import SpellRow from './SpellRow';

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

    const onSpellDelete = (index: number) => {
        onChange({
            spells: character.spells.filter((_spell, idx) => index !== idx)
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiSpellBook size={20} />}
                text={T('game.warhammerFantasy.common.spellsAndPrayers')}
            />
            <Grid container columns={readonly ? 12 : 13} rowSpacing={2}>
                {character.spells.map((spell, index) => (
                    <SpellRow
                        key={`spell-row-${index.toString()}`}
                        readonly={readonly}
                        spell={spell}
                        onChange={(spll: WarhammerFantasySpell) => {
                            onSpellChange(index, spll);
                        }}
                        onDelete={() => {
                            onSpellDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddSpellRow onCreate={onSpellCreate} />}
            </Grid>
            <SectionTitle
                iconBefore={<GiDiabloSkull size={20} />}
                text={T('game.warhammerFantasy.common.sin')}
            />
            <TextField
                InputProps={{
                    readOnly: readonly,
                    classes: {
                        input: 'input-smaller-text'
                    }
                }}
                sx={{
                    input: { textAlign: 'center' },
                    width: '5rem'
                }}
                type="text"
                size="small"
                value={character.sin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange?.({ sin: Number(onlyNumbers(e.target.value)) });
                }}
            />
        </Stack>
    );
};

export default Spells;
