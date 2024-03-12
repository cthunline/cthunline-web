import { Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { GiDna1 } from 'react-icons/gi';
import {
    warhammerFantasy,
    type WarhammerFantasyCharacter,
    type WarhammerFantasyCharacteristicName,
    type WarhammerFantasyCharacteristic
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';
import {
    controlCharacteristic,
    controlWounds
} from '../warhammerFantasySheet.helper';

export const { characteristicNames } = warhammerFantasy.data;

export const characteristicValues: (keyof WarhammerFantasyCharacteristic)[] = [
    'initial',
    'advances',
    'current'
];

export interface CharacteristicsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        character: Pick<WarhammerFantasyCharacter, 'characteristics' | 'wounds'>
    ) => void;
}

const Characteristics = ({
    readonly,
    character,
    onChange
}: CharacteristicsProps) => {
    const { T } = useApp();

    const onCharacteristicChange = (
        char: WarhammerFantasyCharacteristicName,
        charVal: keyof WarhammerFantasyCharacteristic,
        val: number
    ) => {
        const charData = controlCharacteristic({
            ...character.characteristics[char],
            [charVal]: val
        });
        const characteristics = {
            ...character.characteristics,
            [char]: charData
        };
        onChange({
            ...character,
            characteristics,
            wounds: controlWounds(characteristics, character.wounds)
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiDna1 size={20} />}
                text={T('game.warhammerFantasy.common.characteristics')}
            />
            <Grid container columns={25} spacing={1}>
                <Grid xs={5} />
                {characteristicNames.map((char) => (
                    <Grid
                        key={`characteristic-name-${char}`}
                        xs={2}
                        textAlign="center"
                    >
                        {T(
                            `game.warhammerFantasy.characteristics.${char}.short`
                        )}
                    </Grid>
                ))}
                {characteristicValues.map((charVal) => [
                    <Grid
                        key={`characteristic-name-${charVal}`}
                        xs={5}
                        display="flex"
                        alignItems="center"
                    >
                        {T(`game.warhammerFantasy.characteristic.${charVal}`)}
                    </Grid>,
                    characteristicNames.map((char) => (
                        <Grid
                            key={`characteristic-name-${char}-${charVal}`}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: readonly || charVal === 'current',
                                    classes: {
                                        input: 'input-smaller-text'
                                    }
                                }}
                                sx={{ input: { textAlign: 'center' } }}
                                type="text"
                                size="small"
                                value={character.characteristics[char][charVal]}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onCharacteristicChange(
                                        char,
                                        charVal,
                                        Number(onlyNumbers(e.target.value))
                                    );
                                }}
                            />
                        </Grid>
                    ))
                ])}
            </Grid>
        </Stack>
    );
};

export default Characteristics;
