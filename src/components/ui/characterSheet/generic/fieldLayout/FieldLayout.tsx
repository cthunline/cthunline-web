import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { onlyNumbers } from '../../../../../services/tools';

export interface Field<DataType> {
    field: keyof DataType;
    label: string;
    type?: string;
    grid: number;
}

interface FieldLayoutProps<DataType> {
    fields: Field<DataType>[];
    data: DataType;
    readonly: boolean;
    onChange: (data: DataType) => void;
}

const FieldLayout = <DataType extends {}>({
    fields,
    data,
    readonly,
    onChange
}: FieldLayoutProps<DataType>) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        {fields.map(({
            field,
            label,
            type,
            grid
        }) => (
            <Box key={field.toString()} gridColumn={`span ${grid}`}>
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    label={label}
                    name={field.toString()}
                    value={data[field]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const { value } = e.target;
                        const parsedValue = type === 'number' ? (
                            Number(onlyNumbers(value))
                        ) : value;
                        onChange({
                            ...data,
                            [field]: parsedValue
                        });
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(FieldLayout) as typeof FieldLayout;
