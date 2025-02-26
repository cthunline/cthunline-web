import type { DnD5Equipment } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import Textarea from '../../../../common/Textarea.js';
import { equipmentFields, moneyFields } from './equipment.data.js';

interface EquipmentProps {
    equipment: DnD5Equipment;
    readonly: boolean;
    onChange: (data: Partial<DnD5Equipment>) => void;
}

const Equipment = ({ equipment, readonly, onChange }: EquipmentProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack w="100%" gap="1rem">
            <Group w="100%" gap="0.5rem">
                {...moneyFields.map((money) => {
                    const value = equipment.money[money];
                    return (
                        <Box key={`equipment-${money}`} flex="1 0">
                            <TextInput
                                variant="contained"
                                w="100%"
                                readOnly={readonly}
                                size="sm"
                                label={T(`game.dnd5.equipment.${money}`)}
                                value={value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onChange({
                                        money: {
                                            ...equipment.money,
                                            [money]: Number(
                                                onlyNumbers(e.target.value)
                                            )
                                        }
                                    });
                                }}
                            />
                        </Box>
                    );
                })}
            </Group>
            <Group w="100%" gap="0.5rem">
                {...equipmentFields.map((key) => (
                    <Box key={`equipment-${key}`} flex="1 0">
                        <Textarea
                            variant="contained"
                            w="100%"
                            rows={5}
                            readOnly={readonly}
                            size="sm"
                            label={T(`game.dnd5.equipment.${key}`)}
                            value={String(equipment[key])}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                                onChange({
                                    [key]: e.target.value
                                });
                            }}
                        />
                    </Box>
                ))}
            </Group>
        </Stack>
    );
};

export default Equipment;
