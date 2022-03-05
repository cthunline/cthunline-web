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
import {
    charKeys,
    charFields,
    pointsFields,
    pointsKeys,
    luckKeys,
    sanityKeys
} from './characteristics.data';
import {
    controlCharacteristic,
    controlPoint,
    controlSanity
} from './characteristics.helper';

const Characteristics: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    readonly,
    data,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 8" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            {charFields.map(({ field, label, shortLabel }) => (
                <Characteristic<CoCCharacteristic>
                    key={field}
                    gridColumn="span 6"
                    label={label}
                    shortLabel={shortLabel}
                    data={data.characteristics[field]}
                    readonly={readonly}
                    keys={charKeys}
                    handleChange={(key: keyof CoCCharacteristic, value: number) => {
                        onChange?.({
                            ...data,
                            characteristics: {
                                ...data.characteristics,
                                [field]: controlCharacteristic({
                                    ...data.characteristics[field],
                                    [key]: value
                                })
                            }
                        });
                    }}
                />
            ))}
        </Box>
        <Box gridColumn="span 4" display="grid" gridTemplateRows="repeat(12, 1fr)" gap={2}>
            {pointsFields.map(({ field, label, shortLabel }) => (
                <Characteristic<CoCPoint>
                    key={field}
                    gridRow="span 3"
                    label={label}
                    shortLabel={shortLabel}
                    data={data.points[field]}
                    readonly={readonly}
                    keys={pointsKeys}
                    handleChange={(key: keyof CoCPoint, value: number) => {
                        onChange?.({
                            ...data,
                            points: {
                                ...data.points,
                                [field]: controlPoint({
                                    ...data.points[field],
                                    [key]: value
                                })
                            }
                        });
                    }}
                />
            ))}
            <Characteristic<CoCLuck>
                gridRow="span 3"
                label="Luck"
                data={data.luck}
                readonly={readonly}
                keys={luckKeys}
                handleChange={(key: keyof CoCLuck, value: number) => {
                    onChange?.({
                        ...data,
                        luck: {
                            ...data.luck,
                            [key]: value
                        }
                    });
                }}
            />
            <Characteristic<CoCSanity>
                gridRow="span 3"
                label="Sanity"
                data={data.sanity}
                readonly={readonly}
                keys={sanityKeys}
                handleChange={(key: keyof CoCSanity, value: number) => {
                    onChange?.({
                        ...data,
                        luck: controlSanity({
                            ...data.sanity,
                            [key]: value
                        })
                    });
                }}
            />
        </Box>
    </Box>
);

export default Characteristics;
