import type {
    CoCCharacter,
    CoCCharacteristic,
    CoCCharacteristics,
    CoCLuck,
    CoCPoint,
    CoCPoints,
    CoCSanity
} from '@cthunline/games';
import { Grid, Group, Stack } from '@mantine/core';
import { useCallback } from 'react';

import Characteristic from './Characteristic.js';
import Luck from './Luck.js';
import Point from './Point.js';
import Sanity from './Sanity.js';
import { charFields, pointsFields } from './characteristics.data.js';

interface CharacteristicsProps {
    characteristics: CoCCharacteristics;
    points: CoCPoints;
    luck: CoCLuck;
    sanity: CoCSanity;
    readonly: boolean;
    onCharacteristicsChange: (data: Partial<CoCCharacteristics>) => void;
    onPointsChange: (data: Partial<CoCPoints>) => void;
    onLuckOrSanityChange: (data: Partial<CoCCharacter>) => void;
}

const Characteristics = ({
    readonly,
    characteristics,
    points,
    luck,
    sanity,
    onCharacteristicsChange,
    onPointsChange,
    onLuckOrSanityChange
}: CharacteristicsProps) => {
    const onCharacteristicChange = useCallback(
        (field: string, char: CoCCharacteristic) => {
            onCharacteristicsChange({
                [field]: char
            });
        },
        [onCharacteristicsChange]
    );

    const onPointChange = useCallback(
        (field: string, point: CoCPoint) => {
            onPointsChange({
                [field]: point
            });
        },
        [onPointsChange]
    );

    const onLuckChange = useCallback(
        (updatedLuck: CoCLuck) => {
            onLuckOrSanityChange({
                luck: updatedLuck
            });
        },
        [onLuckOrSanityChange]
    );

    const onSanityChange = useCallback(
        (updatedSanity: CoCSanity) => {
            onLuckOrSanityChange({
                sanity: updatedSanity
            });
        },
        [onLuckOrSanityChange]
    );

    return (
        <Group w="100%" gap="1rem">
            <Grid gutter="1rem" flex="2 0">
                {charFields.map(({ field, textKey }) => (
                    <Grid.Col span={6} key={field}>
                        <Characteristic
                            field={field}
                            textKey={textKey}
                            data={characteristics[field]}
                            readonly={readonly}
                            onChange={onCharacteristicChange}
                        />
                    </Grid.Col>
                ))}
            </Grid>
            <Stack flex="1 0">
                {pointsFields.map(({ field, textKey }) => (
                    <Point
                        key={field}
                        field={field}
                        textKey={textKey}
                        data={points[field]}
                        readonly={readonly}
                        onChange={onPointChange}
                    />
                ))}
                <Luck data={luck} readonly={readonly} onChange={onLuckChange} />
                <Sanity
                    data={sanity}
                    readonly={readonly}
                    onChange={onSanityChange}
                />
            </Stack>
        </Group>
    );
};

export default Characteristics;
