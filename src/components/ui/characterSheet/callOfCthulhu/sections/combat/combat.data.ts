import { CoCCombat } from '../../../../../../types/games/callOfCthulhu';

export interface KeyData {
    key: keyof CoCCombat;
}

export const combatKeys: (keyof CoCCombat)[] = [
    'move',
    'damageBonus',
    'build'
];
