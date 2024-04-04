import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { type DnD5SpellLevel } from '@cthunline/games';
import { FiPlusCircle } from 'react-icons/fi';

import { spellLevelFields, defaultSpell } from './spellcasting.data';
import { onlyNumbers } from '../../../../../services/tools';
import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';
import SpellList from './SpellList';

interface SpellLevelProps {
    spellLevel: DnD5SpellLevel;
    readonly: boolean;
    onChange: (data: DnD5SpellLevel) => void;
    isDelete: boolean;
    onDelete: () => void;
}

const SpellLevel = ({
    spellLevel,
    readonly,
    onChange,
    isDelete,
    onDelete
}: SpellLevelProps) => {
    const { T } = useApp();

    return (
        <Stack w="100%" gap="1rem">
            <Group gap="1rem">
                <Box flex="7 0">
                    {`${T('game.dnd5.spellcasting.level')} ${spellLevel.level}`}
                    {readonly ? null : (
                        <Box component="span" className="ml-5">
                            <ActionIcon
                                onClick={() => {
                                    onChange({
                                        ...spellLevel,
                                        spells: [
                                            ...spellLevel.spells,
                                            { ...defaultSpell }
                                        ]
                                    });
                                }}
                            >
                                <FiPlusCircle />
                            </ActionIcon>
                        </Box>
                    )}
                </Box>
                {spellLevelFields.map((key) => {
                    const value = spellLevel[key];
                    return (
                        <Box
                            key={`spellcasting-level-${spellLevel.level}-${key}`}
                            flex="2 0"
                        >
                            <TextInput
                                variant="contained"
                                w="100%"
                                readOnly={readonly}
                                size="sm"
                                label={T(`game.dnd5.spellcasting.${key}`)}
                                value={String(value)}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onChange({
                                        ...spellLevel,
                                        [key]: Number(
                                            onlyNumbers(e.target.value)
                                        )
                                    });
                                }}
                            />
                        </Box>
                    );
                })}
                <Box flex="1 0">
                    {!readonly && isDelete && (
                        <ActionIcon
                            color="red"
                            onClick={() => {
                                onDelete();
                            }}
                        >
                            <MdOutlineDeleteOutline />
                        </ActionIcon>
                    )}
                </Box>
            </Group>
            <SpellList
                spells={spellLevel.spells}
                readonly={readonly}
                onChange={(spells) => {
                    onChange({
                        ...spellLevel,
                        spells
                    });
                }}
            />
        </Stack>
    );
};

export default SpellLevel;
