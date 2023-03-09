import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { GameId } from '../../../../../types';
import { useApp } from '../../../../contexts/App';
import SectionTitle from '../sectionTitle/SectionTitle';
import { onlyNumbers } from '../../../../../services/tools';

export interface Field<DataType> {
    key?: keyof DataType;
    title?: boolean;
    gridColumn: number;
    type?: string;
    lines?: number;
    children?: Field<DataType>[];
}

interface FieldLayoutProps<DataType> {
    gameId: GameId;
    fields: Field<DataType>[];
    textSectionKey: string;
    data: DataType;
    readonly: boolean;
    onChange: (data: DataType) => void;
}

const FieldLayout = <DataType extends {}>({
    gameId,
    fields,
    textSectionKey,
    data,
    readonly,
    onChange
}: FieldLayoutProps<DataType>) => {
    const { T } = useApp();

    const getInput = (
        { key, title, type, lines }: Field<DataType>,
        index: number
    ) => [
        title ? (
            <SectionTitle
                key={`field-${String(key ?? index)}-title`}
                text={T(`game.${gameId}.${textSectionKey}.${String(key)}`)}
            />
        ) : null,
        key ? (
            <TextField
                key={`field-${String(key ?? index)}-input`}
                fullWidth
                multiline={!!lines}
                minRows={lines}
                maxRows={lines}
                InputProps={{
                    readOnly: readonly,
                    classes: {
                        input: 'input-smaller-text'
                    }
                }}
                type="text"
                size="small"
                label={T(
                    `game.${gameId}.${textSectionKey}.${String(key ?? index)}`
                )}
                name={key.toString()}
                value={data[key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    const parsedValue =
                        type === 'number' ? Number(onlyNumbers(value)) : value;
                    onChange({
                        ...data,
                        [key]: parsedValue
                    });
                }}
            />
        ) : null
    ];

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {fields.map((field, index) =>
                field.children ? (
                    <Box
                        key={`field-${String(field.key ?? index)}`}
                        gridColumn={`span ${field.gridColumn}`}
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                    >
                        {field.children.map((childField, idx) => (
                            <Box
                                key={`field-${String(childField.key ?? idx)}`}
                                gridColumn={`span ${childField.gridColumn}`}
                                gap={2}
                            >
                                {getInput(childField, idx)}
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box
                        key={`field-${String(field.key ?? index)}`}
                        gridColumn={`span ${field.gridColumn}`}
                        gap={2}
                    >
                        {getInput(field, index)}
                    </Box>
                )
            )}
        </Box>
    );
};

export default memo(FieldLayout) as typeof FieldLayout;
