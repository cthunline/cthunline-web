import { type WarhammerFantasyCharacter } from '@cthunline/games';
import { Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { GiSpikedArmor } from 'react-icons/gi';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

interface EncumbranceInputProps {
    label?: string;
    value: number;
    readonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EncumbranceInput = ({
    label,
    value,
    readonly = true,
    onChange
}: EncumbranceInputProps) => (
    <TextField
        fullWidth
        InputProps={{
            readOnly: readonly,
            classes: {
                input: 'input-smaller-text'
            }
        }}
        sx={{ input: { textAlign: 'center' } }}
        type="text"
        size="small"
        label={label}
        value={value}
        onChange={onChange}
    />
);

interface EncumbranceProps {
    character: WarhammerFantasyCharacter;
    flex?: string | number;
    readonly?: boolean;
    onChange: (
        partialChar: Pick<WarhammerFantasyCharacter, 'encumbrance'>
    ) => void;
}

const Encumbrance = ({
    character,
    flex,
    readonly,
    onChange
}: EncumbranceProps) => {
    const { T } = useApp();

    const onBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...character,
            encumbrance: {
                ...character.encumbrance,
                maximumBonus: Number(onlyNumbers(e.target.value))
            }
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiSpikedArmor size={20} />}
                text={T('game.warhammerFantasy.common.encumbrance')}
            />
            <Grid container columns={2} spacing={2}>
                <Grid xs={1} display="flex" alignItems="center">
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.weapons')}
                        value={character.encumbrance.weapons}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.armour')}
                        value={character.encumbrance.armour}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.trappings')}
                        value={character.encumbrance.trappings}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.total')}
                        value={character.encumbrance.total}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <EncumbranceInput
                        label={T(
                            'game.warhammerFantasy.encumbrance.maximumBonus'
                        )}
                        value={character.encumbrance.maximumBonus}
                        readonly={readonly}
                        onChange={onBonusChange}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.maximum')}
                        value={character.encumbrance.maximum}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Encumbrance;
