import type { AlienWeapon } from '@cthunline/games';
import { Box, Group } from '@mantine/core';

import type { MoveAction } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type WeaponRowProps = {
    readonly: boolean;
    weapon: AlienWeapon;
    onChange: (weapon: AlienWeapon) => void;
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
            <Box flex="6 0">
                <RowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.alien.equipment.weapons.name')}
                    value={weapon.name}
                    onChange={(name: string) => {
                        onChange({ ...weapon, name });
                    }}
                />
            </Box>
            <Box flex="2 0">
                <RowInput
                    readonly={readonly}
                    type="number"
                    center
                    label={T('game.alien.equipment.weapons.bonus')}
                    value={weapon.bonus}
                    onChange={(bonus: number) => {
                        onChange({ ...weapon, bonus });
                    }}
                />
            </Box>
            <Box flex="2 0">
                <RowInput
                    readonly={readonly}
                    type="number"
                    center
                    label={T('game.alien.equipment.weapons.damage')}
                    value={weapon.damage}
                    onChange={(damage: number) => {
                        onChange({ ...weapon, damage });
                    }}
                />
            </Box>
            <Box flex="3 0">
                <RowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.alien.equipment.weapons.range')}
                    value={weapon.range}
                    onChange={(range: string) => {
                        onChange({ ...weapon, range });
                    }}
                />
            </Box>
            {!readonly && !!onDelete && (
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default WeaponRow;
