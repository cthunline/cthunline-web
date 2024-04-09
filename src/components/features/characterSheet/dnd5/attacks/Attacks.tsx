import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { type DnD5Attack } from '@cthunline/games';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';
import { attackFields } from './attacks.data.js';

interface AttacksProps {
    attacks: DnD5Attack[];
    readonly: boolean;
    onChange: (index: number, data: DnD5Attack) => void;
    onDelete: (index: number) => void;
}

const Attacks = ({ attacks, readonly, onChange, onDelete }: AttacksProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1.5rem">
            {attacks
                .map((attack, index) => (
                    <Group
                        key={`attack-${index.toString()}`}
                        w="100%"
                        gap="1rem"
                    >
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
                            <Box>
                                <ActionIcon
                                    color="red"
                                    onClick={() => onDelete(index)}
                                >
                                    <MdOutlineDeleteOutline />
                                </ActionIcon>
                            </Box>
                        )}
                    </Group>
                ))
                .flat()}
        </Stack>
    );
};

export default Attacks;
