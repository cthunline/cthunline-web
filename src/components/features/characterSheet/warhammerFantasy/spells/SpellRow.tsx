import { type WarhammerFantasySpell } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { type MoveAction } from '../../../../../services/tools.js';
import RowMenuButton from '../generic/RowMenuButton.js';
import Textarea from '../../../../common/Textarea.js';
import { useApp } from '../../../../../contexts/App.js';
import RowInput from '../generic/RowInput.js';

type SpellRowProps = {
    readonly: boolean;
    spell: WarhammerFantasySpell;
    onChange: (spell: WarhammerFantasySpell) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const SpellRow = ({
    readonly,
    spell,
    onChange,
    onMove,
    onDelete
}: SpellRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Group w="100%" gap="0.5rem">
                    <Box flex="5 0">
                        <RowInput
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
                        <RowInput
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
                        <RowInput
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
                        <RowInput
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
                        <RowInput
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
            {!readonly && <RowMenuButton onMove={onMove} onDelete={onDelete} />}
        </Group>
    );
};

export default SpellRow;
