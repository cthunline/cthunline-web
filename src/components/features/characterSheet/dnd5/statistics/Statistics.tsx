import { type DnD5Statistics } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../../contexts/App.js';

interface StatisticsProps {
    statistics: DnD5Statistics;
    readonly: boolean;
    onChange: (data: Partial<DnD5Statistics>) => void;
}

const Statistics = ({ statistics, readonly, onChange }: StatisticsProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1rem">
            {(Object.keys(statistics) as (keyof DnD5Statistics)[]).map(
                (stat) => {
                    const value = statistics[stat];
                    const editable = !readonly && stat !== 'passiveWisdom';
                    return (
                        <Group key={`statistics-${stat}`} w="100%" gap="0.5rem">
                            <Box flex="3 0">
                                {T(`game.dnd5.statistics.${stat}`)}
                            </Box>
                            <Box flex="1 0">
                                <TextInput
                                    w="100%"
                                    readOnly={!editable}
                                    size="sm"
                                    value={value}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        if (editable) {
                                            onChange({
                                                [stat]: Number(
                                                    onlyNumbers(e.target.value)
                                                )
                                            });
                                        }
                                    }}
                                />
                            </Box>
                        </Group>
                    );
                }
            )}
        </Stack>
    );
};

export default Statistics;
