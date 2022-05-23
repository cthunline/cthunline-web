import { CoCCombat } from '@cthunline/games';

export interface KeyData {
    key: keyof CoCCombat;
}

export const combatKeys: (keyof CoCCombat)[] = [
    'move',
    'damageBonus',
    'build'
];
