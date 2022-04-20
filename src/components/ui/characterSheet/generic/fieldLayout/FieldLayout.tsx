import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { useTranslation } from '../../../../contexts/Translation';
import SectionTitle from '../sectionTitle/SectionTitle';
import { onlyNumbers } from '../../../../../services/tools';

export interface Field<DataType> {
    key?: keyof DataType;
    title?: string;
    gridColumn: number;
    type?: string;
    lines?: number;
    children?: Field<DataType>[];
}

interface FieldLayoutProps<DataType> {
    fields: Field<DataType>[];
    textSectionKey: string;
    data: DataType;
    readonly: boolean;
    onChange: (data: DataType) => void;
}

const FieldLayout = <DataType extends {}>({
    textSectionKey,
    fields,
    data,
    readonly,
    onChange
}: FieldLayoutProps<DataType>) => {
    const { T } = useTranslation();

    const getInput = ({
        key,
        title,
        type,
        lines
    }: Field<DataType>) => ([
        title ? (
            <SectionTitle key={`field-${key}-title`} text={title} />
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
                label={T(`game.callOfCthulhu.${textSectionKey}.${key}`)}
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
