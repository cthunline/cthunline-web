import React, { memo } from 'react';
import { Box, Checkbox } from '@mui/material';

import { SWD6WoundStatus } from '../../../../../../types/games/starWarsD6';
import { WoundStatusField, woundStatusFields } from './woundStatus.data';

interface WoundStatusProps {
    woundStatus: SWD6WoundStatus;
    readonly: boolean;
    onChange: (data: SWD6WoundStatus) => void;
}

const WoundStatus: React.FC<WoundStatusProps> = ({
    woundStatus,
    readonly,
    onChange
}) => (
    <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1} alignItems="center">
        {woundStatusFields.map(({ keys, label }: WoundStatusField, index) => ([
            <Box key={`woundStatus-${index.toString()}-label`} gridColumn="span 7">
                {label}
            </Box>,
            <Box key={`woundStatus-${index.toString()}-input`} gridColumn="span 5">
                {keys.map((key) => (
                    <Checkbox
                        key={`woundStatus-checkbox-${key}`}
                        checked={woundStatus[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!readonly) {
                                onChange({
                                    ...woundStatus,
                                    [key]: e.target.checked
                                });
                            }
                        }}
                    />
                ))}
            </Box>
        ]))}
    </Box>
);

export default memo(WoundStatus);
