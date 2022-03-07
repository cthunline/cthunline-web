import React, { memo } from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';

import { CoCStatus } from '../../../../../../types/games/callOfCthulhu';
import { fields } from './status.data';

interface StatusProps {
    status: CoCStatus;
    readonly: boolean;
    onChange: (data: CoCStatus) => void;
}

const Status: React.FC<StatusProps> = ({
    readonly,
    status,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={2}>
        {fields.map(({ field, label }) => (
            <Box key={field} gridColumn="span 2">
                <FormControlLabel
                    label={label}
                    labelPlacement="start"
                    control={(
                        <Checkbox
                            disabled={readonly}
                            checked={status[field]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onChange({
                                    ...status,
                                    [field]: e.target.checked
                                });
                            }}
                        />
                    )}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Status);
