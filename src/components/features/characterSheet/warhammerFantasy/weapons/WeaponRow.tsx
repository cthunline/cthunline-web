import { type WarhammerFantasyWeapon } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';

type WeaponRowInputProps = {
    readonly: boolean;
    label?: string;
} & (
    | {
          type: 'string';
          value: string;
          onChange?: (value: string) => void;
      }
    | {
          type: 'number';
          value: number;
          onChange?: (value: number) => void;
      }
);

const WeaponRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: WeaponRowInputProps) => (
    <TextInput
        variant="contained"
        w="100%"
        readOnly={readonly}
        ta={type === 'number' ? 'center' : undefined}
        size="sm"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (type === 'number') {
                onChange?.(Number(onlyNumbers(e.target.value)));
            } else {
                onChange?.(e.target.value);
            }
        }}
    />
);

type WeaponRowProps = {
    readonly: boolean;
    weapon: WarhammerFantasyWeapon;
    onChange: (weapon: WarhammerFantasyWeapon) => void;
    onDelete: () => void;
};

const WeaponRow = ({
    readonly,
    weapon,
    onChange,
    onDelete
}: WeaponRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%">
            <Stack w="100%">
                <Group w="100%">
                    <Box flex="6 0">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.name')}
                            value={weapon.name}
                            onChange={(name: string) => {
                                onChange({ ...weapon, name });
                            }}
                        />
                    </Box>
                    <Box flex="3 0">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.group')}
                            value={weapon.group}
                            onChange={(group: string) => {
                                onChange({ ...weapon, group });
                            }}
                        />
                    </Box>
                    <Box flex="2 0">
                        <WeaponRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.weapon.encumbrance'
                            )}
                            value={weapon.encumbrance}
                            onChange={(encumbrance: number) => {
                                onChange({ ...weapon, encumbrance });
                            }}
                        />
                    </Box>
                    <Box flex="3 0">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.rangeReach')}
                            value={weapon.rangeReach}
                            onChange={(rangeReach: string) => {
                                onChange({ ...weapon, rangeReach });
                            }}
                        />
                    </Box>
                </Group>
                <Group w="100%">
                    <Box flex="3 0">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.damage')}
                            value={weapon.damage}
                            onChange={(damage: string) => {
                                onChange({ ...weapon, damage });
                            }}
                        />
                    </Box>
                    <Box flex="11 0">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.qualities')}
                            value={weapon.qualities}
                            onChange={(qualities: string) => {
                                onChange({ ...weapon, qualities });
                            }}
                        />
                    </Box>
                </Group>
            </Stack>
            {!readonly && !!onDelete && (
                <ActionIcon color="red" onClick={onDelete}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default WeaponRow;
