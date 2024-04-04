import { type SWD6Statistics } from '@cthunline/games';
import { Box, Checkbox, Group, Stack } from '@mantine/core';

import { type StatisticsField, statisticsFields } from './statistics.data';
import { onlyNumbers } from '../../../../../services/tools';
import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';

interface StatisticsInputProps {
    statKey: keyof SWD6Statistics;
    type: 'number' | 'boolean';
    statistics: SWD6Statistics;
    readonly: boolean;
    onChange: (data: SWD6Statistics) => void;
}

const StatisticsInput = ({
    statKey,
    type,
    statistics,
    readonly,
    onChange
}: StatisticsInputProps) => {
    if (type === 'number') {
        return (
            <TextInput
                w="100%"
                readOnly={readonly}
                size="sm"
                value={String(statistics[statKey])}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange({
                        ...statistics,
                        [statKey]: Number(onlyNumbers(e.target.value))
                    });
                }}
            />
        );
    }
    if (type === 'boolean') {
        return (
            <Checkbox
                checked={!!statistics[statKey]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!readonly) {
                        onChange({
                            ...statistics,
                            [statKey]: e.target.checked
                        });
                    }
                }}
            />
        );
    }
    return null;
};

interface StatisticsProps {
    statistics: SWD6Statistics;
    readonly: boolean;
    onChange: (data: SWD6Statistics) => void;
}

const Statistics = ({ statistics, readonly, onChange }: StatisticsProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%">
            {statisticsFields.map(({ key, type }: StatisticsField) => (
                <Group key={`statistics-${key}`}>
                    <Box flex="2 0">
                        {T(`game.starWarsD6.statistics.${key}`)}
                    </Box>
                    <Box flex="1 0">
                        <StatisticsInput
                            statKey={key}
                            type={type}
                            statistics={statistics}
                            readonly={readonly}
                            onChange={onChange}
                        />
                    </Box>
                </Group>
            ))}
        </Stack>
    );
};

export default Statistics;
