import type { WarhammerFantasyCharacter } from '@cthunline/games';
import { Grid, Stack } from '@mantine/core';
import { GiSpikedArmor } from 'react-icons/gi';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

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
    <TextInput
        variant="contained"
        w="100%"
        readOnly={readonly}
        center
        size="sm"
        label={label}
        value={value}
        onChange={onChange}
    />
);

interface EncumbranceProps {
    character: WarhammerFantasyCharacter;
    flex: string | number;
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
    const T = useLocaleStore(({ T }) => T);

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
        <Stack gap="1rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiSpikedArmor size={20} />}
                text={T('game.warhammerFantasy.common.encumbrance')}
            />
            <Grid columns={2} gutter="0.5rem">
                <Grid.Col span={1}>
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.weapons')}
                        value={character.encumbrance.weapons}
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.armour')}
                        value={character.encumbrance.armour}
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.trappings')}
                        value={character.encumbrance.trappings}
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.total')}
                        value={character.encumbrance.total}
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <EncumbranceInput
                        label={T(
                            'game.warhammerFantasy.encumbrance.maximumBonus'
                        )}
                        value={character.encumbrance.maximumBonus}
                        readonly={readonly}
                        onChange={onBonusChange}
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <EncumbranceInput
                        label={T('game.warhammerFantasy.encumbrance.maximum')}
                        value={character.encumbrance.maximum}
                    />
                </Grid.Col>
            </Grid>
        </Stack>
    );
};

export default Encumbrance;
