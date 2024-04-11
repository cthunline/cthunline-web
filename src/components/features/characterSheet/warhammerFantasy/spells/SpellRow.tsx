import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { type WarhammerFantasySpell } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';
import Textarea from '../../../../common/Textarea.js';

type SpellRowInputProps = {
    readonly: boolean;
    center?: boolean;
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

const SpellRowInput = ({
    readonly,
    center,
    label,
    type,
    value,
    onChange
}: SpellRowInputProps) => (
    <TextInput
        variant="contained"
        w="100%"
        readOnly={readonly}
        ta={center ? 'center' : undefined}
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

type SpellRowProps = {
    readonly: boolean;
    spell: WarhammerFantasySpell;
    onChange: (spell: WarhammerFantasySpell) => void;
    onDelete: () => void;
};

const SpellRow = ({ readonly, spell, onChange, onDelete }: SpellRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Group w="100%" gap="0.5rem">
                    <Box flex="5 0">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.name')}
                            value={spell.name}
                            onChange={(name: string) => {
                                onChange({ ...spell, name });
                            }}
                        />
                    </Box>
                    <Box flex="1 0">
                        <SpellRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.spell.castingNumber'
                            )}
                            center
                            value={spell.castingNumber}
                            onChange={(castingNumber: number) => {
                                onChange({ ...spell, castingNumber });
                            }}
                        />
                    </Box>
                    <Box flex="2 0">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.range')}
                            center
                            value={spell.range}
                            onChange={(range: string) => {
                                onChange({ ...spell, range });
                            }}
                        />
                    </Box>
                    <Box flex="2 0">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.target')}
                            center
                            value={spell.target}
                            onChange={(target: string) => {
                                onChange({ ...spell, target });
                            }}
                        />
                    </Box>
                    <Box flex="2 0">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.duration')}
                            center
                            value={spell.duration}
                            onChange={(duration: string) => {
                                onChange({ ...spell, duration });
                            }}
                        />
                    </Box>
                </Group>
                <Textarea
                    variant="contained"
                    w="100%"
                    readOnly={readonly}
                    size="sm"
                    label={T('game.warhammerFantasy.spell.effect')}
                    value={spell.effect}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onChange({ ...spell, effect: e.target.value });
                    }}
                />
            </Stack>
            {!readonly && (
                <ActionIcon color="red" onClick={onDelete}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default SpellRow;
