import React, { memo, useCallback } from 'react';
import { Box } from '@mui/material';
import { DnD5Abilities, DnD5Ability } from '@cthunline/games';

import Ability from './Ability';

interface AbilitiesProps {
    abilities: DnD5Abilities;
    readonly: boolean;
    onChange: (data: Partial<DnD5Abilities>) => void;
}

const Abilities: React.FC<AbilitiesProps> = ({
    abilities,
    readonly,
    onChange
}) => {
    const onAbilityChange = useCallback((
        ability: keyof DnD5Abilities,
        abilityData: DnD5Ability
    ) => {
        onChange({
            [ability]: abilityData
        });
    }, [onChange]);

    return (
        <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} columnGap={6}>
            {(Object.keys(abilities) as (keyof DnD5Abilities)[]).map((ability) => (
                <Ability
                    key={`ability-${ability}`}
                    ability={ability}
                    data={abilities[ability]}
                    readonly={readonly}
                    onChange={onAbilityChange}
                />
            ))}
        </Box>
    );
};

export default memo(Abilities);
