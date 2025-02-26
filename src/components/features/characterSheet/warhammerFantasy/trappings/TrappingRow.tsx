import type { WarhammerFantasyTrapping } from '@cthunline/games';
import { Box, Group } from '@mantine/core';

import type { MoveAction } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type TrappingRowProps = {
    readonly: boolean;
    trapping: WarhammerFantasyTrapping;
    onChange: (trapping: WarhammerFantasyTrapping) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const TrappingRow = ({
    readonly,
    trapping,
    onChange,
    onMove,
    onDelete
}: TrappingRowProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Group w="100%" gap="0.5rem">
            <Box flex="7 0">
                <RowInput
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
                <RowInput
                    readonly={readonly}
                    type="number"
                    center
                    label={T('game.warhammerFantasy.trapping.encumbrance')}
                    value={trapping.encumbrance}
                    onChange={(encumbrance: number) => {
                        onChange({ ...trapping, encumbrance });
                    }}
                />
            </Box>
            {!readonly && !!onDelete && (
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default TrappingRow;
