import { Checkbox, Grid } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools.js';
import { type GameId } from '../../../../../types/index.js';
import SectionTitle from '../sectionTitle/SectionTitle.js';
import Textarea from '../../../../common/Textarea.js';
import { useApp } from '../../../../../contexts/App.js';
import TextInput from '../../../../common/TextInput.js';

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

export const FieldInput = <DataType extends {}>({
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
            {!!title && (
                <SectionTitle
                    key={`field-${String(key ?? index)}-title`}
                    text={T(`game.${gameId}.${textSectionKey}.${String(key)}`)}
                    mb="0.25rem"
                />
            )}
            {!!key && !!lines && (
                <Textarea
                    key={`field-${String(key ?? index)}-input`}
                    variant="contained"
                    w="100%"
                    rows={lines}
                    readOnly={fieldReadonly || readonly}
                    size="sm"
                    label={
                        title
                            ? undefined
                            : T(
                                  `game.${gameId}.${textSectionKey}.${String(key ?? index)}`
                              )
                    }
                    name={key.toString()}
                    value={String(data[key])}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onChange({
                            ...data,
                            [key]: e.target.value
                        });
                    }}
                />
            )}
            {!!key && !lines && (
                <TextInput
                    key={`field-${String(key ?? index)}-input`}
                    variant="contained"
                    w="100%"
                    readOnly={fieldReadonly || readonly}
                    size="sm"
                    label={
                        title
                            ? undefined
                            : T(
                                  `game.${gameId}.${textSectionKey}.${String(key ?? index)}`
                              )
                    }
                    name={key.toString()}
                    value={String(data[key])}
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
            )}
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
            {!!title && (
                <SectionTitle
                    key={`field-${String(key ?? index)}-title`}
                    text={T(`game.${gameId}.${textSectionKey}.${String(key)}`)}
                />
            )}
            {!!key && (
                <Checkbox
                    key={`field-${String(key ?? index)}-switch`}
                    label={T(
                        `game.${gameId}.${textSectionKey}.${String(key ?? index)}`
                    )}
                    labelPosition="left"
                    checked={!!data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!fieldReadonly && !readonly) {
                            onChange({
                                ...data,
                                [key]: e.target.checked
                            });
                        }
                    }}
                />
            )}
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
    gap?: string | number;
}

const FieldLayout = <DataType extends {}>(
    props: FieldLayoutProps<DataType>
) => {
    const { fields, gap } = props;
    return (
        <Grid w="100%" gutter={gap}>
            {fields.map((field, index) => (
                <Grid.Col
                    key={`field-${String(field.key ?? index)}`}
                    span={field.gridColumn}
                >
                    {!!field.children && (
                        <Grid w="100%">
                            {field.children.map((childField, idx) => (
                                <Grid.Col
                                    key={`field-${String(childField.key ?? idx)}`}
                                    span={childField.gridColumn}
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
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}
                    {!field.children &&
                        (field.type === 'boolean' ? (
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
                        ))}
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default FieldLayout;
