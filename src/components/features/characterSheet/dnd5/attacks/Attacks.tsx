import type { DnD5Attack } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import { attackFields } from './attacks.data.js';

interface AttacksProps {
    attacks: DnD5Attack[];
    readonly: boolean;
    onChange: (index: number, data: DnD5Attack) => void;
    onDelete: (index: number) => void;
}

const Attacks = ({ attacks, readonly, onChange, onDelete }: AttacksProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack w="100%" gap="1.5rem">
            {attacks.flatMap((attack, index) => (
                <Group key={`attack-${index.toString()}`} w="100%" gap="1rem">
                    {attackFields.map(({ key, type, gridColumn }) => (
                        <Box
                            key={`attack-${index.toString()}-${key}`}
                            flex={`${gridColumn} 0`}
                        >
                            <TextInput
                                variant="contained"
                                w="100%"
                                readOnly={readonly}
                                size="sm"
                                label={T(`game.dnd5.attack.${key}`)}
                                value={attack[key]}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onChange(index, {
                                        ...attack,
                                        [key]:
                                            type === 'number'
                                                ? Number(
                                                      onlyNumbers(
                                                          e.target.value
                                                      )
                                                  )
                                                : e.target.value
                                    });
                                }}
                            />
                        </Box>
                    ))}
                    {!readonly && (
                        <ActionIcon color="red" onClick={() => onDelete(index)}>
                            <MdOutlineDeleteOutline />
                        </ActionIcon>
                    )}
                </Group>
            ))}
        </Stack>
    );
};

export default Attacks;
