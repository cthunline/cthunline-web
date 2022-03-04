import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import {
    CoCCharacterData,
    CoCCharacteristic,
    CoCCharacteristics,
    CoCLuck,
    CoCPoints,
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
}) => {
    const [characteristics, setCharacteristics] = useState<CoCCharacteristics>(
        data.characteristics
    );
    const [points, setPoints] = useState<CoCPoints>(data.points);
    const [luck, setLuck] = useState<CoCLuck>(data.luck);
    const [sanity, setSanity] = useState<CoCSanity>(data.sanity);

    useEffect(() => {
        if (onChange) {
            onChange({
                ...data,
                characteristics,
                points,
                luck,
                sanity
            });
        }
    }, [
        onChange,
        data,
        characteristics,
        points,
        luck,
        sanity
    ]);

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 8" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                {charFields.map(({ field, label, shortLabel }) => (
                    <Characteristic<CoCCharacteristic>
                        key={field}
                        gridColumn="span 6"
                        label={label}
                        shortLabel={shortLabel}
                        data={characteristics[field]}
                        readonly={readonly}
                        keys={charKeys}
                        handleChange={(key: keyof CoCCharacteristic, value: number) => {
                            setCharacteristics((previous) => ({
                                ...previous,
                                [field]: controlCharacteristic({
                                    ...previous[field],
                                    [key]: value
                                })
                            }));
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
                        data={points[field]}
                        readonly={readonly}
                        keys={pointsKeys}
                        handleChange={(key: keyof CoCPoint, value: number) => {
                            setPoints((previous) => ({
                                ...previous,
                                [field]: controlPoint({
                                    ...previous[field],
                                    [key]: value
                                })
                            }));
                        }}
                    />
                ))}
                <Characteristic<CoCLuck>
                    gridRow="span 3"
                    label="Luck"
                    data={luck}
                    readonly={readonly}
                    keys={luckKeys}
                    handleChange={(key: keyof CoCLuck, value: number) => {
                        setLuck((previous) => ({
                            ...previous,
                            [key]: value
                        }));
                    }}
                />
                <Characteristic<CoCSanity>
                    gridRow="span 3"
                    label="Sanity"
                    data={sanity}
                    readonly={readonly}
                    keys={sanityKeys}
                    handleChange={(key: keyof CoCSanity, value: number) => {
                        setSanity((previous) => (
                            controlSanity({
                                ...previous,
                                [key]: value
                            })
                        ));
                    }}
                />
            </Box>
        </Box>
    );
};

export default Characteristics;
