import React, { memo } from 'react';
import {
    Box,
    Radio,
    IconButton
} from '@mui/material';
import { MdClose } from 'react-icons/md';

import { useApp } from '../../../../contexts/App';

import './Characteristics.css';

interface CharacteristicsProps<DataType> {
    data: DataType;
    textKey: string;
    columns: 1 | 2 | 3;
    readonly: boolean;
    onChange: (data: DataType) => void;
}

const Characteristics = <DataType extends Record<string, any>>({
    data,
    textKey,
    columns,
    readonly,
    onChange
}: CharacteristicsProps<DataType>) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
            columnGap={6}
        >
            {Object.keys(data).map((key: string) => {
                const score = Number(data[key]);
                return (
                    <Box
                        key={`characteristic-${key}`}
                        className="characteristic"
                        gridColumn={`span ${12 / columns}`}
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        alignItems="center"
                    >
                        <Box
                            key={`characteristic-label-${key}`}
                            gridColumn="span 5"
                        >
                            {T(`${textKey}.${key}`)}
                        </Box>
                        <Box
                            key={`characteristic-score-${key}`}
                            gridColumn="span 7"
                        >
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Radio
                                    key={`characteristic-radio-${key}-${value.toString()}`}
                                    className="characteristic-radio"
                                    checked={score >= value}
                                    value={value}
                                    name="radio-buttons"
                                    size="small"
                                    onClick={(e) => {
                                        if (!readonly) {
                                            onChange({
                                                ...data,
                                                [key]: Number((e.target as HTMLInputElement).value)
                                            });
                                        }
                                    }}
                                />
                            ))}
                            {readonly ? null : (
                                <IconButton
                                    key={`characteristic-clear-${key}`}
                                    className="ml-5 characteristic-clear"
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        onChange({
                                            ...data,
                                            [key]: 0
                                        });
                                    }}
                                >
                                    <MdClose />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default memo(Characteristics) as typeof Characteristics;
