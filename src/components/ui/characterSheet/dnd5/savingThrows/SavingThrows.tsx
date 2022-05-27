import React, { memo } from 'react';
import { Box } from '@mui/material';
import { DnD5SavingThrows, DnD5Abilities } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import ModifierRow from '../modifierRow/ModifierRow';

interface SavingThrowsProps {
    savingThrows: DnD5SavingThrows;
    readonly: boolean;
    onChange: (data: Partial<DnD5SavingThrows>) => void;
}

const SavingThrows: React.FC<SavingThrowsProps> = ({
    savingThrows,
    readonly,
    onChange
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
            {(Object.keys(savingThrows) as (keyof DnD5Abilities)[]).map((ability) => {
                const data = savingThrows[ability];
                return (
                    <ModifierRow
                        key={`savingThrow-${ability}`}
                        readonly={readonly}
                        text={T(`game.dnd5.ability.${ability}`)}
                        proficient={data.proficient}
                        modifier={data.modifier}
                        onProficientChange={(checked) => {
                            onChange({
                                [ability]: {
                                    ...data,
                                    proficient: checked
                                }
                            });
                        }}
                    />
                );
            })}
        </Box>
    );
};

export default memo(SavingThrows);
