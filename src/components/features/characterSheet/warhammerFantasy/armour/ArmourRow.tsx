import { type WarhammerFantasyArmour } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';

type ArmourRowInputProps = {
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

const ArmourRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: ArmourRowInputProps) => (
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

type ArmourRowProps = {
    readonly: boolean;
    armour: WarhammerFantasyArmour;
    onChange: (armour: WarhammerFantasyArmour) => void;
    onDelete: () => void;
};

const ArmourRow = ({
    readonly,
    armour,
    onChange,
    onDelete
}: ArmourRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Group w="100%" gap="0.5rem">
                    <Box flex="6 0">
                        <ArmourRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.armour.name')}
                            value={armour.name}
                            onChange={(name: string) => {
                                onChange({ ...armour, name });
                            }}
                        />
                    </Box>
                    <Box flex="4 0">
                        <ArmourRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.armour.locations')}
                            value={armour.locations}
                            onChange={(locations: string) => {
                                onChange({ ...armour, locations });
                            }}
                        />
                    </Box>
                    <Box flex="2 0">
                        <ArmourRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.armour.encumbrance'
                            )}
                            value={armour.encumbrance}
                            onChange={(encumbrance: number) => {
                                onChange({ ...armour, encumbrance });
                            }}
                        />
                    </Box>
                    <Box flex="2 0">
                        <ArmourRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.armour.armourPoints'
                            )}
                            value={armour.armourPoints}
                            onChange={(armourPoints: number) => {
                                onChange({ ...armour, armourPoints });
                            }}
                        />
                    </Box>
                </Group>
                <ArmourRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.armour.qualities')}
                    value={armour.qualities}
                    onChange={(qualities: string) => {
                        onChange({ ...armour, qualities });
                    }}
                />
            </Stack>
            {!readonly && !!onDelete && (
                <ActionIcon color="red" onClick={onDelete}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default ArmourRow;
