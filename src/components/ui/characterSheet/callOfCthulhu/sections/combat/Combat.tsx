import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { useApp } from '../../../../../contexts/App';
import { CoCCombat } from '../../../../../../types/games/callOfCthulhu';
import { combatKeys } from './combat.data';

interface CombatProps {
    combat: CoCCombat;
}

const Combat: React.FC<CombatProps> = ({ combat }) => {
    const { T } = useApp();

    return (
        <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
            {combatKeys.map((key) => (
                <Box
                    key={`combat-${key}`}
                    gridColumn="span 4"
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    alignItems="center"
                >
                    <Box gridColumn="span 8">
                        {T(`game.callOfCthulhu.combat.${key}`)}
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
};

export default memo(Combat);
