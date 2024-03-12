import { useCallback } from 'react';
import { Box } from '@mui/material';
import {
    CoCCharacter,
    CoCCharacteristic,
    CoCCharacteristics,
    CoCPoints,
    CoCPoint,
    CoCLuck,
    CoCSanity
} from '@cthunline/games';

import Characteristic from './Characteristic';
import Point from './Point';
import Luck from './Luck';
import Sanity from './Sanity';
import { charFields, pointsFields } from './characteristics.data';

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
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            <Box
                gridColumn="span 8"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={2}
            >
                {charFields.map(({ field, textKey }) => (
                    <Characteristic
                        key={field}
                        field={field}
                        textKey={textKey}
                        data={characteristics[field]}
                        readonly={readonly}
                        onChange={onCharacteristicChange}
                    />
                ))}
            </Box>
            <Box gridColumn="span 4" display="grid" gap={2}>
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
            </Box>
        </Box>
    );
};

export default Characteristics;
