import { memo } from 'react';
import { Box, TextField, Checkbox } from '@mui/material';
import { SWD6Statistics } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { StatisticsField, statisticsFields } from './statistics.data';
import { onlyNumbers } from '../../../../../services/tools';

interface StatisticsProps {
    statistics: SWD6Statistics;
    readonly: boolean;
    onChange: (data: SWD6Statistics) => void;
}

const Statistics = ({ statistics, readonly, onChange }: StatisticsProps) => {
    const { T } = useApp();

    const getInput = (
        key: keyof SWD6Statistics,
        type: 'number' | 'boolean',
        data: SWD6Statistics
    ) => {
        if (type === 'number') {
            return (
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly,
                        classes: {
                            input: 'input-smaller-text'
                        }
                    }}
                    type="text"
                    size="small"
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange({
                            ...data,
                            [key]: Number(onlyNumbers(e.target.value))
                        });
                    }}
                />
            );
        }
        if (type === 'boolean') {
            return (
                <Checkbox
                    checked={!!data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!readonly) {
                            onChange({
                                ...data,
                                [key]: e.target.checked
                            });
                        }
                    }}
                />
            );
        }
        return null;
    };

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={1}
            alignItems="center"
        >
            {statisticsFields.map(({ key, type }: StatisticsField) => [
                <Box key={`statistics-${key}-label`} gridColumn="span 7">
                    {T(`game.starWarsD6.statistics.${key}`)}
                </Box>,
                <Box
                    key={`statistics-${key}-input`}
                    className="text-center"
                    gridColumn="span 3"
                >
                    {getInput(key, type, statistics)}
                </Box>
            ])}
        </Box>
    );
};

export default memo(Statistics);
