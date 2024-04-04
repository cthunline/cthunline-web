import { type DnD5Spellcasting } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools';
import { spellcastingFields } from './spellcasting.data';
import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';
import SpellLevel from './SpellLevel';
import Cantrips from './Cantrips';

interface SpellcastingProps {
    spellcasting: DnD5Spellcasting;
    readonly: boolean;
    onChange: (data: Partial<DnD5Spellcasting>) => void;
}

const Spellcasting = ({
    spellcasting,
    readonly,
    onChange
}: SpellcastingProps) => {
    const { T } = useApp();

    const maxLevel = Math.max(
        0,
        ...spellcasting.levels.map((lvl) => lvl.level)
    );

    return (
        <Stack w="100%" gap="1rem">
            <Group w="100%" gap="1rem">
                {spellcastingFields.map(({ key, type, gridColumn }) => (
                    <Box key={`spellcasting-${key}`} flex={`${gridColumn} 0`}>
                        <TextInput
                            variant="contained"
                            w="100%"
                            readOnly={readonly}
                            size="sm"
                            label={T(`game.dnd5.spellcasting.${key}`)}
                            value={String(spellcasting[key])}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onChange({
                                    ...spellcasting,
                                    [key]:
                                        type === 'number'
                                            ? Number(
                                                  onlyNumbers(e.target.value)
                                              )
                                            : e.target.value
                                });
                            }}
                        />
                    </Box>
                ))}
            </Group>
            <Cantrips
                cantrips={spellcasting.cantrips}
                readonly={readonly}
                onChange={(cantrips) => {
                    onChange({
                        ...spellcasting,
                        cantrips
                    });
                }}
            />
            {spellcasting.levels.map((spellLevel) => (
                <SpellLevel
                    key={`spellcasting-level-${spellLevel.level}`}
                    spellLevel={spellLevel}
                    readonly={readonly}
                    onChange={(data) => {
                        onChange({
                            ...spellcasting,
                            levels: spellcasting.levels.map((lvl) =>
                                lvl.level === data.level ? data : lvl
                            )
                        });
                    }}
                    isDelete={spellLevel.level === maxLevel}
                    onDelete={() => {
                        const levelToDelete = spellLevel.level;
                        onChange({
                            ...spellcasting,
                            levels: spellcasting.levels.filter(
                                ({ level }) => level !== levelToDelete
                            )
                        });
                    }}
                />
            ))}
        </Stack>
    );
};

export default Spellcasting;
