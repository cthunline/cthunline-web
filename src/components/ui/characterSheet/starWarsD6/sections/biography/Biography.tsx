import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { onlyNumbers } from '../../../../../../services/tools';
import { SWD6Biography } from '../../../../../../types/games/starWarsD6';
import { fields } from './biography.data';

interface BiographyProps {
    biography: SWD6Biography;
    readonly: boolean;
    onChange: (data: SWD6Biography) => void;
}

const Biography: React.FC<BiographyProps> = ({
    readonly,
    biography,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        {fields.map(({
            field,
            label,
            type,
            grid
        }) => (
            <Box key={field} gridColumn={`span ${grid}`}>
                <TextField
                    fullWidth
                    InputProps={{ readOnly: readonly }}
                    type="text"
                    size="small"
                    label={label}
                    name={field}
                    value={biography[field]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const { value } = e.target;
                        const parsedValue = type === 'number' ? (
                            Number(onlyNumbers(value))
                        ) : value;
                        onChange({
                            ...biography,
                            [field]: parsedValue
                        });
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Biography);