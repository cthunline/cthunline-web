import React from 'react';
import { Box } from '@mui/material';

import {
    CoCCharacterData,
    CoCCharacteristic,
    CoCLuck,
    CoCPoint,
    CoCSanity
} from '../../../../../../types/games/callOfCthulhu';
import { CharacterSheetContentProps } from '../../../characterSheetProps';
import Characteristic from './Characteristic';
import Point from './Point';
import Luck from './Luck';
import Sanity from './Sanity';
import { charFields, pointsFields } from './characteristics.data';

const Characteristics: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    readonly,
    data,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 8" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            {charFields.map(({ field, label, shortLabel }) => (
                <Characteristic
                    key={field}
                    label={label}
                    shortLabel={shortLabel}
                    data={data.characteristics[field]}
                    readonly={readonly}
                    handleChange={(characteristic: CoCCharacteristic) => {
                        onChange?.({
                            ...data,
                            characteristics: {
                                ...data.characteristics,
                                [field]: characteristic
                            }
                        });
                    }}
                />
            ))}
        </Box>
        <Box gridColumn="span 4" display="grid" gap={2}>
            {pointsFields.map(({ field, label, shortLabel }) => (
                <Point
                    key={field}
                    label={label}
                    shortLabel={shortLabel}
                    data={data.points[field]}
                    readonly={readonly}
                    handleChange={(point: CoCPoint) => {
                        onChange?.({
                            ...data,
                            points: {
                                ...data.points,
                                [field]: point
                            }
                        });
                    }}
                />
            ))}
            <Luck
                data={data.luck}
                readonly={readonly}
                handleChange={(luck: CoCLuck) => {
                    onChange?.({
                        ...data,
                        luck
                    });
                }}
            />
            <Sanity
                data={data.sanity}
                readonly={readonly}
                handleChange={(sanity: CoCSanity) => {
                    onChange?.({
                        ...data,
                        sanity
                    });
                }}
            />
        </Box>
    </Box>
);

export default Characteristics;
