import type { WarhammerFantasyWeapon } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import type { MoveAction } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type WeaponRowProps = {
    readonly: boolean;
    weapon: WarhammerFantasyWeapon;
    onChange: (weapon: WarhammerFantasyWeapon) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const WeaponRow = ({
    readonly,
    weapon,
    onChange,
    onMove,
    onDelete
}: WeaponRowProps) => {
    const T = useLocaleStore(({ T }) => T);

    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0" gap="0.5rem">
                <Group w="100%" gap="0.5rem">
                    <Box flex="6 0">
                        <RowInput
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
                        <RowInput
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
                        <RowInput
                            readonly={readonly}
                            type="number"
                            center
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
                        <RowInput
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
                <Group w="100%" gap="0.5rem">
                    <Box flex="3 0">
                        <RowInput
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
                        <RowInput
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
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default WeaponRow;
