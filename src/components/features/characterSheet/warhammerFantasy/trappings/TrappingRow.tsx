import { type WarhammerFantasyTrapping } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { ActionIcon, Box, Group } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';

type TrappingRowInputProps = {
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

const TrappingRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: TrappingRowInputProps) => (
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

type TrappingRowProps = {
    readonly: boolean;
    trapping: WarhammerFantasyTrapping;
    onChange: (trapping: WarhammerFantasyTrapping) => void;
    onDelete: () => void;
};

const TrappingRow = ({
    readonly,
    trapping,
    onChange,
    onDelete
}: TrappingRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%">
            <Box flex="7 0">
                <TrappingRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.trapping.name')}
                    value={trapping.name}
                    onChange={(name: string) => {
                        onChange({ ...trapping, name });
                    }}
                />
            </Box>
            <Box flex="1 0">
                <TrappingRowInput
                    readonly={readonly}
                    type="number"
                    label={T('game.warhammerFantasy.trapping.encumbrance')}
                    value={trapping.encumbrance}
                    onChange={(encumbrance: number) => {
                        onChange({ ...trapping, encumbrance });
                    }}
                />
            </Box>
            {!readonly && !!onDelete && (
                <ActionIcon color="red" onClick={onDelete}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default TrappingRow;
