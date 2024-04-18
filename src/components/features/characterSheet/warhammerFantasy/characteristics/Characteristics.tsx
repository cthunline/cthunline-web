import { Grid, Group, Stack } from '@mantine/core';
import { GiDna1 } from 'react-icons/gi';
import {
    warhammerFantasy,
    type WarhammerFantasyCharacter,
    type WarhammerFantasyCharacteristicName,
    type WarhammerFantasyCharacteristic
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import CareerLevelButton from '../generic/CareerLevelButton.js';
import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';
import {
    controlCharacteristic,
    controlWounds
} from '../warhammerFantasySheet.helper.js';

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
        <Stack gap="0.5rem" w="100%">
            <SectionTitle
                iconBefore={<GiDna1 size={20} />}
                text={T('game.warhammerFantasy.common.characteristics')}
            />
            <Grid columns={25} gutter="0.25rem" align="center">
                <Grid.Col span={5} />
                {characteristicNames.map((char) => (
                    <Grid.Col
                        key={`characteristic-name-${char}`}
                        span={2}
                        ta="center"
                    >
                        {T(
                            `game.warhammerFantasy.characteristics.${char}.short`
                        )}
                    </Grid.Col>
                ))}
                {characteristicValues.map((charVal) => [
                    <Grid.Col
                        key={`characteristic-name-${charVal}`}
                        span={5}
                        ta="start"
                    >
                        {T(`game.warhammerFantasy.characteristic.${charVal}`)}
                    </Grid.Col>,
                    characteristicNames.map((char) => (
                        <Grid.Col
                            key={`characteristic-name-${char}-${charVal}`}
                            span={2}
                            ta="center"
                        >
                            <TextInput
                                variant="contained"
                                w="100%"
                                readOnly={readonly || charVal === 'current'}
                                center
                                size="sm"
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
                        </Grid.Col>
                    ))
                ])}
                <Grid.Col span={5} ta="start">
                    {T(`game.warhammerFantasy.characteristic.careerLevel`)}
                </Grid.Col>
                {characteristicNames.map((char) => (
                    <Grid.Col
                        key={`characteristic-name-${char}-careerLevel`}
                        span={2}
                        ta="center"
                    >
                        <Group align="center" justify="center">
                            <CareerLevelButton
                                level={
                                    character.characteristics[char].careerLevel
                                }
                                readonly={readonly}
                                onChange={(level: number | undefined) => {
                                    onChange({
                                        ...character,
                                        characteristics: {
                                            ...character.characteristics,
                                            [char]: {
                                                ...character.characteristics[
                                                    char
                                                ],
                                                careerLevel: level
                                            }
                                        }
                                    });
                                }}
                            />
                        </Group>
                    </Grid.Col>
                ))}
            </Grid>
        </Stack>
    );
};

export default Characteristics;
