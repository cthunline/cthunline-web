import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';
import { DnD5Statistics } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';

interface StatisticsProps {
    statistics: DnD5Statistics;
    readonly: boolean;
    onChange: (data: Partial<DnD5Statistics>) => void;
}

const Statistics: React.FC<StatisticsProps> = ({
    statistics,
    readonly,
    onChange
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
            {(Object.keys(statistics) as (keyof DnD5Statistics)[]).map((stat) => {
                const value = statistics[stat];
                const editable = !readonly && stat !== 'passiveWisdom';
                return [
                    <Box key={`statistics-${stat}-label`} gridColumn="span 9">
                        {T(`game.dnd5.statistics.${stat}`)}
                    </Box>,
                    <Box key={`statistics-${stat}-input`} gridColumn="span 3">
                        <TextField
                            fullWidth
                            InputProps={{
                                readOnly: !editable,
                                classes: {
                                    input: 'input-smaller-text'
                                }
                            }}
                            type="text"
                            size="small"
                            value={value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (editable) {
                                    onChange({
                                        [stat]: Number(onlyNumbers(e.target.value))
                                    });
                                }
                            }}
                        />
                    </Box>
                ];
            })}
        </Box>
    );
};

export default memo(Statistics);
