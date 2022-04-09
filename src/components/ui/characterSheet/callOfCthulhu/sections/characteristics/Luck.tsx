import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { onlyNumbers } from '../../../../../../services/tools';
import { CoCLuck } from '../../../../../../types/games/callOfCthulhu';
import { luckKeys } from './characteristics.data';

interface LuckProps {
    data: CoCLuck;
    readonly: boolean;
    onChange: (data: CoCLuck) => void;
}

const Luck: React.FC<LuckProps> = ({
    data,
    readonly,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" alignItems="center">
        <Box gridColumn="span 3" alignItems="center">
            Luck
        </Box>
        {luckKeys.map(({ key, label: keyLabel, editable }) => (
            <Box key={key.toString()} gridColumn="span 3">
                <TextField
                    fullWidth
                    disabled={!editable}
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    label={keyLabel}
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange({
                            ...data,
                            [key]: Number(onlyNumbers(e.target.value))
                        });
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Luck);
