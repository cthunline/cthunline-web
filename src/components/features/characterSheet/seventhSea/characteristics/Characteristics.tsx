import { ActionIcon, Box, Group, Radio, Stack } from '@mantine/core';
import { MdClose } from 'react-icons/md';

import { useApp } from '../../../../../contexts/App.js';

import './Characteristics.css';

interface CharacteristicsProps<DataType> {
    data: DataType;
    textKey: string;
    sortByText?: boolean;
    readonly: boolean;
    onChange: (data: DataType) => void;
}

const Characteristics = <DataType extends Record<string, unknown>>({
    data,
    textKey,
    sortByText,
    readonly,
    onChange
}: CharacteristicsProps<DataType>) => {
    const { T } = useApp();

    const translations = Object.fromEntries(
        Object.keys(data).map((key: string) => [key, T(`${textKey}.${key}`)])
    );

    const dataKeys = Object.keys(data);

    if (sortByText) {
        dataKeys.sort((a, b) => translations[a].localeCompare(translations[b]));
    }

    const midIndex = Math.ceil(dataKeys.length / 2 - 1);
    const firstColumnKeys = dataKeys.slice(0, midIndex + 1);
    const secondColumnKeys = dataKeys.slice(midIndex + 1);

    return (
        <Group align="start" w="100%">
            {[firstColumnKeys, secondColumnKeys].map(
                (columnedKeys: string[], idx: number) => (
                    <Stack
                        flex="1 0"
                        key={`characteristic-column-${idx.toString()}`}
                    >
                        {columnedKeys.map((key: string) => {
                            const score = Number(data[key]);
                            return (
                                <Group
                                    key={`characteristic-${key}`}
                                    className="characteristic"
                                    w="100%"
                                    align="center"
                                >
                                    <Box flex="5 0">{translations[key]}</Box>
                                    <Group flex="5 0" gap="0.5rem">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <Radio
                                                key={`characteristi-${key}-radio-${value.toString()}`}
                                                defaultChecked={score >= value}
                                                value={value}
                                                size="sm"
                                                onClick={(e) => {
                                                    if (!readonly) {
                                                        onChange({
                                                            ...data,
                                                            [key]: Number(
                                                                (
                                                                    e.target as HTMLInputElement
                                                                ).value
                                                            )
                                                        });
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Group>
                                    <Group flex="2 0" align="center">
                                        {!readonly && (
                                            <ActionIcon
                                                className="characteristic-clear"
                                                size="xs"
                                                color="red"
                                                onClick={() => {
                                                    onChange({
                                                        ...data,
                                                        [key]: 0
                                                    });
                                                }}
                                            >
                                                <MdClose />
                                            </ActionIcon>
                                        )}
                                    </Group>
                                </Group>
                            );
                        })}
                    </Stack>
                )
            )}
        </Group>
    );
};

export default Characteristics;
