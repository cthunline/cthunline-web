import React, { memo } from 'react';
import {
    Box,
    TextField,
    Typography
} from '@mui/material';

import { onlyNumbers } from '../../../../../services/tools';

export interface Field<DataType> {
    key?: keyof DataType;
    label?: string;
    title?: string;
    gridColumn: number;
    type?: string;
    lines?: number;
    children?: Field<DataType>[];
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
}: FieldLayoutProps<DataType>) => {
    const getInput = ({
        key,
        label,
        title,
        type,
        lines
    }: Field<DataType>) => ([
        title ? (
            <Typography key={`field-${key}-title`} variant="h6">
                {title}
            </Typography>
        ) : null,
        key ? (
            <TextField
                key={`field-${key}-input`}
                fullWidth
                multiline={!!lines}
                minRows={lines}
                maxRows={lines}
                InputProps={{
                    readOnly: readonly
                }}
                type="text"
                size="small"
                label={label}
                name={key.toString()}
                value={data[key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    const parsedValue = type === 'number' ? (
                        Number(onlyNumbers(value))
                    ) : value;
                    onChange({
                        ...data,
                        [key]: parsedValue
                    });
                }}
            />
        ) : null
    ]);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {fields.map((field) => (
                field.children ? (
                    <Box
                        key={`field-${field.key}`}
                        gridColumn={`span ${field.gridColumn}`}
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                    >
                        {field.children.map((childField) => (
                            <Box
                                key={`field-${childField.key}`}
                                gridColumn={`span ${childField.gridColumn}`}
                                gap={2}
                            >
                                {getInput(childField)}
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box
                        key={`field-${field.key}`}
                        gridColumn={`span ${field.gridColumn}`}
                        gap={2}
                    >
                        {getInput(field)}
                    </Box>
                )
            ))}
        </Box>
    );
};

export default memo(FieldLayout) as typeof FieldLayout;
