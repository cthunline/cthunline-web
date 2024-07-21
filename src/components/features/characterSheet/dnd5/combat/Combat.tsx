import type {
    DnD5Combat,
    DnD5DeathSaves,
    DnD5HitPoints
} from '@cthunline/games';
import { Box, Group, Slider, Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { displayModifier } from '../dnd5Sheet.helper.js';

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

const Combat = ({ combat, readonly, onChange }: CombatProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1.5rem">
            <Group w="100%" gap="1rem">
                {numberFieldKeys.map((key) => {
                    const value = combat[key] as number;
                    const isInitiative = key === 'initiative';
                    return [
                        <Box key={`combat-${key}-label`} flex="1 0">
                            {T(`game.dnd5.combat.${key}`)}
                        </Box>,
                        <Box key={`combat-${key}-input`} flex="1 0">
                            <TextInput
                                w="100%"
                                readOnly={isInitiative || readonly}
                                size="sm"
                                value={
                                    isInitiative
                                        ? displayModifier(value)
                                        : value
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    if (!isInitiative) {
                                        onChange({
                                            [key]: Number(
                                                onlyNumbers(e.target.value)
                                            )
                                        });
                                    }
                                }}
                            />
                        </Box>
                    ];
                })}
            </Group>
            <Group w="100%" gap="1rem">
                <Box flex="1 0">{T('game.dnd5.combat.hitPoints')}</Box>
                {hitPointKeys.map((key) => (
                    <Box key={`combat-hitPoints=${key}`} flex="1 0">
                        <TextInput
                            variant="contained"
                            w="100%"
                            readOnly={readonly}
                            size="sm"
                            label={T(`game.dnd5.common.${key}`)}
                            value={combat.hitPoints[key]}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onChange({
                                    hitPoints: {
                                        ...combat.hitPoints,
                                        [key]: Number(
                                            onlyNumbers(e.target.value)
                                        )
                                    }
                                });
                            }}
                        />
                    </Box>
                ))}
                <Box key="combat-hitDice-label" flex="1 0">
                    {T('game.dnd5.combat.hitDice')}
                </Box>
                <Box key="combat-hitDice-input" flex="1 0">
                    <TextInput
                        w="100%"
                        readOnly={readonly}
                        size="sm"
                        value={combat.hitDice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange({
                                hitDice: e.target.value
                            });
                        }}
                    />
                </Box>
            </Group>
            <Group w="100%" gap="1rem">
                <Box key="combat-deathSaves-label" flex="4 0">
                    {T('game.dnd5.combat.deathSaves')}
                </Box>
                {(
                    Object.keys(combat.deathSaves) as (keyof DnD5DeathSaves)[]
                ).map((key) => [
                    <Box
                        key={`combat-deathSaves=${key}-label`}
                        ta="right"
                        flex="2 0"
                    >
                        {T(`game.dnd5.common.${key}`)}
                    </Box>,
                    <Box key={`combat-deathSaves=${key}-slider`} flex="2 0">
                        <Slider
                            step={1}
                            min={0}
                            max={3}
                            disabled={readonly}
                            value={combat.deathSaves[key]}
                            onChange={(value: number) => {
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
            </Group>
        </Stack>
    );
};

export default Combat;
