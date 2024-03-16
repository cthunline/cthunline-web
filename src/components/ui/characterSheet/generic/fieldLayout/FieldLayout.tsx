import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

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
    readonly?: boolean;
}

interface InputProps<DataType> {
    index: number;
    field: Field<DataType>;
    gameId: GameId;
    textSectionKey: string;
    data: DataType;
    readonly: boolean;
    onChange: (data: DataType) => void;
}

const FieldInput = <DataType extends {}>({
    index,
    gameId,
    field: { key, title, type, lines, readonly: fieldReadonly },
    textSectionKey,
    data,
    readonly,
    onChange
}: InputProps<DataType>) => {
    const { T } = useApp();
    return (
        <>
            {title ? (
                <SectionTitle
                    key={`field-${String(key ?? index)}-title`}
                    text={T(`game.${gameId}.${textSectionKey}.${String(key)}`)}
                />
            ) : null}
            {key ? (
                <TextField
                    key={`field-${String(key ?? index)}-input`}
                    fullWidth
                    multiline={!!lines}
                    rows={lines}
                    InputProps={{
                        readOnly: fieldReadonly || readonly,
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
                            type === 'number'
                                ? Number(onlyNumbers(value))
                                : value;
                        onChange({
                            ...data,
                            [key]: parsedValue
                        });
                    }}
                />
            ) : null}
        </>
    );
};

const FieldCheckbox = <DataType extends {}>({
    index,
    gameId,
    field: { key, title, readonly: fieldReadonly },
    textSectionKey,
    data,
    readonly,
    onChange
}: InputProps<DataType>) => {
    const { T } = useApp();
    return (
        <>
            {title ? (
                <SectionTitle
                    key={`field-${String(key ?? index)}-title`}
                    text={T(`game.${gameId}.${textSectionKey}.${String(key)}`)}
                />
            ) : null}
            {key ? (
                <FormControlLabel
                    key={`field-${String(key ?? index)}-switch`}
                    label={T(
                        `game.${gameId}.${textSectionKey}.${String(key ?? index)}`
                    )}
                    labelPlacement="start"
                    control={
                        <Checkbox
                            checked={!!data[key]}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                if (!fieldReadonly && !readonly) {
                                    onChange({
                                        ...data,
                                        [key]: e.target.checked
                                    });
                                }
                            }}
                        />
                    }
                />
            ) : null}
        </>
    );
};

interface FieldLayoutProps<DataType> {
    gameId: GameId;
    fields: Field<DataType>[];
    textSectionKey: string;
    data: DataType;
    readonly: boolean;
    onChange: (data: DataType) => void;
    rowGap?: number;
    columnGap?: number;
}

const FieldLayout = <DataType extends {}>(
    props: FieldLayoutProps<DataType>
) => {
    const { fields, columnGap, rowGap } = props;
    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
            columnGap={columnGap}
            rowGap={rowGap}
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
                                {childField.type === 'boolean' ? (
                                    <FieldCheckbox
                                        {...props}
                                        field={childField}
                                        index={idx}
                                    />
                                ) : (
                                    <FieldInput
                                        {...props}
                                        field={childField}
                                        index={idx}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box
                        key={`field-${String(field.key ?? index)}`}
                        gridColumn={`span ${field.gridColumn}`}
                        gap={2}
                    >
                        {field.type === 'boolean' ? (
                            <FieldCheckbox
                                {...props}
                                field={field}
                                index={index}
                            />
                        ) : (
                            <FieldInput
                                {...props}
                                field={field}
                                index={index}
                            />
                        )}
                    </Box>
                )
            )}
        </Box>
    );
};

export default FieldLayout;
