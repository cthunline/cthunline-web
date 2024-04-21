import { type CoCCombat } from '@cthunline/games';
import { Box, Group } from '@mantine/core';

import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../../contexts/App.js';
import { combatKeys } from './combat.data.js';

interface CombatProps {
    combat: CoCCombat;
}

const Combat = ({ combat }: CombatProps) => {
    const { T } = useApp();

    return (
        <Group w="100%" gap="1rem">
            {combatKeys.map((key) => (
                <Group flex="1 0" key={`combat-${key}`}>
                    <Box flex="2 0">
                        {T(`game.callOfCthulhu.combat.${key}`)}
                    </Box>
                    <Box flex="1 0">
                        <TextInput
                            variant="contained"
                            w="100%"
                            readOnly
                            size="sm"
                            value={combat[key]}
                        />
                    </Box>
                </Group>
            ))}
        </Group>
    );
};

export default Combat;
