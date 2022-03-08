import React, { memo } from 'react';
import {
    Box,
    TextField,
    Tooltip
} from '@mui/material';

import { onlyNumbers } from '../../../../../../services/tools';
import { CoCCharacteristic } from '../../../../../../types/games/callOfCthulhu';
import { charKeys } from './characteristics.data';
import { controlCharacteristic } from '../../cocSheet.helper';

interface CharacteristicProps {
    field: string;
    label: string;
    shortLabel?: string;
    data: CoCCharacteristic;
    readonly: boolean;
    onChange: (field: string, data: CoCCharacteristic) => void;
}

const Characteristic: React.FC<CharacteristicProps> = ({
    field,
    label,
    shortLabel,
    data,
    readonly,
    onChange
}) => (
    <Box gridColumn="span 6" display="grid" gridTemplateColumns="repeat(12, 1fr)">
        <Box
            gridColumn="span 3"
            display="grid"
            alignItems="center"
        >
            {shortLabel ? (
                <Tooltip title={label} placement="bottom">
                    <span>{shortLabel}</span>
                </Tooltip>
            ) : label}
        </Box>
        {charKeys.map(({ key, label: keyLabel, editable }) => (
            <Box
                key={`characteristic-${key}`}
                gridColumn="span 3"
                alignItems="center"
            >
                <TextField
                    fullWidth
                    disabled={!editable}
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    label={keyLabel}
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(
                            field,
                            controlCharacteristic({
                                ...data,
                                [key]: Number(onlyNumbers(e.target.value))
                            })
                        );
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Characteristic);
