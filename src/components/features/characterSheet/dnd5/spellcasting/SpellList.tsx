import { ActionIcon, Box, Checkbox, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { type DnD5Spell } from '@cthunline/games';

import TextInput from '../../../../common/TextInput.js';

interface SpellListProps {
    spells: DnD5Spell[];
    readonly: boolean;
    onChange: (data: DnD5Spell[]) => void;
}

const SpellList = ({ spells, readonly, onChange }: SpellListProps) => (
    <Stack w="100%" gap="1rem">
        {spells.map(({ prepared, name }, index) => (
            <Group gap="1rem">
                <Checkbox
                    checked={prepared}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!readonly) {
                            onChange(
                                spells.map((spell, idx) =>
                                    index === idx
                                        ? {
                                              ...spell,
                                              prepared: e.target.checked
                                          }
                                        : spell
                                )
                            );
                        }
                    }}
                />
                <Box flex="9 0">
                    <TextInput
                        w="100%"
                        readOnly={readonly}
                        size="sm"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(
                                spells.map((spell, idx) =>
                                    index === idx
                                        ? {
                                              ...spell,
                                              name: e.target.value
                                          }
                                        : spell
                                )
                            );
                        }}
                    />
                </Box>
                {!readonly && (
                    <ActionIcon
                        color="red"
                        onClick={() => {
                            onChange(spells.filter((_s, idx) => index !== idx));
                        }}
                    >
                        <MdOutlineDeleteOutline />
                    </ActionIcon>
                )}
            </Group>
        ))}
    </Stack>
);

export default SpellList;
