import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';
import { DnD5Abilities, DnD5Ability } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { displayModifier, calculateAbility } from '../dnd5Sheet.helper';

interface AbilityProps {
    ability: keyof DnD5Abilities;
    data: DnD5Ability;
    readonly: boolean;
    onChange: (ability: keyof DnD5Abilities, data: DnD5Ability) => void;
}

const Ability: React.FC<AbilityProps> = ({
    ability,
    data,
    readonly,
    onChange
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 6"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
        >
            <Box gridColumn="span 6">
                {T(`game.dnd5.ability.${ability}`)}
            </Box>
            <Box gridColumn="span 3">
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    label={T('game.dnd5.common.score')}
                    value={data.score}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(
                            ability,
                            calculateAbility({
                                ...data,
                                score: Number(onlyNumbers(e.target.value))
                            })
                        );
                    }}
                />
            </Box>
            <Box gridColumn="span 3">
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: true
                    }}
                    type="text"
                    size="small"
                    label={T('game.dnd5.common.modifier')}
                    value={displayModifier(data.modifier)}
                />
            </Box>
        </Box>
    );
};

export default memo(Ability);
