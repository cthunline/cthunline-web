import React, { memo } from 'react';
import { Box, TextField, Slider } from '@mui/material';
import { DnD5Combat, DnD5DeathSaves, DnD5HitPoints } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { displayModifier } from '../dnd5Sheet.helper';

interface CombatProps {
    combat: DnD5Combat;
    readonly: boolean;
    onChange: (data: Partial<DnD5Combat>) => void;
}

const numberFieldKeys: (keyof DnD5Combat)[] = [
    'armorClass',
    'speed',
    'initiative'
];

const hitPointKeys: (keyof DnD5HitPoints)[] = [
    'maximum',
    'current',
    'temporary'
];

const Combat: React.FC<CombatProps> = ({
    combat,
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
            columnGap={6}
        >
            {numberFieldKeys.map((key) => {
                const value = combat[key] as number;
                const isInitiative = key === 'initiative';
                return [
                    <Box key={`combat-${key}-label`} gridColumn="span 2">
                        {T(`game.dnd5.combat.${key}`)}
                    </Box>,
                    <Box key={`combat-${key}-input`} gridColumn="span 2">
                        <TextField
                            fullWidth
                            InputProps={{
                                readOnly: isInitiative || readonly,
                                classes: {
                                    input: 'input-smaller-text'
                                }
                            }}
                            type="text"
                            size="small"
                            value={isInitiative ? displayModifier(value) : value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (!isInitiative) {
                                    onChange({
                                        [key]: Number(onlyNumbers(e.target.value))
                                    });
                                }
                            }}
                        />
                    </Box>
                ];
            })}
            <Box gridColumn="span 2">
                {T('game.dnd5.combat.hitPoints')}
            </Box>
            {hitPointKeys.map((key) => (
                <Box key={`combat-hitPoints=${key}`} gridColumn="span 2">
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: readonly,
                            classes: {
                                input: 'input-smaller-text'
                            }
                        }}
                        type="text"
                        size="small"
                        label={T(`game.dnd5.common.${key}`)}
                        value={combat.hitPoints[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange({
                                hitPoints: {
                                    ...combat.hitPoints,
                                    [key]: Number(onlyNumbers(e.target.value))
                                }
                            });
                        }}
                    />
                </Box>
            ))}
            <Box key="combat-hitDice-label" gridColumn="span 2">
                {T('game.dnd5.combat.hitDice')}
            </Box>
            <Box key="combat-hitDice-input" gridColumn="span 2">
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly,
                        classes: {
                            input: 'input-smaller-text'
                        }
                    }}
                    type="text"
                    size="small"
                    value={combat.hitDice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange({
                            hitDice: e.target.value
                        });
                    }}
                />
            </Box>
            <Box key="combat-deathSaves-label" gridColumn="span 4">
                {T('game.dnd5.combat.deathSaves')}
            </Box>
            {(Object.keys(combat.deathSaves) as (keyof DnD5DeathSaves)[]).map((key) => [
                <Box key={`combat-deathSaves=${key}-label`} textAlign="right" gridColumn="span 2">
                    {T(`game.dnd5.common.${key}`)}
                </Box>,
                <Box key={`combat-deathSaves=${key}-slider`} gridColumn="span 2">
                    <Slider
                        disabled={readonly}
                        defaultValue={combat.deathSaves[key]}
                        valueLabelDisplay="auto"
                        marks
                        step={1}
                        min={0}
                        max={3}
                        onChange={(_e: Event, value: number | number[]) => {
                            onChange({
                                deathSaves: {
                                    ...combat.deathSaves,
                                    [key]: value as number
                                }
                            });
                        }}
                    />
                </Box>
            ])}
        </Box>
    );
};

export default memo(Combat);
