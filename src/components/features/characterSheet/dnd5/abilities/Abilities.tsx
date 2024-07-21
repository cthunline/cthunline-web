import type { DnD5Abilities } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { calculateAbility, displayModifier } from '../dnd5Sheet.helper.js';

interface AbilitiesProps {
    abilities: DnD5Abilities;
    readonly: boolean;
    onChange: (data: Partial<DnD5Abilities>) => void;
}

const Abilities = ({ abilities, readonly, onChange }: AbilitiesProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1rem">
            {(Object.keys(abilities) as (keyof DnD5Abilities)[]).map(
                (ability) => {
                    const data = abilities[ability];
                    return (
                        <Group key={`ability-${ability}`} w="100%" gap="0.5rem">
                            <Box flex="2 0">
                                {T(`game.dnd5.ability.${ability}`)}
                            </Box>
                            <Box flex="1 0">
                                <TextInput
                                    variant="contained"
                                    w="100%"
                                    readOnly={readonly}
                                    size="sm"
                                    label={T('game.dnd5.common.score')}
                                    value={data.score}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        onChange({
                                            [ability]: calculateAbility({
                                                ...data,
                                                score: Number(
                                                    onlyNumbers(e.target.value)
                                                )
                                            })
                                        });
                                    }}
                                />
                            </Box>
                            <Box flex="1 0">
                                <TextInput
                                    variant="contained"
                                    w="100%"
                                    readOnly
                                    size="sm"
                                    label={T('game.dnd5.common.modifier')}
                                    value={displayModifier(data.modifier)}
                                />
                            </Box>
                        </Group>
                    );
                }
            )}
        </Stack>
    );
};

export default Abilities;
