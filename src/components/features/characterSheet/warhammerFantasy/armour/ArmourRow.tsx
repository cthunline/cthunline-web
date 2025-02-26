import type { WarhammerFantasyArmour } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import type { MoveAction } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type ArmourRowProps = {
    readonly: boolean;
    armour: WarhammerFantasyArmour;
    onChange: (armour: WarhammerFantasyArmour) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const ArmourRow = ({
    readonly,
    armour,
    onChange,
    onMove,
    onDelete
}: ArmourRowProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Group w="100%" gap="0.5rem">
                    <Box flex="6 0">
                        <RowInput
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
                        <RowInput
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
                        <RowInput
                            readonly={readonly}
                            center
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
                        <RowInput
                            readonly={readonly}
                            center
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
                <RowInput
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
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default ArmourRow;
