import type { DnD5Equipment, DnD5Money } from '@cthunline/games';

export const moneyFields: (keyof DnD5Money)[] = [
    'copper',
    'silver',
    'electrum',
    'gold',
    'platinum'
];

export const equipmentFields: (keyof DnD5Equipment)[] = ['items', 'treasure'];
