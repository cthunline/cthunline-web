import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { onlyNumbers } from '../../../../../../services/tools';
import { CoCSanity } from '../../../../../../types/games/callOfCthulhu';
import { sanityKeys } from './characteristics.data';
import { controlSanity } from '../../cocSheet.helper';

interface SanityProps {
    data: CoCSanity;
    readonly: boolean;
    onChange: (data: CoCSanity) => void;
}

const Sanity: React.FC<SanityProps> = ({
    data,
    readonly,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" alignItems="center">
        <Box gridColumn="span 3">
            Sanity
        </Box>
        {sanityKeys.map(({ key, label: keyLabel, editable }) => (
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
                        onChange(
                            controlSanity({
                                ...data,
                                [key]: Number(onlyNumbers(e.target.value))
                            })
                        );
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Sanity);
