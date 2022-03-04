import React from 'react';
import {
    Box,
    TextField,
    Tooltip
} from '@mui/material';

import { KeyData } from './characteristics.data';

interface CharProps<DataType> {
    label: string;
    shortLabel?: string;
    data: DataType;
    readonly: boolean;
    keys: KeyData<DataType>[];
    handleChange: (
        key: keyof DataType,
        value: number
    ) => void;
    gridColumn?: string;
    gridRow?: string;
}

const Characteristic: (
    <DataType>(props: CharProps<DataType>) => (
        React.ReactElement<CharProps<DataType>>
    )
) = ({
    label,
    shortLabel,
    data,
    readonly,
    keys,
    handleChange,
    gridColumn,
    gridRow
}) => (
    <Box
        key={label}
        gridColumn={gridColumn}
        gridRow={gridRow}
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
    >
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
        {keys.map(({ key, label: keyLabel, editable }) => (
            <Box
                key={key.toString()}
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
                        handleChange(key, Number(e.target.value));
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default Characteristic;
