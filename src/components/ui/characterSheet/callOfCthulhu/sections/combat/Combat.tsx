import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { CoCCombat } from '../../../../../../types/games/callOfCthulhu';
import { combatKeys } from './combat.data';

interface CombatProps {
    combat: CoCCombat;
}

const Combat: React.FC<CombatProps> = ({ combat }) => (
    <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
        {combatKeys.map(({ key, label }) => (
            <Box
                key={`combat-${key}`}
                gridColumn="span 4"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                alignItems="center"
            >
                <Box gridColumn="span 8">
                    {label}
                </Box>
                <Box gridColumn="span 4">
                    <TextField
                        fullWidth
                        disabled
                        type="text"
                        size="small"
                        value={combat[key]}
                    />
                </Box>
            </Box>
        ))}
    </Box>
);

export default memo(Combat);